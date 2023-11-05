import { ConfigService } from '@nestjs/config';
import { Configuration } from './configuration';

export class CustomConfigService extends ConfigService<Configuration> {}
