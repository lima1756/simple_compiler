import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Scanner from '../Scanner/Scanner';
import SyntaxAnalysis from './SyntaxAnalysis';
import { TestParseTreeJson } from '../utils/TestUtils';

function initialization(input: string) {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner(input, symbolTable, errorTable);
  const tokens = scanner.run()
  const sa = new SyntaxAnalysis(tokens, symbolTable, errorTable);
  const scannertree = sa.run();
  return { output: scannertree, symbolTable, errorTable }
}

test('SyntaxAnalysis no errors', () => {
  const { errorTable } = initialization("fbiaa=5b=a-3.2b=5pb");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (no decls)', () => {
  const { errorTable } = initialization("a=5b=a+3.2pb");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (no stmts)', () => {
  const { errorTable } = initialization("faib");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one declaration)', () => {
  const { errorTable } = initialization("fa");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt a=5)', () => {
  const { errorTable } = initialization("a=5");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt with expresion a=5+c)', () => {
  const { errorTable } = initialization("a=5+c");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt with complex expressoin a=5+c-9+e+c-9)', () => {
  const { errorTable } = initialization("a=5+c-9+e+c-9");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis no error (one stmt print)', () => {
  const { errorTable } = initialization("pc");
  expect(errorTable.length).toBe(0);
});

test('SyntaxAnalysis 2 error (print number and eof)', () => {
  const { errorTable } = initialization("p5");
  expect(errorTable.length).toBe(2);
});

test('SyntaxAnalysis 2 error (declaration and eof)', () => {
  const { errorTable } = initialization("ii");
  expect(errorTable.length).toBe(2);
});

test('SyntaxAnalysis 1 error expecting stmt but gots eof', () => {
  const { errorTable } = initialization("a=5b=a+3.2b");
  expect(errorTable.length).toBe(1);
});

test('declaration of float', () => {
  const { symbolTable } = initialization("fb");
  expect(symbolTable.length).toBe(1);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
})

test('declaration of int', () => {
  const { symbolTable } = initialization("ib");
  expect(symbolTable.length).toBe(1);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
})

test('Multiple declaration', () => {
  const { symbolTable } = initialization("ibfa");
  expect(symbolTable.length).toBe(2);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
  expect(symbolTable.get("a")).not.toBeNull();
  expect(symbolTable.get("a")!.name).toBe("a");
})

test('Declared two times, error', () => {
  const { symbolTable, errorTable } = initialization("ibfb");
  expect(symbolTable.length).toBe(1);
  expect(errorTable.length).toBe(1);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
})

test('Dcls and Stmt, error', () => {
  const { symbolTable, errorTable } = initialization("ibb=5");
  expect(symbolTable.length).toBe(1);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
  expect(errorTable.length).toBe(0);
})

test('Dcls and Stmts, error', () => {
  const { symbolTable, errorTable } = initialization("ibb=5b=b+8-9+5pb");
  expect(symbolTable.length).toBe(1);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
  expect(errorTable.length).toBe(0);
})

test('test tree structure', () => {
  const { output, symbolTable } = initialization("fbiaa=5b=a-3.2b=5pb");
  expect(symbolTable.length).toBe(2);
  expect(symbolTable.get("b")).not.toBeNull();
  expect(symbolTable.get("b")!.name).toBe("b");
  expect(symbolTable.get("a")).not.toBeNull();
  expect(symbolTable.get("a")!.name).toBe("a");
  expect(JSON.stringify(output)).toBe(JSON.stringify(TestParseTreeJson));
})