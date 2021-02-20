import Parser from './Parser/Parser'
import Scanner from './Scanner/Scanner'
import ErrorTable from './Tables/ErrorTable';
import SymbolTable from './Tables/SymbolTable';

class Compiler {
  errorTable: ErrorTable = new ErrorTable();
  symbolTable: SymbolTable = new SymbolTable();
  input: string;

  constructor(input: string) {
    this.input = input;
  }

  run() {
    let tokens = new Scanner(this.input, this.symbolTable, this.errorTable).run();
    let ast = new Parser(tokens, this.symbolTable, this.errorTable).run();
    return ast;
  }

}

export default Compiler;