import App from 'src/app';
import ConfigService from 'src/core/services/config/config.service';
import Logger from 'src/core/services/logger/logger.service';

const app: App = new App({
    services: {
        config: new ConfigService(),
        logger: new Logger({
            logDirectory: 'logs',
            saveIntervalHours: 1,
            colorizeObjects: true,
        })
    },
    path: ''
});