import TokenType from '../Token/TokenType';
import Token from '../Token/Token';
import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';

class TreeNode {
  name: string;
  children: Array<any> = [];
  constructor(name: string) { this.name = name; }
}

class Parser {

  input: Array<Token>;
  currentToken: Token;
  symbolTable: SymbolTable;
  errorTable: ErrorTable;
  currentSubTree: any;

  constructor(input: Array<Token>, symbolTable: SymbolTable, errorTable: ErrorTable) {
    this.input = input.reverse();
    this.currentToken = this.input.pop() || new Token(TokenType.eof, "", 0, 0, 0);
    this.symbolTable = symbolTable;
    this.errorTable = errorTable;
    this.currentSubTree = null;
  }

  next(): void {
    this.currentToken = this.input.pop()!;
  }

  accept(type: TokenType): TreeNode | null {
    if (this.currentToken.type == type) {
      const curr = new TreeNode(TokenType[type]);
      curr.children.push(new TreeNode(this.currentToken.data))
      this.next();
      return curr;
    }
    return null;
  }

  error(message: string) {
    this.errorTable.add(this.currentToken, message + " but got: " + this.currentToken.data);
  }

  expect(type: TokenType): TreeNode | null {
    const val = this.accept(type)
    if (val != null) {
      return val;
    }
    this.error("Expecting token: " + TokenType[type]);
    return null;
  }

  // TODO: return the tree representation
  run(): any {
    return this.prog();
  }

  prog(): any {
    let subtree1 = this.dcls();
    let subtree2 = this.stmts();
    this.expect(TokenType.eof);
    let node = new TreeNode("Prog");
    node.children.push(subtree1, subtree2, new TreeNode("$"))
    return node;
  }

  dcls(): any {
    let dcltree = this.dcl();
    if (dcltree == null) {
      return new TreeNode("λ");
    }
    let dclstree = this.dcls()
    let node = new TreeNode("Dcls")
    node.children.push(dcltree, dclstree);
    return node;
  }

  dcl(): any {
    let val = this.accept(TokenType.floatdcl)
    let node = new TreeNode("Dcl")
    if (val != null) {
      node.children.push(val, this.expect(TokenType.id))
      return node
    }
    val = this.accept(TokenType.intdcl)
    if (val != null) {
      node.children.push(val, this.expect(TokenType.id))
      return node
    }
    return null;
  }

  stmts(): any {
    let stmtree = this.stmt();
    if (stmtree == null) {
      return new TreeNode("λ");
    }
    let stmtstree = this.stmts()
    let node = new TreeNode("Stmts")
    node.children.push(stmtree, stmtstree);
    return node;
  }

  stmt(): any {
    let node = new TreeNode("Stmt")
    let idtree = this.accept(TokenType.id)
    if (idtree != null) {
      let assign = this.expect(TokenType.assign);
      if (assign != null) {
        let val = this.val();
        if (val != null) {
          let expr = this.expr();
          node.children.push(idtree, assign, val, expr);
          return node
        }
      }
    }
    let print = this.accept(TokenType.print)
    let id = this.accept(TokenType.id);
    if (print != null || id != null) {
      node.children.push(print, id)
      return node
    }
    return null;
  }

  val(): any {
    let id = this.accept(TokenType.id);
    let inum = this.accept(TokenType.inum);
    let fnum = this.accept(TokenType.fnum)
    let node = new TreeNode("Val")
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
    let plus = this.accept(TokenType.plus)
    let minus = this.accept(TokenType.minus)
    let node = new TreeNode("Expr")
    if (plus != null) {
      node.children.push(plus, this.val(), this.expr())
      return node;
    }
    if (minus != null) {
      node.children.push(minus, this.val(), this.expr())
      return node;
    }
    return new TreeNode("λ");
  }
}

export default Parser;