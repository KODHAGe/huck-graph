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
      <CsvUploader updateCsvData={handleCsvData}></CsvUploader>
      <StatsView csvData={csvData}></StatsView>
    </div>
  );
}

export default App;
