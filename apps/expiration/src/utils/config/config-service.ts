class ConfigService {
    private static instance: ConfigService;
    private config: { [key: string]: any } = {};

    private constructor() {
        this.loadConfig();
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public loadConfig(): void {
        // Load configuration from environment variables or a config file
        this.config = {
            ...process.env, // Load all environment variables
        };
    }

    public get(key: string): any {
        return this.config[key];
    }

    public getOrElseThrow(key: string): string {
        const value = this.config[key];
        if (value === undefined) {
            throw new Error(`Configuration key "${key}" not found`);
        }
        return value;
    }
}

const configService = ConfigService.getInstance();
export default configService;