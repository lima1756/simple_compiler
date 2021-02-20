import Token from '../Token/Token';

class ErrorItem {
  token: Token
  message: string
  constructor(token: Token, message: string) {
    this.token = token;
    this.message = message;
  }
  compareTo(item: ErrorItem): number {
    if (this.token.line < item.token.line && this.token.start < item.token.start) {
      return -1;
    }
    else if (this.token.line == item.token.line && this.token.start == item.token.start) {
      return 0;
    }
    return 1;
  }
  toString(): string {
    return "Token: " + this.token.toString() + " Message: " + this.message
  }
}

class ErrorTable {
  errors: Array<ErrorItem> = [];
  length: number = 0;

  add(token: Token, message: string) {
    this.errors.push(new ErrorItem(token, message));
    this.length += 1;
  }
  sort() {
    this.errors.sort((a, b) => a.compareTo(b))
  }

  toString(): string {
    if (this.length == 0) {
      return "No errors!"
    }
    let str = `ErrorTable { \n\tlength: ${this.length}\n\terrors:`
    for (let i = 0; i < this.errors.length; i++) {
      str += `\n\t\t ${this.errors[i].toString()}`
    }
    return str + "\n }"
  }

}

export default ErrorTable;