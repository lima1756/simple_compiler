import Parser from './Parser/Parser'
import { ParseTreeNode } from './Parser/SyntaxAnalysis';
import Scanner from './Scanner/Scanner'
import ErrorTable from './Tables/ErrorTable';
import SymbolTable from './Tables/SymbolTable';

class Compiler {
  errorTable: ErrorTable = new ErrorTable();
  symbolTable: SymbolTable = new SymbolTable();
  input: string;
  parser: Parser;

  constructor(input: string) {
    this.input = input;
    let tokens = new Scanner(this.input, this.symbolTable, this.errorTable).run();
    this.parser = new Parser(tokens, this.symbolTable, this.errorTable);
  }
}

export default Compiler;