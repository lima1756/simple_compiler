import TokenType from '../Token/TokenType';
import Token from '../Token/Token';
import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import SyntaxAnalysis, { ParseTreeNode } from './SyntaxAnalysis';
import SemanticAnalysis, { AstNode } from './SemanticAnalysis';

class TreeNode {
  name: string;
  children: Array<any> = [];
  constructor(name: string) { this.name = name; }
}

class Parser {

  symbolTable: SymbolTable;
  errorTable: ErrorTable;
  parseTree: ParseTreeNode;
  ast: AstNode;

  constructor(input: Array<Token>, symbolTable: SymbolTable, errorTable: ErrorTable) {
    this.symbolTable = symbolTable;
    this.errorTable = errorTable;
    this.parseTree = new SyntaxAnalysis(input, this.symbolTable, this.errorTable).run();
    this.ast = new SemanticAnalysis(this.parseTree, this.symbolTable, this.errorTable).run();
  }
}

export default Parser;