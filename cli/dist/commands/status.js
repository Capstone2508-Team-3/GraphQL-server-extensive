import chalk from "chalk";
import { log, loadConfig, TERRAFORM_DIR } from "../utils.js";
import { existsSync } from "fs";
import path from "path";
export async function statusCommand() {
    console.log(chalk.bold.cyan("\n📊 Orion Status\n"));
    const config = await loadConfig();
    if (!config) {
        log.warn("Not configured. Run `orion init` to get started.\n");
        return;
    }
    console.log(chalk.dim("Configuration:"));
    console.log(`  Service Name: ${chalk.white(config.serviceName)}`);
    console.log(`  Origin URL:   ${chalk.white(config.origin.url)}`);
    console.log(`  AWS Region:   ${chalk.white(config.aws.region)}`);
    console.log();
    console.log(chalk.dim("Expected Endpoints (after deploy):"));
    console.log(`  CDN:     ${chalk.cyan(`https://${config.serviceName}-cache.global.ssl.fastly.net`)}`);
    console.log(`  Compute: ${chalk.cyan(`https://${config.serviceName}-cache-compute.edgecompute.app`)}`);
    console.log();
    // Check Terraform state
    const tfStatePath = path.join(TERRAFORM_DIR, "terraform.tfstate");
    const hasState = existsSync(tfStatePath);
    console.log(chalk.dim("Infrastructure:"));
    if (hasState) {
        console.log(`  Terraform State: ${chalk.green("● Exists")}`);
        console.log(chalk.dim(`  Run ${chalk.cyan("terraform show")} in the terraform directory for details.`));
    }
    else {
        console.log(`  Terraform State: ${chalk.yellow("○ Not deployed")}`);
        console.log(chalk.dim(`  Run ${chalk.cyan("orion deploy")} to provision infrastructure.`));
    }
    console.log();
    // Check environment variables
    console.log(chalk.dim("Environment:"));
    const envVars = ["FASTLY_API_KEY", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];
    envVars.forEach((v) => {
        const isSet = !!process.env[v];
        const status = isSet ? chalk.green("● Set") : chalk.yellow("○ Not set");
        console.log(`  ${v}: ${status}`);
    });
    console.log();
}
