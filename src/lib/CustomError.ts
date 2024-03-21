export class CustomError extends Error {
  constructor(public message: string, public errorCode: number) {
    super(message);
    this.name = this.constructor.name;
  }
}
