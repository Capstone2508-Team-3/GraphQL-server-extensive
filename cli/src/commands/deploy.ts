import { execa } from "execa";
import path from "path";
import chalk from "chalk";
import { log, loadConfig, TERRAFORM_DIR } from "../utils.js";

interface DeployOptions {
  plan?: boolean;
  autoApprove?: boolean;
}

export async function deployCommand(options: DeployOptions) {
  console.log(chalk.bold.cyan("\n📦 Deploying Orion Infrastructure\n"));

  // Check for configuration
  const config = await loadConfig();
  if (!config) {
    log.error("No configuration found. Run `orion init` first.");
    process.exit(1);
  }

  // Check for required environment variables
  const requiredEnvVars = ["FASTLY_API_KEY"];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
  if (missingVars.length > 0) {
    log.error(`Missing environment variables: ${missingVars.join(", ")}`);
    console.log(chalk.dim("\nSet them with:"));
    missingVars.forEach((v) => {
      console.log(chalk.cyan(`  export ${v}="your-value"`));
    });
    process.exit(1);
  }

  const steps = options.plan ? 3 : 5;
  let currentStep = 0;

  try {
    // Step 1: Terraform init
    currentStep++;
    log.step(currentStep, steps, "Initializing Terraform...");
    await execa("terraform", ["init", "-input=false"], {
      cwd: TERRAFORM_DIR,
      stdio: "inherit",
    });
    log.success("Terraform initialized");

    // Step 2: Terraform validate
    currentStep++;
    log.step(currentStep, steps, "Validating configuration...");
    await execa("terraform", ["validate"], {
      cwd: TERRAFORM_DIR,
      stdio: "inherit",
    });
    log.success("Configuration valid");

    // Step 3: Terraform plan
    currentStep++;
    log.step(currentStep, steps, "Planning infrastructure changes...");
    await execa("terraform", ["plan", "-out=tfplan"], {
      cwd: TERRAFORM_DIR,
      stdio: "inherit",
    });

    if (options.plan) {
      console.log(chalk.yellow("\n⚠ Dry run complete. No changes applied.\n"));
      console.log(chalk.dim(`Run ${chalk.cyan("orion deploy")} to apply changes.\n`));
      return;
    }

    // Step 4: Terraform apply
    currentStep++;
    log.step(currentStep, steps, "Applying infrastructure...");
    const applyArgs = ["apply"];
    if (options.autoApprove) {
      applyArgs.push("-auto-approve");
    }
    applyArgs.push("tfplan");
    
    await execa("terraform", applyArgs, {
      cwd: TERRAFORM_DIR,
      stdio: "inherit",
    });
    log.success("Infrastructure deployed");

    // Step 5: Build and deploy Compute service
    currentStep++;
    log.step(currentStep, steps, "Building & deploying Compute@Edge service...");
    const computeDir = path.join(TERRAFORM_DIR, "services/compute");
    
    // Install dependencies if needed
    await execa("npm", ["install"], {
      cwd: computeDir,
      stdio: "inherit",
    });

    // Build the compute service
    await execa("npm", ["run", "build"], {
      cwd: computeDir,
      stdio: "inherit",
    });

    log.success("Compute service built");

    // Success summary
    console.log(chalk.bold.green("\n🎉 Deployment complete!\n"));
    console.log(chalk.dim("Your GraphQL cache endpoints:"));
    console.log(`  CDN:     ${chalk.cyan(`https://${config!.serviceName}-cache.global.ssl.fastly.net/graphql`)}`);
    console.log(`  Compute: ${chalk.cyan(`https://${config!.serviceName}-cache-compute.edgecompute.app/graphql`)}`);
    console.log();

  } catch (error) {
    log.error("Deployment failed");
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}

