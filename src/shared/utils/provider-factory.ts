import { Provider } from '@nestjs/common';
import { CustomConfigService } from 'src/modules/config';

export const createProviderFactory = (
  token: any,
  useFactory: (configService: CustomConfigService) => any,
): Provider => {
  return {
    provide: token,
    useFactory: (configService: CustomConfigService) => {
      return useFactory(configService);
    },
    inject: [CustomConfigService],
  };
};

export const createProviderBasedOnDevMode = (
  token: any,
  provider: (devMode: boolean) => any,
) => {
  return createProviderFactory(token, (configService) => {
    const devMode = configService.get<boolean>('devMode')!;
    return provider(devMode);
  });
};
