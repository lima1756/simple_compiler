import TokenType from '../Token/TokenType';
import Token from '../Token/Token';
import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';

class LexItem {
  regex;
  tokenType;
  constructor(regex: RegExp, tokenType: TokenType) {
    this.regex = regex;
    this.tokenType = tokenType;
  }
}

class Scanner {
  input: string
  symbolTable: SymbolTable
  errorTable: ErrorTable;

  lexDefinition: { [key: string]: LexItem } = {
    "floatDcl": new LexItem(/^f/, TokenType.floatdcl),
    "intDcl": new LexItem(/^i/, TokenType.intdcl),
    "print": new LexItem(/^p/, TokenType.print),
    "id": new LexItem(/^([a-e]|[g-h]|[j-o]|[q-z])/, TokenType.id),
    "assign": new LexItem(/^=/, TokenType.assign),
    "plus": new LexItem(/^\+/, TokenType.plus),
    "minus": new LexItem(/^-/, TokenType.minus),
    "fNum": new LexItem(/^[0-9]+\.[0-9]+/, TokenType.fnum),
    "iNum": new LexItem(/^[0-9]+/, TokenType.inum),
    "blank": new LexItem(/^( |\t)+/, TokenType.blank),
    "newLine": new LexItem(/^(\r\n|\n|\r)/, TokenType.newline),
  }

  output: Array<Token> = [];

  constructor(input: string, symbolTable: SymbolTable, errorTable: ErrorTable) {
    this.input = input;
    this.symbolTable = symbolTable;
    this.errorTable = errorTable;
  }

  test(input: string, start: number, line: number): Token | null {
    for (let key in this.lexDefinition) {
      let value = this.lexDefinition[key].regex.exec(input);
      if (value != null) {
        return new Token(this.lexDefinition[key].tokenType, value[0], start, start + value[0].length, line)
      }
    }
    return null;
  }

  run(): Array<Token> {
    let data = this.input;
    let error = false;
    let start = 0;
    let currentLine = 0;
    while (data.length > 0) {
      let token = this.test(data, start, currentLine)
      if (token == null) {
        error = true;
        let errorLength = 0;
        let errorString = "";
        let escapeToken = null;
        do {
          errorLength += 1;
          errorString += data[0];
          start += 1
          data = data.substr(1);
          escapeToken = this.test(data, start, currentLine)
        } while (escapeToken == null && data.length > 0);
        const errorToken = new Token(TokenType.error, errorString, start - errorLength, start, currentLine);
        this.errorTable.add(errorToken, "Token: \"" + errorString + "\" not recognized");
        token = escapeToken;
        this.output.push(errorToken)
      }
      else {
        data = data.substr(token.data.length);
        start += token.data.length;
        if (token.type == TokenType.newline) {
          currentLine += 1
          start = 0
        }
        else if (token.type != TokenType.blank) {
          this.output.push(token);
        }
      }

    }
    this.output.push(new Token(TokenType.eof, "", start, start, currentLine));
    return this.output;
  }
}

export default Scanner;