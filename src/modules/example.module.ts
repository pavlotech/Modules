import ModuleBuilder, { Module } from "src/core/services/module/module.builder.class";

export default new ModuleBuilder({ type: 'module' }, (module: Module) => {
    module.services.logger.log('Module loaded');
    return module;
});