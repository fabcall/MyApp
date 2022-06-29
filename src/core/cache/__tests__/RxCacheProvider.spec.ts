import AsyncStorage from '@react-native-async-storage/async-storage';

import { RxAsyncStorageProvider, RxCacheProvider } from '../';

let cacheProvider: RxCacheProvider;

const VALUE_OBJECT = { x: 1 };
const VALUE_STRING = JSON.stringify(VALUE_OBJECT);

describe('RxAsyncStorageProvider', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockReturnValue(
      Promise.resolve(VALUE_STRING),
    );
    cacheProvider = new RxAsyncStorageProvider();
  });

  afterEach(() => jest.clearAllMocks());

  it('should call AsyncStorage getItem with correct param and receive a JSON', done => {
    cacheProvider.load('test').subscribe({
      next: value => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('test');
        expect(value).toEqual(JSON.parse(VALUE_STRING));
        done();
      },
    });
  });

  it('should call AsyncStorage getItem with correct param and receive a String', done => {
    cacheProvider.loadString('test').subscribe({
      next: value => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('test');
        expect(value).toEqual(VALUE_STRING);
        done();
      },
    });
  });

  it('should call AsyncStorage setItem with a string', done => {
    cacheProvider.saveString('test', VALUE_STRING).subscribe({
      next: () => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('test', VALUE_STRING);
        done();
      },
    });
  });

  it('should call AsyncStorage setItem with an object', done => {
    cacheProvider.save('test', VALUE_OBJECT).subscribe({
      next: () => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('test', VALUE_STRING);
        done();
      },
    });
  });

  it('should call AsyncStorage remove with correct param', done => {
    cacheProvider.remove('test').subscribe({
      next: () => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test');
        done();
      },
    });
  });

  it('should call AsyncStorage clear', done => {
    cacheProvider.clear().subscribe({
      next: () => {
        expect(AsyncStorage.clear).toHaveBeenCalled();
        expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });
});
