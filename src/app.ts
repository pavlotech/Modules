import { ServiceRegistry, AppDependencies } from 'src/core/interfaces/app/app.interface';
import { ModuleManager } from 'src/core/services/module/module.manager.class';

export default class App {
    public readonly services: ServiceRegistry;
    public readonly modules: Record<string, any> = {};
    public readonly moduleManager: ModuleManager;

    constructor(params: AppDependencies) {
        this.services = params.services;
        this.moduleManager = new ModuleManager(
            this,
            this.services,
            params.path
        );

        this.main().catch(err => {
            this.services.logger.error('Error in main:', err);
        });
    }

    private async main(): Promise<void> {
        await this.moduleManager.initialize();
        Object.assign(this.modules, this.moduleManager.modules);
    }
}