import './App.css';

import { useState } from 'react';

import CsvUploader from './components/csvUploader'
import StatsView from './components/statsView'

function App() {
  const [csvData, setCsvData] = useState("");

  function handleCsvData(data) {
    setCsvData(data);
  }

  return (
    <div className="App">
      <div className="main">
        <div className="intro">
          <span id="title">
            <h1 className="title-heading">Huckleberry pie <span className="italic">(chart)</span></h1>
            <img src="pie_1075891.png" className="title-icon"></img>
          </span>
          <p>A tool that cooks some nice stats and graphs out of your Huckleberry data. 
            Works completely locally in your own browser, data is not stored or processed outside your own computer!</p>
          <div className="controls">
            <CsvUploader updateCsvData={handleCsvData}></CsvUploader>
          </div>
        </div>
        <div className="contents">{
          csvData &&
          <StatsView csvData={csvData}></StatsView>
        }
        </div>
      </div>
      <footer>
        <a href="https://www.freepik.com/icon/pie_1075891#fromView=search&term=pie+slice+icon&track=ais&page=1&position=73&uuid=34c85a08-7f8d-41df-8dbd-92d952a6a5f3">Icon by Freepik</a>
      </footer>
    </div>
  );
}

export default App;
