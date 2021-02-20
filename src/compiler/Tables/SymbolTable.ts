import Token from '../Token/Token';

class Symbol {
  name: string
  token: Token
  value: any

  constructor(name: string, token: Token, value: any) {
    this.name = name;
    this.token = token;
    this.value = value;
  }
}

class SymbolTable {
  data: { [key: string]: Symbol } = {}

  setValue(key: string, value: Symbol) {
    this.data[key] = value;
  }

  set(name: string, token: Token, value: any) {
    this.data[name] = new Symbol(name, token, value);
  }

  get(key: string) {
    return this.data[key];
  }
}

export default SymbolTable;