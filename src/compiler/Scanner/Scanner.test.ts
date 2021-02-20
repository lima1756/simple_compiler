import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Scanner from './Scanner';

test('scanner no errors', () => {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  let scanner = new Scanner("fbiaa=5b=a+3.2bp", symbolTable, errorTable);
  scanner.run();
  expect(errorTable.length).toBe(0);
});

test('scanner 1 errors', () => {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  let scanner = new Scanner("fbiaa=5b=a+3.bp", symbolTable, errorTable);
  scanner.run();
  expect(errorTable.length).toBe(1);
});

test('scanner 3 errors', () => {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  let scanner = new Scanner("f...bia!!!a=5b***=a+3.2bp", symbolTable, errorTable);
  scanner.run();
  expect(errorTable.length).toBe(3);
});
