import path from 'path';
import { ServiceRegistry } from 'src/core/interfaces/app/app.interface';
import App from 'src/app';

export interface ModuleOptions {
    app: App;
    services: ServiceRegistry;
    filename?: string;
}

export default class Module {
    public readonly services: ServiceRegistry;
    public readonly app: App;
    public readonly name: string;

    constructor(
        options: ModuleOptions,
        buildFn: (module: Module) => Module | Promise<Module>
    ) {
        this.services = options.services;
        this.app = options.app;
        this.name = options.filename ? this.generateModuleName(options.filename) : 'module';
        this.buildFn = buildFn;
    }

    private readonly buildFn: (module: Module) => Module | Promise<Module>;

    private generateModuleName(filename: string): string {
        return path.basename(filename, path.extname(filename)).replace(/\./g, '_');
    }

    public async init(): Promise<void> {
        await this.buildFn(this);
    }
}