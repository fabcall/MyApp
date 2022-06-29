import { RxAsyncStorageProvider, RxCacheProvider } from '@mapp/core/cache';
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
  container.register<RxCacheProvider>(AppDependencies.RxCacheProvider, {
    useClass: RxAsyncStorageProvider,
  });
}

export { registerDependencies };
