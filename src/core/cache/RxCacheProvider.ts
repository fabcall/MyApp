import AsyncStorage from '@react-native-async-storage/async-storage';
import { catchError, from, Observable } from 'rxjs';

import { LocalException } from '../error';

export class RxAsyncStorageProviderException extends LocalException {}

export interface RxCacheProvider {
  loadString(key: string): Observable<string | null>;
  load<T extends object>(key: string): Observable<T | null>;
  saveString(key: string, value: string): Observable<void>;
  save<T extends object>(key: string, value: T): Observable<void>;
  remove(key: string): Observable<void>;
  clear(): Observable<void>;
}

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
    return from(promise).pipe(
      catchError(error => {
        throw new RxAsyncStorageProviderException(error);
      }),
    );
  }
}
