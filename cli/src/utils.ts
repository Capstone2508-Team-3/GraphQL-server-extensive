import chalk from "chalk";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export interface OrionConfig {
  version: string;
  serviceName: string;
  origin: {
    url: string;
    host: string;
  };
  aws: {
    region: string;
  };
}

// Path to the terraform directory (relative to cli/)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const TERRAFORM_DIR = path.resolve(__dirname, "../../terraform-fastly-prototype");
export const CONFIG_FILE = path.join(TERRAFORM_DIR, "orion.json");

export const log = {
  info: (msg: string) => console.log(chalk.blue("ℹ"), msg),
  success: (msg: string) => console.log(chalk.green("✓"), msg),
  warn: (msg: string) => console.log(chalk.yellow("⚠"), msg),
  error: (msg: string) => console.log(chalk.red("✗"), msg),
  step: (num: number, total: number, msg: string) =>
    console.log(chalk.cyan(`[${num}/${total}]`), msg),
};

export async function loadConfig(): Promise<OrionConfig | null> {
  if (!existsSync(CONFIG_FILE)) {
    return null;
  }
  const content = await readFile(CONFIG_FILE, "utf-8");
  return JSON.parse(content);
}

export async function saveConfig(config: OrionConfig): Promise<void> {
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function parseOriginUrl(url: string): { host: string; path: string; port: number; ssl: boolean } {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    path: parsed.pathname,
    port: parsed.port ? parseInt(parsed.port) : parsed.protocol === "https:" ? 443 : 80,
    ssl: parsed.protocol === "https:",
  };
}

export async function replaceInFile(
  filePath: string,
  searchValue: string | RegExp,
  replaceValue: string
): Promise<boolean> {
  const content = await readFile(filePath, "utf-8");
  const newContent = content.replace(searchValue, replaceValue);
  if (content !== newContent) {
    await writeFile(filePath, newContent);
    return true;
  }
  return false;
}

