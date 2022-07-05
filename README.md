# Introdução

Um dos maiores desafios do universo da programação é a manutenibilidade de uma aplicação. Isso porque os softwares sofrem, de forma geral, de um processo chamado **degradação**. A degradação nada mais é do que uma lenta deterioração do desempenho do software ou de sua capacidade de resposta ao longo do tempo, levando o mesmo a se tornar inutilizável ou com necessidade de atualização.

É dever do engenheiro de software, do arquiteto e do desenvolvedor encontrarem soluções para retardar ao máximo tal processo, adotando práticas que maximizem a manutenibilidade do software. Nesse contexto, alguns conjuntos de princípios, boas práticas e soluções de arquitetura são adotadas. Robert "Uncle" Bob, em seu livro "Arquitetura Limpa", propõe sua própria filosofia de design de software para a temática, cujo objetivo é promover a máxima testabilidade e desacoplamento do sistema.

Na presente aplicação, adotaremos a implementação da Clean Architecture em um projeto básico em React Native.

# Arquitetura

[![Diagrama Clean Architecture](https://miro.medium.com/max/1400/1*KtSvmSz5XOeSTeBWEjUeXg.png 'Diagrama Clean Architecture')](https://miro.medium.com/max/1400/1*KtSvmSz5XOeSTeBWEjUeXg.png 'Diagrama Clean Architecture')

## Fluxo de Dados (Data Flow)

1. UI chama método da ViewModel / Store (Redux, Recoil);
2. ViewModel / Store executa UseCase;
3. UseCase orquestra o fluxo de dados de e para as entidades;
4. Cada Repositório retorna métodos de um DataSource.
5. Informação flui de volta para a UI onde é exibida.

## Camadas

### Camada de Dados (Data Layer)

É a camada mais "externa" da aplicação. Responsável por gerenciar os dados da aplicação, por exemplo, recuperar dados de uma API REST, gerenciar cache, etc. Contém modelos (models), fontes de dados (datasources) e repositórios.

### Camada de Apresentação (Presentation Layer)

Contém interfaces de usuário e lida com as interações do usuário, que são coordenadas pelas ViewModels / Stores.

### Camada de Domínio (Domain Layer)

É a camada mais "interna" da aplicação, sendo, portanto, independente das outras camadas. Responsável pelas regras de negócio. Contém entidades (entities), casos de uso (use cases) e interfaces de repositórios.

## Estrutura de diretórios

```bash
├── core # arquivos comuns da aplicação;
│ ├── cache # contém a implementação do cache local do aplicativo;
│ ├── components # contém componentes compartilhados pelas features;
│ ├── constants # contém as constantes da aplicação;
│ ├── error # contém as classes de erros (local / remoto);
│ ├── http # contém o provider do client HTTP;
│ ├── router # contém os navegadores da aplicação;
│ ├── style # contém temas da aplicação;
│ └── useCases # contém a abstração dos useCases;
├── di # injeção de dependência (DI);
│ ├── AppModule.ts # registra todos as dependências do core e dos módulos;
│ ├── DataModule.ts # registra os data-sources;
│ ├── RepositoryModule.ts # registra os repositories;
│ ├── UseCaseModule.ts # registra os use-cases;
│ ├── index.ts
│ └── type.ts # contém a chave de identificação de todas as classes registradas;
├── features # contém a lógica de cada feature da aplicação;
│ └── feature 1
│ ├── data # camada de dados da feature;
│ ├── domain # camada de domínio da feature;
│ └── presentation # camada de apresentação da feature;
└── utils # contém utilitários e helpers;
```

## Iniciando a implementação - DI

Injeção de dependência (DI) é um padrão que visa reduzir dependências "hardcoded". Ela promove a composição, possibilitando que uma dependência seja substituída por outra de mesmo tipo. Nós utilizamos DI constantemente no React sem sequer percebermos. Tome por base o seguinte exemplo:

```javascript
function HelloComponent(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Acima, temos um caso típico, onde a propriedade _name_ é injetada por um componente pai (ou mesmo um componente avô).

```javascript
function CounterComponent() {
  const { count } = useContext(CounterContext);
  return <p>Current count is {count}</p>;
}
```

Nesse caso, fazemos uso do Provider Pattern para fazer a injeção da dependência.

Essas estratégias funcionam muito bem para aplicações de pequeno porte. Porém, conforme a aplicação escalar, precisaremos utilizar de abordagens mais complexas de injeção de dependências.

## TSyringe (https://github.com/microsoft/tsyringe)

Conforme sua própria descricão, o TSyringe é "um contêiner leve de injeção de dependência para TypeScript/JavaScript para injeção de construtor."

Por meio do uso de decorators, o TSyringe executa a injeção de construtor nos construtores das classes decoradas. Para adicioná-lo à nossa aplicação, utilizamos:

    yarn add tsyringe

Como faremos uso de decorators, precisamos habilitá-los nas configurações do tsconfig:

```
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Também precisaremos adicionar um polyfill para a Reflect API. Caso você queira aprender mais sobre Reflection, indico a leitura [desse cara](http://blog.wolksoftware.com/decorators-metadata-reflection-in-typescript-from-novice-to-expert-part-4 'desse cara'). Aqui, utilizaremos o reflect-metadata.

```
yarn add reflect-metadata
```

Precisamos adicionar a importação do reflect-metadata antes de realizar qualquer registro em nosso contêiner IoC. Sendo assim, adicionaremos à primeira linha do nosso arquivo de entrada (App.tsx) esse import:

```
// App.tsx
import 'reflect-metadata'

const App = () => {
  // implementação do App
}

export default App
```

Como utilizamos React-Native e, consequentemente, Babel, precisamos configurá-lo para emitir os metadados do TypeScript, bem como para compilar decorators de classes e objetos para ES5:

```
yarn add --dev babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators
```

Por fim, adicionamos os plugins ao arquivo babel.config.js:

```
// babel.config.js
const pluginTransformTypescriptMetadata = [
  'babel-plugin-transform-typescript-metadata',
];

const pluginProposalDecorators = [
  '@babel/plugin-proposal-decorators',
  {
    legacy: true,
  },
];

const plugins = [
  pluginTransformTypescriptMetadata,
  pluginProposalDecorators
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins,
};
```

Com isso, preparamos nosso ambiente para o uso do nosso contêiner IoC. Em seguida, criaremos os módulos da aplicação. Possuímos 4 classes de módulos:

### AppModule

Responsável por registrar todas as dependências das features e do core:

```
// AppModule.ts
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
  // TODO
}

export { registerDependencies };
```

### DataModule

Aqui registraremos os DataSources de todas as features.

```
// DataModule.ts
function registerDataDependencies() {
  // TODO
}

export { registerDataDependencies };
```

Com isso, finalizamos a configuração do TSyringe.

### RepositoryModule

Aqui registraremos os DataSources de todas as features.

```
// RepositoryModule.ts
function registerRepositoryDependencies() {
  // TODO
}

export { registerRepositoryDependencies };
```

### UseCaseModule

```
// UseCaseModule.ts
function registerUseCaseDependencies() {
  // TODO
}

export { registerUseCaseDependencies };
```

O leitor atento percebeu que, no tópico "Estrutura de Diretórios", possuímos também um arquivo "types" em nossa pasta de DI. Nesse arquivo, temos basicamente um dicionário de "chave - valor", que nosso contêiner utilizará para localizar as dependências. Veremos como faremos os registros no nosso contêiner de IoC adiante.

## Core

Aqui contemos todas as dependências comuns da aplicação, como providers para armazenamento local (databases, etc) e clientes HTTP, componentes e navegadores, constantes e temas.

### Cache

A implementação de Cache pode ser feita utilizando-se de Promises ou Observables (caso utilizemos RxJS). É crucial definirmos uma interface abstrata da qual as implementações concretas derivam:

```
// RxCacheProvider.tsx
export interface RxCacheProvider {
  loadString(key: string): Observable<string | null>;
  load<T extends object>(key: string): Observable<T | null>;
  saveString(key: string, value: string): Observable<void>;
  save<T extends object>(key: string, value: T): Observable<void>;
  remove(key: string): Observable<void>;
  clear(): Observable<void>;
}
```

Dessa forma, conseguimos manter nossa aplicação agnóstica à implementação concreta. Por exemplo, podemos optar por utilizar a lib AsyncStorage para o cache:

```
// RxCacheProvider.tsx
export class RxAsyncStorageProvider implements RxCacheProvider {
  loadString(key: string) {
    return this.toObservable(AsyncStorage.getItem(key));
  }

  load<T extends object>(key: string) {
    return this.toObservable<T | null>(
      AsyncStorage.getItem(key).then(value => JSON.parse(value!)),
    );
  }

  saveString(key: string, value: string) {
    return this.toObservable(AsyncStorage.setItem(key, value));
  }

  save<T extends object>(key: string, value: T) {
    return this.toObservable(AsyncStorage.setItem(key, JSON.stringify(value)));
  }

  remove(key: string) {
    return this.toObservable(AsyncStorage.removeItem(key));
  }

  clear() {
    return this.toObservable(AsyncStorage.clear());
  }

  private toObservable<T>(promise: Promise<T>) {
    return from(promise);
  }
}
```

Para registrarmos a dependência do nosso CacheProvider, simplesmente editamos nosso arquivo **types.ts** (localizado na pasta di), adicionando a nova chave:

```
// types.ts
const AppDependencies = {
  RxCacheProvider: Symbol.for('RxCacheProvider'),
};

export { AppDependencies };
```

Adicionamos ao nosso módulo:

```
// AppModule.ts
import { RxAsyncStorageProvider, RxCacheProvider } from '@mapp/core/cache';

function registerCoreDependencies() {
  container
    .register<RxCacheProvider>(AppDependencies.RxCacheProvider, {
      useClass: RxAsyncStorageProvider,
    })
}
```

E, por fim, podemos obter a dependência a partir do nosso contêiner, usando:

```
const cacheProvider = conteiner.resolve<RxCacheProvider>(AppDependencies.RxCacheProvider);
```

Como podemos observar, caso tenhamos necessidade de substituir a nossa implementação concreta em qualquer momento, basta alterarmos a classe utilizada no atributo "useClass". Por exemplo, poderíamos passar a utilizar SQLite, bastando substituir a implementação RxAsyncStorageProvider por uma implementação RxSQLiteProvider que implemente a mesma interface RxCacheProvider.

Dessa forma, podemos obter resultados preditivos e manter nossa interface sem qualquer conhecimento de implementações concretas!

Porém, há um ponto a se observar: com a nossa implementação atual, obtemos resultados preditivos e independentes (sabemos que nosso método load sempre retornará um Observável de tipo T, por exemplo). Porém, caso venhamos a cair num cenário de exceção, devemos esperar um erro oriundo do AsyncStorage? Ou do SQLite? Nossa interface não deve ter conhecimento disso, o que nos leva ao próximo tópico:

### Erros

Nosso gol é obter uma classe de erro genérica, de modo que consigamos mapear uma exception de uma lib externa para uma exception de nosso domínio. Para tanto, criaremos uma classe comum Exception, das quais nossas demais classes herdarão:

```
// Exception.ts
export class Exception {}

export class LocalException<Raw = any> extends Exception {
  get rootCause(): Raw {
    return this.raw;
  }

  constructor(private readonly raw: Raw) {
    super();
  }
}
```

Agora, basta alterarmos nosso RxCacheProvider para que o mesmo retorne o erro esperado:

```
// RxCacheProvider.ts
import { LocalException } from '../error';

export class RxAsyncStorageProviderException extends LocalException {}

export class RxAsyncStorageProvider implements RxCacheProvider {
  ...
  private toObservable<T>(promise: Promise<T>) {
    return from(promise).pipe(
      catchError(error => {
        throw new RxAsyncStorageProviderException(error);
      }),
    );
  }
}
```

Legal! Conseguimos manter os erros de cache em um formato de nosso domínio, do qual o nosso front-end tem conhecimento.
