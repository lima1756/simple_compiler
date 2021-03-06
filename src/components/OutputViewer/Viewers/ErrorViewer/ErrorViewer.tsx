import React from 'react';
import { Collection, CollectionItem, Icon } from 'react-materialize';
import ErrorTable from '../../../../compiler/Tables/ErrorTable';

interface ErrorViewerProps {
  errorTable: ErrorTable,
}

function ErrorViewer(props: ErrorViewerProps) {

  return (
    <Collection>
      {props.errorTable.errors.map(error => (
        <CollectionItem key={error.message}>
          <span className="title">
            <b>{error.message}</b>
          </span>
          <p style={{ margin: 0 }}>
            <b>Line: </b> {error.token.line}
            <br />
            <b>Start: </b> {error.token.start}
            <br />
            <b>Value: </b> {error.token.data}
          </p>
        </CollectionItem>
      ))}
      {props.errorTable.length == 0 && (
        <CollectionItem >
          <span className="title">
            <b>No errors!</b>
          </span>
        </CollectionItem>
      )}
    </Collection >
  )
}

export default ErrorViewer;