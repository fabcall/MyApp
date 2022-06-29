export class Exception {}

export class LocalException<Raw = any> extends Exception {
  get rootCause(): Raw {
    return this.raw;
  }

  constructor(private readonly raw: Raw) {
    super();
  }
}
