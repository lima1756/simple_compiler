import ErrorTable from "../Tables/ErrorTable";
import SymbolTable, { SymbolType, Symbol } from "../Tables/SymbolTable";
import Token from "../Token/Token";
import TokenType from "../Token/TokenType";
import { ParseTreeSymbol, ParseTreeNode } from "./SyntaxAnalysis";

enum AstNodeType {
  program, floatdcl, intdcl, assign, plus, minus, print, id, inum, fnum, int2float, error
}

class AstNode {
  type: AstNodeType;
  value: string;
  name: string;
  children: Array<AstNode> = []

  constructor(type: AstNodeType, value: string = "") {
    this.type = type;
    this.value = value;
    this.name = AstNodeType[type] + " -> " + value;
  }
}

class SemanticAnalysis {

  input: ParseTreeNode;
  symbolTable: SymbolTable;
  errorTable: ErrorTable;

  constructor(input: ParseTreeNode, symbolTable: SymbolTable, errorTable: ErrorTable) {
    this.input = input;
    this.symbolTable = symbolTable;
    this.errorTable = errorTable;
  }

  run() {
    const root = new AstNode(AstNodeType.program, "program")
    root.children = root.children.concat(this.dcls(this.input.children[0]), this.stmts(this.input.children[1]));
    return root;
  }

  symbolTableOrError(name: string, token: Token): Symbol | null {
    const symbol = this.symbolTable.get(name)
    if (!symbol) {
      this.errorTable.add(token, `Variable '${name}' was not defined.`)
      return null;
    }
    return symbol;
  }

  dcls(node: ParseTreeNode): Array<AstNode> {
    let children: Array<AstNode> = []
    for (let i = 0; i < node.children.length; i++) {
      const curr = node.children[i];
      if (curr.symbol == ParseTreeSymbol.Dcls) {
        children = children.concat(this.dcls(curr))
      }
      else if (curr.symbol == ParseTreeSymbol.Dcl) {
        children.push(this.dcl(curr))
      }
    }
    return children;
  }

  dcl(node: ParseTreeNode): AstNode {
    if (node.children[0].token!.type == TokenType.floatdcl) {
      return new AstNode(AstNodeType.floatdcl, node.children[1].children[0].name)
    }
    return new AstNode(AstNodeType.intdcl, node.children[1].children[0].name)
  }

  stmts(node: ParseTreeNode): Array<AstNode> {
    let children: Array<AstNode> = []
    for (let i = 0; i < node.children.length; i++) {
      const curr = node.children[i];
      if (curr.symbol == ParseTreeSymbol.Stmts) {
        children = children.concat(this.stmts(curr))
      }
      else if (curr.symbol == ParseTreeSymbol.Stmt) {
        children.push(this.stmt(curr))
      }
    }
    return children;
  }

  stmt(node: ParseTreeNode): AstNode {
    const name = node.children[0].children[0].name;
    if (node.children[0].token!.type == TokenType.id) {
      const symbol = this.symbolTableOrError(name, node.children[0].token!);
      if (!symbol) {
        return new AstNode(AstNodeType.error, "error")
      }
      const astNode = new AstNode(AstNodeType.assign, SymbolType[symbol!.type]);
      const child = new AstNode(AstNodeType.id, name)
      astNode.children = [child, this.expr(node.children[2], symbol!.type)]
      return astNode;
    }
    return new AstNode(AstNodeType.print, name)
  }

  convertType(node: ParseTreeNode, op: SymbolType.float | SymbolType.int) {
    const tokenType = node.children[0].children[0].token!.type;
    const data = node.children[0].children[0].token!.data;
    const symbol = this.symbolTable.get(data)
    if (op == SymbolType.float && (tokenType == TokenType.fnum || symbol?.type == SymbolType.float)) {
      return new AstNode(AstNodeType.fnum, node.children[0].children[0].token!.data)
    }
    else if (op == SymbolType.int && (tokenType == TokenType.inum || symbol?.type == SymbolType.int)) {
      return new AstNode(AstNodeType.inum, node.children[0].children[0].token!.data)
    }
    else if (op == SymbolType.float && (tokenType == TokenType.inum || symbol?.type == SymbolType.int)) {
      const parent = new AstNode(AstNodeType.int2float, "float")
      parent.children.push(new AstNode(AstNodeType.inum, node.children[0].children[0].token!.data))
      return parent;
    }
    this.errorTable.add(node.children[0].children[0].token!, "Float can't be converted to integer")
    const parent = new AstNode(AstNodeType.error, "error")
    parent.children.push(new AstNode(AstNodeType.fnum, node.children[0].children[0].token!.data))
    return parent;
  }

  expr(node: ParseTreeNode, op: SymbolType.float | SymbolType.int): AstNode {
    if (node.children.length == 1) {
      return this.convertType(node, op)
    }
    let currNode: AstNode;
    if (node.children[1].token!.type == TokenType.plus) {
      currNode = new AstNode(AstNodeType.plus, SymbolType[op]);
    }
    else {
      currNode = new AstNode(AstNodeType.minus, SymbolType[op]);
    }
    currNode.children.push(this.convertType(node, op), this.expr(node.children[2], op))
    return currNode;
  }
}

export { AstNode }
export default SemanticAnalysis;