import ModuleBuilder from './module.builder.class';

export interface ModuleBuilderOptions {
    name?: string;
    import?: boolean;
    type?: 'module' | 'event';
}

export interface ModuleBuilderWithFile {
    builder: ModuleBuilder;
    filename: string;
}