import "ace-builds/src-noconflict/mode-java";
import ace from "ace-builds"

export class CustomHighlightRules extends ace.require(
  "ace/mode/text_highlight_rules"
).TextHighlightRules {

  constructor() {
    super();
    this.$rules = {
      start: [
        {
          token: "keyword", // declarations
          regex: "(f|i|p)"
        },
        {
          token: "constant.language.boolean", // id
          regex: /([a-e]|[g-h]|[j-o]|[q-z]){1}/
        },
        {
          token: "constant.numeric", // float
          regex: /[0-9]+\.[0-9]+/
        },
        {
          token: "constant.numeric", // int
          regex: /[0-9]+/
        },
        {
          token: "string",
          regex: /(=|\+|-){1}/
        }
      ]
    };
  }
}

export default class CustomSyntaxMode extends ace.require("ace/mode/java")
  .Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}