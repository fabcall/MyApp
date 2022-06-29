import { registerDataDependencies } from './DataModule';
import { registerRepositoryDependencies } from './RepositoryModule';
import { registerUseCaseDependencies } from './UseCaseModule';

function registerDependencies() {
  registerCoreDependencies();

  registerDataDependencies();
  registerRepositoryDependencies();
  registerUseCaseDependencies();
}

function registerCoreDependencies() {}

export { registerDependencies };
