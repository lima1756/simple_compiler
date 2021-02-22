import React from 'react';
import { Collection, CollectionItem } from 'react-materialize';
import SymbolTable, { SymbolType } from '../../../../compiler/Tables/SymbolTable';

interface ErrorViewerProps {
  symbolTable: SymbolTable,
}

function SymbolTableViewer(props: ErrorViewerProps) {
  const symbolTable = props.symbolTable.data;
  return (
    <Collection>
      {Object.keys(props.symbolTable.data).map(key => (
        <CollectionItem key={key}>
          <span className="title">
            <b>{symbolTable[key].name}</b>
          </span>
          <p style={{ margin: 0 }}>
            <b>Type: </b> {SymbolType[symbolTable[key].type]}
            <br />
            <b>Line: </b> {symbolTable[key].declaration.line} -- <b>Start: </b> {symbolTable[key].declaration.start}
          </p>
        </CollectionItem>

      ))}
      {props.symbolTable.length == 0 && (
        <CollectionItem >
          <span className="title">
            <b>No symbols!</b>
          </span>
        </CollectionItem>
      )}
    </Collection >
  )
}

export default SymbolTableViewer;