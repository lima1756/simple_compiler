import TokenType from '../Token/TokenType';
import Token from '../Token/Token';
import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';

class Parser {

  input: Array<Token>;
  currentToken: Token;
  symbolTable: SymbolTable;
  errorTable: ErrorTable;

  constructor(input: Array<Token>, symbolTable: SymbolTable, errorTable: ErrorTable) {
    this.input = input.reverse();
    this.currentToken = this.input.pop() || new Token(TokenType.eof, "", 0, 0, 0);
    this.symbolTable = symbolTable;
    this.errorTable = errorTable;
  }

  next(): void {
    this.currentToken = this.input.pop()!;
  }

  accept(type: TokenType): boolean {
    if (this.currentToken.type == type) {
      this.next();
      return true;
    }
    return false;
  }

  error(message: string) {
    this.errorTable.add(this.currentToken, message + " but got: " + TokenType[this.currentToken.type]);
  }

  expect(type: TokenType): boolean {
    if (this.accept(type)) {
      return true;
    }
    this.error("Expecting token: " + TokenType[type]);
    return false;
  }

  // TODO: return the tree representation
  run(): any {
    this.prog();
    this.expect(TokenType.eof);
  }

  prog(): boolean {
    let error = false;
    this.dcls();
    this.stmts();
    return !error;
  }

  dcls(): boolean {
    if (!this.dcl()) {
      return false
    }
    this.dcls()
    return true;
  }

  dcl(): boolean {
    if (this.accept(TokenType.floatdcl) || this.accept(TokenType.intdcl)) {
      return this.expect(TokenType.id);
    }
    return false;
  }

  stmts(): boolean {
    if (!this.stmt()) {
      return false
    }
    this.stmts()
    return true;
  }

  stmt(): boolean {
    if (this.accept(TokenType.id)) {
      return this.expect(TokenType.assign) && this.val() && this.expr();
    }
    return this.accept(TokenType.print) && this.accept(TokenType.id);
  }

  val(): boolean {
    if (this.accept(TokenType.id) || this.accept(TokenType.inum) || this.accept(TokenType.fnum)) {
      return true;
    }
    this.error("Expecting a value (id, integer, float)");
    return false;
  }

  expr(): boolean {
    if (this.accept(TokenType.plus) || this.accept(TokenType.minus)) {
      return this.val() && this.expr();
    }
    return true;
  }
}

export default Parser;