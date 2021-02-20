import React from 'react';
import { Preloader } from 'react-materialize';
import "./Loader.scss"

function Loader() {
  return (
    <div id="Loader">
      <Preloader
        active
        color="blue"
        flashing
      />
    </div>
  )
}

export default Loader;