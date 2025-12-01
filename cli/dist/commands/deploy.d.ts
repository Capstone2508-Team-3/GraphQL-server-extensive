interface DeployOptions {
    plan?: boolean;
    autoApprove?: boolean;
}
export declare function deployCommand(options: DeployOptions): Promise<void>;
export {};
