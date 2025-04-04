import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.types";

export default class ConfigService implements IConfigService {
    private config: DotenvParseOutput;

    constructor() {
        const { error, parsed } = config();
        if (error) throw new Error('File .env not found');
        if (!parsed) throw new Error('Empty .env file');
        this.config = parsed;
    }
    
    public get(key: string): string {
        const res = this.config[key];
        if (!res) throw new Error('There is no such key');
        return res;
    }
}