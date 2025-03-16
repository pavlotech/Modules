import { IConfigService } from 'src/core/services/config/config.types';
import Logger from 'src/core/services/logger/logger.service';

export interface ServiceRegistry {
    config: IConfigService;
    logger: Logger;
}

export interface AppDependencies {
    services: ServiceRegistry;
    path: string;
}