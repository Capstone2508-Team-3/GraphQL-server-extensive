import inquirer from "inquirer";
import path from "path";
import chalk from "chalk";
import { log, saveConfig, loadConfig, parseOriginUrl, replaceInFile, TERRAFORM_DIR, } from "../utils.js";
export async function initCommand() {
    console.log(chalk.bold.cyan("\n🚀 Orion - GraphQL Edge Caching Setup\n"));
    // Check if already configured
    const existingConfig = await loadConfig();
    if (existingConfig) {
        const { overwrite } = await inquirer.prompt([
            {
                type: "confirm",
                name: "overwrite",
                message: `Existing configuration found for "${existingConfig.serviceName}". Overwrite?`,
                default: false,
            },
        ]);
        if (!overwrite) {
            log.info("Setup cancelled.");
            return;
        }
    }
    // Gather configuration
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "originUrl",
            message: "What is your GraphQL origin URL?",
            default: "http://localhost:4000/graphql",
            validate: (input) => {
                try {
                    new URL(input);
                    return true;
                }
                catch {
                    return "Please enter a valid URL (e.g., https://api.example.com/graphql)";
                }
            },
        },
        {
            type: "input",
            name: "serviceName",
            message: "What would you like to name this service?",
            default: "orion",
            validate: (input) => {
                if (!/^[a-z0-9-]+$/.test(input)) {
                    return "Service name must be lowercase alphanumeric with hyphens only";
                }
                return true;
            },
        },
        {
            type: "list",
            name: "awsRegion",
            message: "Select your AWS region:",
            choices: [
                "us-east-1",
                "us-east-2",
                "us-west-1",
                "us-west-2",
                "eu-west-1",
                "eu-central-1",
                "ap-southeast-1",
                "ap-northeast-1",
            ],
            default: "us-east-1",
        },
    ]);
    const origin = parseOriginUrl(answers.originUrl);
    console.log(chalk.dim("\nUpdating configuration files...\n"));
    // Update fastly-compute.tf - backend address
    const computeTf = path.join(TERRAFORM_DIR, "fastly-compute.tf");
    await replaceInFile(computeTf, /address\s*=\s*"[^"]+"/, `address = "${origin.host}"`);
    await replaceInFile(computeTf, /port\s*=\s*\d+/, `port    = ${origin.port}`);
    log.success(`Updated ${chalk.cyan("fastly-compute.tf")} with origin: ${origin.host}`);
    // Update compute service source - origin URL
    const computeIndex = path.join(TERRAFORM_DIR, "services/compute/src/index.ts");
    await replaceInFile(computeIndex, /http:\/\/ec2-54-165-253-142\.compute-1\.amazonaws\.com\/graphql/g, answers.originUrl);
    await replaceInFile(computeIndex, /https?:\/\/[^"]+\/graphql/g, answers.originUrl);
    log.success(`Updated ${chalk.cyan("services/compute/src/index.ts")} with origin URL`);
    // Update fastly.toml - local server backend
    const fastlyToml = path.join(TERRAFORM_DIR, "services/compute/fastly.toml");
    await replaceInFile(fastlyToml, /url\s*=\s*"[^"]+"/, `url = "${origin.ssl ? "https" : "http"}://${origin.host}"`);
    await replaceInFile(fastlyToml, /name\s*=\s*"[^"]+"/, `name = "${answers.serviceName}"`);
    log.success(`Updated ${chalk.cyan("services/compute/fastly.toml")}`);
    // Update AWS Kinesis region
    const kinesisTf = path.join(TERRAFORM_DIR, "fastly-compute.tf");
    await replaceInFile(kinesisTf, /region\s*=\s*"[^"]+"/, `region   = "${answers.awsRegion}"`);
    // Save configuration
    const config = {
        version: "1.0",
        serviceName: answers.serviceName,
        origin: {
            url: answers.originUrl,
            host: origin.host,
        },
        aws: {
            region: answers.awsRegion,
        },
    };
    await saveConfig(config);
    log.success(`Saved configuration to ${chalk.cyan("orion.json")}`);
    // Summary
    console.log(chalk.bold.green("\n✓ Configuration complete!\n"));
    console.log(chalk.dim("Summary:"));
    console.log(`  Origin:       ${chalk.white(answers.originUrl)}`);
    console.log(`  Service Name: ${chalk.white(answers.serviceName)}`);
    console.log(`  AWS Region:   ${chalk.white(answers.awsRegion)}`);
    console.log(chalk.dim("\nNext steps:"));
    console.log(`  1. Create a ${chalk.cyan(".env")} file in ${chalk.cyan("terraform-fastly-prototype/")}:`);
    console.log(chalk.dim(`     FASTLY_API_KEY=your-fastly-api-token`));
    console.log(chalk.dim(`     AWS_ACCESS_KEY_ID=your-aws-key`));
    console.log(chalk.dim(`     AWS_SECRET_ACCESS_KEY=your-aws-secret`));
    console.log(`  2. Run ${chalk.cyan("orion deploy")} to provision infrastructure\n`);
}
