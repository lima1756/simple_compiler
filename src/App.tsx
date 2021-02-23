import React from 'react';
import '../node_modules/materialize-css/dist/css/materialize.min.css'
import '../node_modules/materialize-css/dist/js/materialize.min.js'
import './App.scss';
import CodeEditor from './components/CodeEditor/CodeEditor';
import Navbar from './components/Navbar/Navbar';
import OutputViewer from './components/OutputViewer/OutputViewer';
import Compiler from './compiler/Compiler';
import Loader from './components/Loader/Loader';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [code, setCode] = React.useState<string>("fbiaa=5b=a+3.2pb");
  const [compiler, setCompiler] = React.useState<Compiler>();

  const exec = () => {
    setLoading(true);
    setCompiler(new Compiler(code));
    setLoading(false);
  }

  const upload = (e: any) => {
    //  e.target.files[0].type  e.target.files[0].size
    const fr = new FileReader();
    fr.onloadend = (e) => {
      if (fr.result) {
        setCode(fr.result.toString())
      }
      else {
        setCode("")
      }
    }
    fr.readAsText(e.target.files[0])
  }

  return (
    <div className="App">
      { loading && <Loader />}
      <Navbar exec={exec} uploadCode={upload} />
      <div className="row">
        <div className="col s12 m6"><CodeEditor code={code} setCode={setCode} /></div>
        <div className="col s12 m6"><OutputViewer compiler={compiler} /></div>
      </div>

    </div>
  );
}

export default App;
