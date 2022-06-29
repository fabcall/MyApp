import { RxAsyncStorageProvider, RxCacheProvider } from '@mapp/core/cache';
import { RxAxiosProvider, RxRemoteProvider } from '@mapp/core/http';
import BuildConfig from 'react-native-config';
import { container } from 'tsyringe';

import { registerDataDependencies } from './DataModule';
import { registerRepositoryDependencies } from './RepositoryModule';
import { AppDependencies } from './type';
import { registerUseCaseDependencies } from './UseCaseModule';

function registerDependencies() {
  registerCoreDependencies();

  registerDataDependencies();
  registerRepositoryDependencies();
  registerUseCaseDependencies();
}

function registerCoreDependencies() {
  container
    .register<RxCacheProvider>(AppDependencies.RxCacheProvider, {
      useClass: RxAsyncStorageProvider,
    })
    .register<RxRemoteProvider>(AppDependencies.RxRemoteProvider, {
      useValue: new RxAxiosProvider({
        baseURL: BuildConfig.BASE_URL,
      }),
    });
}

export { registerDependencies };
