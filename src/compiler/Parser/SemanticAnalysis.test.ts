import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Scanner from '../Scanner/Scanner';
import SyntaxAnalysis from './SyntaxAnalysis';
import { astJson } from '../utils/TestUtils';
import SemanticAnalysis from './SemanticAnalysis';

function initialization(input: string) {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner(input, symbolTable, errorTable);
  const tokens = scanner.run()
  const sa = new SyntaxAnalysis(tokens, symbolTable, errorTable);
  const scannertree = sa.run();
  const semantic = new SemanticAnalysis(scannertree, symbolTable, errorTable);
  const output = semantic.run()
  return { output, symbolTable, errorTable }
}

test('test tree structure', () => {
  const { output } = initialization("fbiaa=5b=a-3.2b=5pb");
  expect(JSON.stringify(output)).toBe(JSON.stringify(astJson));
})

test('integer can be converted to float', () => {
  const { errorTable } = initialization("fbb=5");
  expect(errorTable.length).toBe(0);
})

test('float cant be converted to integer', () => {
  const { errorTable } = initialization("ibb=5.0");
  expect(errorTable.length).toBe(1);
})

test('variable cant be used before declaration', () => {
  const { errorTable } = initialization("a=5");
  expect(errorTable.length).toBe(1);
})