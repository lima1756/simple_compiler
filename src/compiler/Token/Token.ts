import TokenType from './TokenType';

class Token {
  type: TokenType;
  data: string;
  start: number;
  end: number;
  line: number;

  constructor(type: TokenType, data: string, start: number, end: number, line: number) {
    this.type = type;
    this.data = data;
    this.start = start;
    this.end = end;
    this.line = line;
  }

  toString(): string {
    return `Token {type: ${TokenType[this.type]} data: ${this.data} start: ${this.start} end: ${this.end} line: ${this.line}}`
  }
}

export default Token;