export class Exception {}

export class LocalException<Raw = any> extends Exception {
  get rootCause(): Raw {
    return this.raw;
  }

  constructor(private readonly raw: Raw) {
    super();
  }
}

export class RemoteException<Raw = any> extends Exception {
  get rootCause(): Raw {
    return this.raw;
  }

  constructor(private readonly raw: Raw) {
    super();
  }
}
