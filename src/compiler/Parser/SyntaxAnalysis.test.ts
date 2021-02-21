import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Scanner from '../Scanner/Scanner';
import SyntaxAnalysis from './SyntaxAnalysis';

function initialization(input: string) {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner(input, symbolTable, errorTable);
  const output = scanner.run()
  return { output, symbolTable, errorTable }
}

test('SyntaxAnalysis no errors', () => {
  const init = initialization("fbiaa=5b=a-3.2b=5pb");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (no decls)', () => {
  const init = initialization("a=5b=a+3.2pb");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (no stmts)', () => {
  const init = initialization("faib");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one declaration)', () => {
  const init = initialization("fa");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt a=5)', () => {
  const init = initialization("a=5");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt with expresion a=5+c)', () => {
  const init = initialization("a=5+c");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt with complex expressoin a=5+c-9+e+c-9)', () => {
  const init = initialization("a=5+c-9+e+c-9");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt print)', () => {
  const init = initialization("pc");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(0);
});

test('SyntaxAnalysis 2 error (print number and eof)', () => {
  const init = initialization("p5");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(2);
});

test('SyntaxAnalysis 2 error (declaration and eof)', () => {
  const init = initialization("ii");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(2);
});

test('SyntaxAnalysis 1 error expecting stmt but gots eof', () => {
  const init = initialization("a=5b=a+3.2b");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.errorTable.length).toBe(1);
});

test('declaration of float', () => {
  const init = initialization("fb");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.symbolTable.length).toBe(1);
  expect(init.symbolTable.get("b")).not.toBeNull();
  expect(init.symbolTable.get("b")!.name).toBe("b");
})

test('declaration of int', () => {
  const init = initialization("ib");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.symbolTable.length).toBe(1);
  expect(init.symbolTable.get("b")).not.toBeNull();
  expect(init.symbolTable.get("b")!.name).toBe("b");
})

test('Multiple declaration', () => {
  const init = initialization("ibfa");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.symbolTable.length).toBe(2);
  expect(init.symbolTable.get("b")).not.toBeNull();
  expect(init.symbolTable.get("b")!.name).toBe("b");
  expect(init.symbolTable.get("a")).not.toBeNull();
  expect(init.symbolTable.get("a")!.name).toBe("a");
})

test('Declared two times, error', () => {
  const init = initialization("ibfb");
  const sa = new SyntaxAnalysis(init.output, init.symbolTable, init.errorTable);
  sa.run();
  expect(init.symbolTable.length).toBe(1);
  expect(init.errorTable.length).toBe(1);
  expect(init.symbolTable.get("b")).not.toBeNull();
  expect(init.symbolTable.get("b")!.name).toBe("b");
})