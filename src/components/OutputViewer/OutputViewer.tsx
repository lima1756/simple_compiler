import React from 'react';
import './OutputViewer.scss'
import { Tabs, Tab } from 'react-materialize';
import TreeViewer from './Viewers/TreeViewer/TreeViewer';
import ErrorViewer from './Viewers/ErrorViewer/ErrorViewer';
import SymbolTableViewer from './Viewers/SymbolTableViewer/SymbolTableViewer';
import Compiler from '../../compiler/Compiler';
import Instructions from './Viewers/Instructions/Instructions'

interface OutputViewerProps {
  compiler: Compiler | undefined
}

const tabsOptions = { swipeable: false, duration: 300, onShow: () => { }, responsiveThreshold: Infinity };

function instructionsDefault() {
  return (
    <div className="row OutputViewer" >
      <div className="col s12" style={{ padding: 0, margin: 0 }}>
        <Tabs options={tabsOptions}>
          <Tab title="Instructions">
            <Instructions />
          </Tab>
        </Tabs>
      </div>
    </div>)
}

function OutputViewer(props: OutputViewerProps) {
  const prettyObject = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  }

  if (!props.compiler) {
    return instructionsDefault();
  }
  const errorTable = props.compiler.errorTable;
  const symbolTable = props.compiler.symbolTable;
  const parseTree = props.compiler.parser.parseTree;
  const ast = props.compiler.parser.ast;
  const display = errorTable != null && symbolTable != null;
  if (!display) {
    return instructionsDefault();
  }
  const errors = errorTable!.length != 0;
  return (
    <div className="row OutputViewer" >
      <div className="col s12" style={{ padding: 0, margin: 0 }}>
        <Tabs options={tabsOptions}>
          <Tab title="Instructions">
            <Instructions />
          </Tab>
          <Tab title="Error/warnings" active={errors}>
            <ErrorViewer errorTable={errorTable!} />
          </Tab>
          <Tab title="Symbol table" disabled={errors}>
            <SymbolTableViewer symbolTable={symbolTable} />
          </Tab>
          <Tab title="Parse Tree JSON" disabled={errors}>
            {!errors && <pre>{prettyObject(parseTree)}</pre>}
          </Tab>
          <Tab title="Parse Tree Viewer" disabled={errors}>
            {!errors && <TreeViewer tree={parseTree} rate={150} />}
          </Tab>
          <Tab title="AST JSON" disabled={errors}>
            {!errors && <pre>{prettyObject(ast)}</pre>}
          </Tab>
          <Tab title="AST Viewer" disabled={errors} >
            {!errors && <TreeViewer tree={ast} rate={200} />}
          </Tab>
          <Tab title="Translation" disabled={errors} >
            <h1>
              Output program for &nbsp;
              <a href="https://en.wikipedia.org/wiki/Dc_(computer_program)" target="_blank">
                Desk calculator
              </a>
            </h1>
            <code>{props.compiler.translator.output}</code>
          </Tab>
        </Tabs>
      </div>
    </div>
  );



}

export default OutputViewer;
