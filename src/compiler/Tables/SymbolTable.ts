enum SymbolType {
  float, int
}
class Symbol {
  name: string
  type: SymbolType
  declaration: { start: number, line: number }

  constructor(name: string, type: SymbolType, declaration: { start: number, line: number }) {
    this.name = name;
    this.type = type;
    this.declaration = declaration;
  }
}

class SymbolTable {
  data: { [key: string]: Symbol } = {}
  length: number = 0;

  addValue(key: string, value: Symbol) {
    this.data[key] = value;
    this.length += 1
  }

  add(name: string, type: SymbolType, declaration: { start: number, line: number }) {
    this.data[name] = new Symbol(name, type, declaration);
    this.length += 1
  }

  get(key: string): Symbol | null {
    return this.data[key];
  }
}

export { SymbolType, Symbol };
export default SymbolTable;