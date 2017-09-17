class Logger {

  private indent: string;

  constructor(indent: string) {
    this.indent = indent;
  }

  public log(message: string) {
    console.log(this.indent + message);
  }
}

export default Logger;
