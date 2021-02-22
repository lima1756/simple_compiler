# Simple compiler

This is a simple compiler made for my compilers class at Tec de Monterrey

## Demo

[Here!](https://lima1756.github.io/simple_compiler/)

## Tokens

| definition | Terminal  |  Regular expression |
|---|---|---|
| float declaration | floatdcl  | "f"  |
| integer declaration | intdcl  |  "i" |
| print | print  | "p"  |
|  id | id|  [a-e]|[g-h]|[j-o]|[q-z]  |
|  assign | assign | "="  |
|  plus | plus | "+" |
|  minus | minus | "-" |
|  integer number | inum  | [0-9]+ |
|  float number | fnum | [0-9]+.[0-9]+  |
|  blank | blank | (" ")+  |

## Syntax specification

||||
|---|---|---|
|Prog|  -> |Dcls Stmts $
|Dcls|  ->| Dcl Dcls \| λ
|Dcl|   ->| floatdcl id \| intdcl id
|Stmts| ->| Stmt Stmts \| λ
|Stmt| -> | id assign Expr \| print id
|Expr| -> | Val \| Val plus Expr \| Val minus Expr
|Val| -> | id \| num \| fnum

## Example code input:
```
fb ia a=5 b=a+3.2 pb
```

## How it works

This is the main view of the site:

![Main view]()

The left panel is the code to enter, you can modify it directly on browser, it will highlight the syntax.

After you're happy with your code, just press the refresh button on the top right corner:

![Refresh button]()

If everything is okay with the code, it should show no errors and enable Tabs in the right side of the page (If your screen is to small it will show a scrollbar to select hidden tabs):

![No errors]()

In the SYMBOL TABLE tab you can view the detected variables that were declared in your code, and the location of its declaration.

![SYMBOL TABLE tab]()

In the PARSE TREE JSON tab, you can see the created json after the Syntax Analyzer that is used in the next tab to represent it visually:

![PARSE TREE JSON]()

In the PARSE TREE VIEWER tab, you can see the tree in a graphical way, you can drag around the canvas and zoom in and out.

![PARSE TREE VIEWER]()

In the AST JSON tab, you can see the created json after the Semantic Analyzer that is used in the next tab to represent it visually:

![PARSE TREE JSON]()

In the AST VIEWER tab, you can see the tree in a graphical way, you can drag around the canvas and zoom in and out.

![PARSE TREE VIEWER]()

In case there are any errors on you code then it will show them on the errors tab and disable the other two tabs.

![Errors]()

If you want to upload a file instead of writing it into the text editor, then just click the button next to the refresh one and select the file!

![File upload]()