import chalk from "chalk";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Path to the terraform directory (relative to cli/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TERRAFORM_DIR = path.resolve(__dirname, "../../terraform-fastly-prototype");
export const CONFIG_FILE = path.join(TERRAFORM_DIR, "orion.json");
export const log = {
    info: (msg) => console.log(chalk.blue("ℹ"), msg),
    success: (msg) => console.log(chalk.green("✓"), msg),
    warn: (msg) => console.log(chalk.yellow("⚠"), msg),
    error: (msg) => console.log(chalk.red("✗"), msg),
    step: (num, total, msg) => console.log(chalk.cyan(`[${num}/${total}]`), msg),
};
export async function loadConfig() {
    if (!existsSync(CONFIG_FILE)) {
        return null;
    }
    const content = await readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(content);
}
export async function saveConfig(config) {
    await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}
export function parseOriginUrl(url) {
    const parsed = new URL(url);
    return {
        host: parsed.hostname,
        path: parsed.pathname,
        port: parsed.port ? parseInt(parsed.port) : parsed.protocol === "https:" ? 443 : 80,
        ssl: parsed.protocol === "https:",
    };
}
export async function replaceInFile(filePath, searchValue, replaceValue) {
    const content = await readFile(filePath, "utf-8");
    const newContent = content.replace(searchValue, replaceValue);
    if (content !== newContent) {
        await writeFile(filePath, newContent);
        return true;
    }
    return false;
}
