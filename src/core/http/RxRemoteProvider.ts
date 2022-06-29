import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Observable, Observer } from 'rxjs';

import { RemoteException } from '../error';

export class RxAxiosProviderException extends RemoteException<AxiosError> {}

export interface RxRemoteProvider {
  /**
   * @summary perform @GET request with config
   * @param url
   *
   * @returns Either Axios response with generic data: T or @RemoteException if failed
   */
  get<T>(url: string): Observable<AxiosResponse<T>>;

  /**
   * @summary perform @POST request with config
   * @param url
   * @param data
   *
   * @returns Either Axios response with generic data: T or @RemoteException if failed
   */
  post<T>(url: string, data: any): Observable<AxiosResponse<T>>;

  /**
   * @summary perform @PUT request with config
   * @param url
   * @param data
   *
   * @returns Either Axios response with generic data: T or @RemoteException if failed
   */
  put<T>(url: string, data: any): Observable<AxiosResponse<T>>;

  /**
   * @summary perform @DELETE request with config
   * @param url
   *
   * @returns Either Axios response with generic data: T or @RemoteException if failed
   */
  delete<T>(url: string): Observable<AxiosResponse<T>>;
}

export class RxAxiosProvider implements RxRemoteProvider {
  private readonly axiosInstance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config);
  }

  private request<T>(
    requestConfig: AxiosRequestConfig,
  ): Observable<AxiosResponse<T>> {
    return new Observable((observer: Observer<AxiosResponse<T>>) => {
      try {
        this.axiosInstance.request(requestConfig).then(result => {
          observer.next(result);
          observer.complete();
        });
      } catch (error) {
        observer.error(new RxAxiosProviderException(error as AxiosError));
      }
    });
  }

  get<T>(url: string): Observable<AxiosResponse<T>> {
    return this.request({
      method: 'GET',
      url,
    });
  }

  post<T>(url: string, data: any): Observable<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      data,
      url,
    });
  }

  put<T>(url: string, data: any): Observable<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      data,
      url,
    });
  }

  delete<T>(url: string): Observable<AxiosResponse<T>> {
    return this.request<T>({
      method: 'delete',
      url,
    });
  }
}
