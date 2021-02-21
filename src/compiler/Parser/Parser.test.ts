import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Scanner from '../Scanner/Scanner';
import Parser from './Parser';

test('parses no errors', () => {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner("fbiaa=5b=a-3.2b=5pb", symbolTable, errorTable);
  const output = scanner.run()
  const parser = new Parser(output, symbolTable, errorTable);
  expect(errorTable.length).toBe(0);
});

test('parses no error (no decls)', () => {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner("a=5b=a+3.2pb", symbolTable, errorTable);
  const output = scanner.run()
  const parser = new Parser(output, symbolTable, errorTable);
  expect(errorTable.length).toBe(2);
});

test('parses 1 error expecting stmt but gots eof', () => {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner("a=5b=a+3.2b", symbolTable, errorTable);
  const output = scanner.run()
  const parser = new Parser(output, symbolTable, errorTable);
  expect(errorTable.length).toBe(3);
});
