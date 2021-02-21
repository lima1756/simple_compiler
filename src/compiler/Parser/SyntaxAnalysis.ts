import TokenType from '../Token/TokenType';
import Token from '../Token/Token';
import ErrorTable from '../Tables/ErrorTable';
import SymbolTable, { SymbolType } from '../Tables/SymbolTable';

enum ParseTreeSymbol {
  Prog, Dcls, Dcl, Stmts, Stmt, Expr, Val, empty
}

class ParseTreeNode {
  name: string;
  token: Token | null;
  symbol: ParseTreeSymbol | null;
  children: Array<ParseTreeNode> = [];
  constructor(name: string, token: Token | null = null, symbol: ParseTreeSymbol | null = null) {
    this.name = name;
    this.token = token;
    this.symbol = symbol;
  }
}

class SyntaxAnalysis {

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

  checkIfDeclaration(symbolType: SymbolType): void {
    const value = this.currentToken.data;
    const existing = this.symbolTable.get(value);
    if (existing) {
      this.errorTable.add(this.currentToken, `The id ${value} was already declared in line ${existing.declaration.line} position: ${existing.declaration.start}`)
      return;
    }
    this.symbolTable.add(value, symbolType, { line: this.currentToken.line, start: this.currentToken.start })
  }

  next(): void {
    this.currentToken = this.input.pop()!;
  }

  accept(type: TokenType): ParseTreeNode | null {
    if (this.currentToken && this.currentToken.type == type) {
      const curr = new ParseTreeNode(TokenType[type], this.currentToken);
      curr.children.push(new ParseTreeNode(this.currentToken.data));
      this.next();
      return curr;
    }
    return null;
  }

  error(message: string) {
    this.errorTable.add(this.currentToken, message + " but got: " + this.currentToken.data);
  }

  expect(type: TokenType): ParseTreeNode | null {
    const val = this.accept(type)
    if (val != null) {
      return val;
    }
    this.error("Expecting token: " + TokenType[type]);
    return null;
  }

  run(): ParseTreeNode {
    return this.prog();
  }

  prog(): any {
    let subtree1 = this.dcls();
    let subtree2 = this.stmts();
    this.expect(TokenType.eof);
    let node = new ParseTreeNode("Prog", null, ParseTreeSymbol.Prog);
    node.children.push(subtree1, subtree2, new ParseTreeNode("$"))
    return node;
  }

  dcls(): any {
    let dcltree = this.dcl();
    if (dcltree == null) {
      return new ParseTreeNode("λ", null, ParseTreeSymbol.empty);
    }
    let dclstree = this.dcls()
    let node = new ParseTreeNode("Dcls", null, ParseTreeSymbol.Dcls)
    node.children.push(dcltree, dclstree);
    return node;
  }

  dcl(): any {
    let node = new ParseTreeNode("Dcl", null, ParseTreeSymbol.Dcl)
    let val = this.accept(TokenType.floatdcl)
    if (val != null) {
      this.checkIfDeclaration(SymbolType.float);
      let id = this.expect(TokenType.id)
      if (id == null) { return null; }
      node.children.push(val, id)
      return node
    }
    val = this.accept(TokenType.intdcl)
    if (val != null) {
      this.checkIfDeclaration(SymbolType.int);
      let id = this.expect(TokenType.id)
      if (id == null) { return null; }
      node.children.push(val, id)
      return node
    }
    return null;
  }

  stmts(): any {
    let stmtree = this.stmt();
    if (stmtree == null) {
      return new ParseTreeNode("λ", null, ParseTreeSymbol.empty);
    }
    let stmtstree = this.stmts()
    let node = new ParseTreeNode("Stmts", null, ParseTreeSymbol.Stmts)
    node.children.push(stmtree, stmtstree);
    return node;
  }

  stmt(): any {
    let node = new ParseTreeNode("Stmt", null, ParseTreeSymbol.Stmt)
    let idtree = this.accept(TokenType.id)
    if (idtree != null) {
      let assign = this.expect(TokenType.assign);
      if (assign == null) {
        return null;
      }
      let expr = this.expr();
      if (expr == null) {
        return null;
      }
      node.children.push(idtree, assign, expr);
      return node;
    }
    let print = this.accept(TokenType.print)
    if (print != null) {
      let id = this.expect(TokenType.id);
      if (id == null) {
        return null;
      }
      node.children.push(print, id)
      return node
    }
    return null;
  }

  val(): any {
    let id = this.accept(TokenType.id);
    let inum = this.accept(TokenType.inum);
    let fnum = this.accept(TokenType.fnum)
    let node = new ParseTreeNode("Val", null, ParseTreeSymbol.Val)
    if (id != null) {
      node.children.push(id)
      return node;
    }
    if (inum != null) {
      node.children.push(inum)
      return node;
    }
    if (fnum != null) {
      node.children.push(fnum)
      return node;
    }
    this.error("Expecting a value (id, integer, float)");
    return null;
  }

  expr(): any {
    let node = new ParseTreeNode("Expr", null, ParseTreeSymbol.Expr)
    let val = this.val();
    if (val == null) {
      return null;
    }
    let plus = this.accept(TokenType.plus)
    let minus = this.accept(TokenType.minus)
    if (plus != null) {
      node.children.push(val, plus, this.expr())
      return node;
    }
    if (minus != null) {
      node.children.push(val, minus, this.expr())
      return node;
    }
    node.children.push(val)
    return node;
  }
}

export { ParseTreeSymbol, ParseTreeNode }
export default SyntaxAnalysis;