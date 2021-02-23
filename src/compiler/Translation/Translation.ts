import { AstNode, AstNodeType } from "../Parser/SemanticAnalysis";


class Translation {
  // Information about the Desk calculator https://en.wikipedia.org/wiki/Dc_(computer_program)

  input: AstNode;
  output: string = "";
  status: number = 0;
  comments: boolean;

  constructor(input: AstNode, comments: boolean = false) {
    this.input = input;
    this.comments = comments;
  }

  write(data: string, comment: string = "") {
    this.output += data
    if (this.comments && comment != "") {
      this.output += "\t # " + comment;
    }
    this.output += "\n"
  }

  run() {
    this.output = "";
    this.write("0 k", "Precision to 0 decimal value")
    const ch = this.input.children;
    for (let i = 0; i < ch.length; i++) {
      switch (ch[i].type) {
        case AstNodeType.assign:
          this.assign(ch[i])
          break;
        case AstNodeType.print:
          this.print(ch[i])
          break;
      }
    }
  }

  assign(node: AstNode) {
    switch (node.children[1].type) {
      case AstNodeType.plus:
        this.calculation(node.children[1])
        break
      case AstNodeType.minus:
        this.calculation(node.children[1])
        break
      default:
        this.getValue(node.children[1]);
        break
    }
    this.write("s" + node.children[0].value, `pop value from stack and write it to register ${node.children[0].value}`)
    this.resetOperation();
  }

  getValue(node: AstNode) {
    let float = false
    if (node.type == AstNodeType.int2float) {
      this.toFloat();
      node = node.children[0]
      float = true;
    }
    if (node.type == AstNodeType.id) {
      this.idValue(node)
    }
    else {
      this.value(node)
    }
  }

  idValue(valueNode: AstNode) {
    this.write("l" + valueNode.value, `read from register "${valueNode.value}" and push it to the stack`)
  }

  value(valueNode: AstNode) {
    this.write(valueNode.value, "push value into the stack")
  }

  calculation(node: AstNode) {
    this.getValue(node.children[0])
    if (node.children[1].type == AstNodeType.plus || node.children[1].type == AstNodeType.minus) {
      this.calculation(node.children[1])
    }
    else {
      this.getValue(node.children[1])
    }
    if (node.type == AstNodeType.plus) {
      this.write("+", "pop last two values and adds them")
    }
    else {
      this.write("-", "pop last two values and substracts them")
    }
  }

  print(node: AstNode) {
    this.write("n", "writes and pop from the stack")
  }

  resetOperation() {
    if (this.status == 0) {
      return;
    }
    this.status = 0;
    this.write("0 k", "Precision to 0 decimal values")
  }

  toFloat() {
    if (this.status == 5) {
      return;
    }
    this.status = 5;
    this.write("5 k", "Precision to 5 decimal values")
  }
}

export default Translation;