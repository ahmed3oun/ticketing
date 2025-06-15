
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
            port: process.env.PORT || 3000,
            dbUrl: process.env.DB_URL || 'mongodb://localhost:27017/ticketing',
            jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
            // Add more configuration options as needed
        };
    }

    public get(key: string): any {
        return this.config[key];
    }

    public getOrElseThrow(key: string): any {
        const value = this.config[key];
        if (value === undefined) {
            throw new Error(`Configuration key "${key}" not found`);
        }
    }
}

const configService = ConfigService.getInstance();
export default configService;