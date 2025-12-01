#!/usr/bin/env node
import { config } from "dotenv";
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { deployCommand } from "./commands/deploy.js";
import { statusCommand } from "./commands/status.js";
// Load .env from terraform directory (where secrets should live)
config({ path: "../terraform-fastly-prototype/.env" });
// Also try loading from cli directory
config();
const program = new Command();
program
    .name("orion")
    .description("CLI tool for setting up GraphQL edge caching with Fastly")
    .version("1.0.0");
program
    .command("init")
    .description("Initialize Orion configuration for your GraphQL origin")
    .action(initCommand);
program
    .command("deploy")
    .description("Deploy infrastructure with Terraform and Fastly Compute")
    .option("--plan", "Only show what would be deployed (dry run)")
    .option("--auto-approve", "Skip interactive approval for Terraform")
    .action(deployCommand);
program
    .command("status")
    .description("Show current configuration and service status")
    .action(statusCommand);
program.parse();
