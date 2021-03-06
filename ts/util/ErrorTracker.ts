import Logger from './Logger';

class ErrorTracker {

  private object: string;
  private indent: string;
  private logger: Logger;
  private errors: string[];

  constructor(object, indent) {
    this.object = object;
    this.indent = indent;
    this.logger = new Logger(indent);
    this.errors = [];
  }

  public addErrors(additionalErrors: string[]): void {
    this.errors = this.errors.concat(additionalErrors);
  }

  public log(message: string): void {
    this.errors.push(this.indent + this.object + ': ' + message);
    this.logger.log('Error: ' + message);
  }

  public assertTrue(bool: boolean, message: string): void {
    this.logger.log(message + ': ' + (bool ? '✓' : 'X'));
    if (!bool) {
      this.errors.push(this.indent + this.object + ': ' + message + ' - Failed');
    }
  }

  public assertEquals(value1: any, value2: any, message: string): void {
    this.assertTrue(value1 === value2, message);
    if (value1 !== value2) {
      this.logger.log('  First value: ' + value1);
      this.logger.log('  Second value: ' + value2);
    }
  }

  public getErrors(): string[] {
    return this.errors;
  }

  public exit(continueOnFinish: boolean): void {
    this.logger.log('');
    if (this.errors.length === 0) {
      this.logger.log('Success! No errors ✓');
    } else {
      this.logger.log('Errors:');
    // tslint:disable-next-line:no-console
      this.errors.forEach((error) => console.log(error));
    }
    if (!continueOnFinish) {
      process.exit(this.errors.length === 0 ? 0 : 1);
    }
  }
}

export default ErrorTracker;
