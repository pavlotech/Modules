import path from 'path';
import fs from 'fs';
import { ServiceRegistry } from 'src/core/interfaces/app/app.interface';
import Module from './module.service';
import ModuleBuilder from './module.builder.class';
import App from 'src/app';
import { ModuleBuilderWithFile } from './module.types';

export class ModuleManager {
    private readonly app: App;
    private readonly services: ServiceRegistry;
    private readonly modulesDict: Record<string, Module> = {};
    private readonly modulesPath: string;

    constructor(
        app: App,
        services: ServiceRegistry,
        modulesPath: string
    ) {
        this.app = app;
        this.services = services;
        this.modulesPath = modulesPath;
    }

    public get modules(): Record<string, Module> {
        return this.modulesDict;
    }

    public async initialize(): Promise<void> {
        const allModules: ModuleBuilderWithFile[] = await this.importModules();
        await this.buildModules(allModules);
    }

    private async importModules(): Promise<ModuleBuilderWithFile[]> {
        const modules: ModuleBuilderWithFile[] = [];
        const startPath: string = path.join(process.cwd(), 'src', 'modules', this.modulesPath);
        const dirsToExplore: string[] = [startPath];
        const filePaths: string[] = [];

        while (dirsToExplore.length > 0) {
            const currentDir: string = dirsToExplore.pop()!;
            try {
                const entries: fs.Dirent[] = await fs.promises.readdir(currentDir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath: string = path.join(currentDir, entry.name);
                    if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
                        filePaths.push(fullPath);
                    } else if (entry.isDirectory()) {
                        dirsToExplore.push(fullPath);
                    }
                }
            } catch (error) {
                this.services.logger.error(`Error reading directory ${currentDir}:`, error);
            }
        }

        const importPromises: Promise<void>[] = filePaths.map(async (filePath: string) => {
            try {
                const importedModule = await import(filePath);
                const builder: ModuleBuilder = importedModule.default as ModuleBuilder;
                if (builder && typeof builder.build === 'function' && builder.options.import !== false) {
                    const moduleName: string = path
                        .basename(filePath, path.extname(filePath))
                        .replace(/\./g, '_');
                    modules.push({ builder, filename: moduleName });
                    this.services.logger.info(`Imported module "${moduleName}" from "${filePath}"`);
                }
            } catch (error) {
                this.services.logger.error(`Error loading module from ${filePath}:`, error);
            }
        });

        await Promise.all(importPromises);
        return modules;
    }

    private async buildModules(moduleBuilders: ModuleBuilderWithFile[]): Promise<void> {
        for (const { builder, filename } of moduleBuilders) {
            const moduleInstance: Module = new Module(
                {
                    app: this.app,
                    services: this.services,
                    filename
                },
                builder.build
            );
            await moduleInstance.init();
            this.modulesDict[moduleInstance.name] = moduleInstance;
        }
    }
}