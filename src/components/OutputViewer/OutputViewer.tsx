import React from 'react';
import './OutputViewer.scss'
import { Tabs, Tab } from 'react-materialize';
import ErrorTable from '../../compiler/Tables/ErrorTable';
import SymbolTable from '../../compiler/Tables/SymbolTable';
import AstViewer from './Viewers/AstViewer/AstViewer';
import ErrorViewer from './Viewers/ErrorViewer/ErrorViewer';

interface OutputViewerProps {
  ast: any,
  errorTable: ErrorTable | null,
  symbolTable: SymbolTable | null
}

function OutputViewer(props: OutputViewerProps) {
  const prettyObject = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  }
  const tabsOptions = { swipeable: false, duration: 300, onShow: () => { }, responsiveThreshold: Infinity };
  const display = props.errorTable != null && props.symbolTable != null;
  if (display) {
    const errors = props.errorTable!.length != 0;
    return (
      <div className="row OutputViewer" >
        <div className="col s12" style={{ padding: 0, margin: 0 }}>
          <Tabs options={tabsOptions}>
            <Tab title="Error/warnings">
              <ErrorViewer errorTable={props.errorTable!} />
            </Tab>
            {/* <Tab title="Symbol table" disabled={errors}>
              <pre>{prettyObject(props.symbolTable)}</pre>
            </Tab> */}
            <Tab title="AST JSON" disabled={errors}>
              {!errors && <pre>{prettyObject(props.ast)}</pre>}
            </Tab>
            <Tab title="AST Viewer" disabled={errors} idx="asdf">
              {!errors && <AstViewer ast={props.ast} />}
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
