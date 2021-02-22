import ErrorTable from '../Tables/ErrorTable';
import SymbolTable from '../Tables/SymbolTable';
import Token from '../Token/Token';
import TokenType from '../Token/TokenType';
import Scanner from './Scanner';

function initialization(input: string) {
  const errorTable = new ErrorTable();
  const symbolTable = new SymbolTable();
  const scanner = new Scanner(input, symbolTable, errorTable);
  const output = scanner.run();
  return { output, symbolTable, errorTable }
}

function testToken(output: Array<Token>, token: string, type: TokenType) {
  expect(output.length).toBe(2)
  expect(output[0].data).toBe(token)
  expect(output[0].start).toBe(0)
  expect(output[0].end).toBe(token.length)
  expect(output[0].line).toBe(0)
  expect(output[0].type).toBe(type)
  expect(output[1].type).toBe(TokenType.eof)
}

test('test floatdcl token', () => {
  let { output, errorTable } = initialization("f");
  testToken(output, "f", TokenType.floatdcl);
  expect(errorTable.length).toBe(0);
})

test('test intdcl token', () => {
  let { output, errorTable } = initialization("i");
  testToken(output, "i", TokenType.intdcl);
  expect(errorTable.length).toBe(0);
})

test('test print token', () => {
  let { output, errorTable } = initialization("p");
  testToken(output, "p", TokenType.print);
  expect(errorTable.length).toBe(0);
})

test('test id token', () => {
  let { output, errorTable } = initialization("a");
  testToken(output, "a", TokenType.id);
  expect(errorTable.length).toBe(0);
})

test('test assign token', () => {
  let { output, errorTable } = initialization("=");
  testToken(output, "=", TokenType.assign);
  expect(errorTable.length).toBe(0);
})

test('test plus token', () => {
  let { output, errorTable } = initialization("+");
  testToken(output, "+", TokenType.plus);
  expect(errorTable.length).toBe(0);
})

test('test minus token', () => {
  let { output, errorTable } = initialization("-");
  testToken(output, "-", TokenType.minus);
  expect(errorTable.length).toBe(0);
})

test('test inum token', () => {
  let { output, errorTable } = initialization("5711536");
  testToken(output, "5711536", TokenType.inum);
  expect(errorTable.length).toBe(0);
})

test('test fnum token', () => {
  let { output, errorTable } = initialization("481.1861");
  testToken(output, "481.1861", TokenType.fnum);
  expect(errorTable.length).toBe(0);
})

test('test blank token', () => {
  let { output, errorTable } = initialization("        ");
  // because blank is ignored just test for empty input
  expect(output.length).toBe(1)
  expect(output[0].type).toBe(TokenType.eof)
  expect(errorTable.length).toBe(0);
})

test('test newLine token', () => {
  let { output, errorTable } = initialization("\n\r\n");
  // because newline is ignored just test for empty input
  expect(output.length).toBe(1)
  expect(output[0].type).toBe(TokenType.eof)
  expect(errorTable.length).toBe(0);
})

test('test position of token after blank', () => {
  let { output, errorTable } = initialization("     f");
  expect(output.length).toBe(2)
  expect(output[0].type).toBe(TokenType.floatdcl)
  expect(output[0].start).toBe(5)
  expect(output[0].end).toBe(6)
  expect(errorTable.length).toBe(0);
})

test('test position of token after newline', () => {
  let { output, errorTable } = initialization("\n\n\nf");
  expect(output.length).toBe(2)
  expect(output[0].type).toBe(TokenType.floatdcl)
  expect(output[0].start).toBe(0)
  expect(output[0].end).toBe(1)
  expect(output[0].line).toBe(3)
  expect(errorTable.length).toBe(0);
})

test('test position of token after newline and spaces', () => {
  let { output, errorTable } = initialization("    \n    \n \n     f");
  expect(output.length).toBe(2)
  expect(output[0].type).toBe(TokenType.floatdcl)
  expect(output[0].start).toBe(5)
  expect(output[0].end).toBe(6)
  expect(output[0].line).toBe(3)
  expect(errorTable.length).toBe(0);
})

test('test error token', () => {
  let { output, errorTable } = initialization("!!!***.*.*.");
  testToken(output, "!!!***.*.*.", TokenType.error);
  expect(errorTable.length).toBe(1);
})

test('scanner all symbols, no errors', () => {
  let { output, errorTable } = initialization("fbiaa=5b=a+3.2bp");
  expect(output.length).toBe(15)
  expect(errorTable.length).toBe(0);
})

test('scanner 1 errors', () => {
  let { output, errorTable } = initialization("fbiaa=5b=a+3.bp");
  expect(output.length).toBe(16)
  expect(errorTable.length).toBe(1);
});

test('scanner 3 errors', () => {
  let { output, errorTable } = initialization("f...bia!!!a=5b***=a+3.2bp");
  expect(output.length).toBe(18)
  expect(errorTable.length).toBe(3);
});
