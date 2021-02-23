import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Scanner from '../Scanner/Scanner';
import SyntaxAnalysis from '../Parser/SyntaxAnalysis';
import SemanticAnalysis from '../Parser/SemanticAnalysis';
import Translation from './Translation';
import { OutputProgram1 } from '../utils/TestUtils';


function initialization(input: string) {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner(input, symbolTable, errorTable);
  const tokens = scanner.run()
  const sa = new SyntaxAnalysis(tokens, symbolTable, errorTable);
  const scannertree = sa.run();
  const semantic = new SemanticAnalysis(scannertree, symbolTable, errorTable);
  const ast = semantic.run()
  const translator = new Translation(ast);
  translator.run();
  return { output: translator.output, symbolTable, errorTable }
}

test('SyntaxAnalysis no errors', () => {
  const { output } = initialization("fbiaa=5b=a+3.2pb");
  expect(output).toBe(OutputProgram1);
});