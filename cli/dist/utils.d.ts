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
export declare const TERRAFORM_DIR: string;
export declare const CONFIG_FILE: string;
export declare const log: {
    info: (msg: string) => void;
    success: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    step: (num: number, total: number, msg: string) => void;
};
export declare function loadConfig(): Promise<OrionConfig | null>;
export declare function saveConfig(config: OrionConfig): Promise<void>;
export declare function parseOriginUrl(url: string): {
    host: string;
    path: string;
    port: number;
    ssl: boolean;
};
export declare function replaceInFile(filePath: string, searchValue: string | RegExp, replaceValue: string): Promise<boolean>;
