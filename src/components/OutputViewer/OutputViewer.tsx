import React from 'react';
import './OutputViewer.scss'
import { Tabs, Tab } from 'react-materialize';
import TreeViewer from './Viewers/TreeViewer/TreeViewer';
import ErrorViewer from './Viewers/ErrorViewer/ErrorViewer';
import Compiler from '../../compiler/Compiler';

interface OutputViewerProps {
  compiler: Compiler
}

function OutputViewer(props: OutputViewerProps) {
  const prettyObject = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  }
  const errorTable = props.compiler.errorTable;
  const symbolTable = props.compiler.symbolTable;
  const parseTree = props.compiler.parser.parseTree;
  const ast = props.compiler.parser.ast;
  const tabsOptions = { swipeable: false, duration: 300, onShow: () => { }, responsiveThreshold: Infinity };
  const display = errorTable != null && symbolTable != null;
  if (display) {
    const errors = errorTable!.length != 0;
    return (
      <div className="row OutputViewer" >
        <div className="col s12" style={{ padding: 0, margin: 0 }}>
          <Tabs options={tabsOptions}>
            <Tab title="Error/warnings">
              <ErrorViewer errorTable={errorTable!} />
            </Tab>
            <Tab title="Symbol table" disabled={errors}>
              <pre>{prettyObject(symbolTable)}</pre>
            </Tab>
            <Tab title="Parse Tree JSON" disabled={errors}>
              {!errors && <pre>{prettyObject(parseTree)}</pre>}
            </Tab>
            <Tab title="Parse Tree Viewer" disabled={errors} idx="asdf">
              {!errors && <TreeViewer tree={parseTree} rate={150} />}
            </Tab>
            <Tab title="AST JSON" disabled={errors}>
              {!errors && <pre>{prettyObject(ast)}</pre>}
            </Tab>
            <Tab title="AST Viewer" disabled={errors} idx="asdf">
              {!errors && <TreeViewer tree={ast} rate={200} />}
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="row OutputViewer" >
      <div className="col s12" style={{ padding: 0, margin: 0 }}>
        <Tabs options={tabsOptions}>
          <Tab title="Instructions">
            Code to the left, execute on the top, output in this tabs
      </Tab>
        </Tabs>
      </div>
    </div>)

}

export default OutputViewer;
