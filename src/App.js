import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';
import Plugin from './Plugin';

const theme = {
  mainColor: '#7fff00',
  secondaryColor: '#ff8c00'
};

const buttonText = 'textFromMainComponent';

function App() {
  const [pluginData, setPluginData] = useState(null)

  window.onBtnClick = 1
  async function getData() {
    const response = await fetch("http://localhost:3004/httml");
    const htmlCode = await response.json();
    if (htmlCode) {
      setPluginData(htmlCode)
    }
  }
 
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getData}>
          Get HTML
        </button>
        {pluginData && <Plugin pluginData={pluginData} iframeVariables={[{theme}, {buttonText}]}/>}
      </header>
    </div>
  );
}

export default App;
