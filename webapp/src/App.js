import './App.css';
import {fetchUserHealthData} from "./request/healthDataRequest"

function App() {
  fetchUserHealthData(123456)
  return (
    <div className="App">

    </div>
  );
}

export default App;
