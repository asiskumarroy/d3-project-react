import logo from './logo.svg';
import './App.css';
import TimeSeries from './components/TimeSeries';

function App() {
  return (
    <div className="App">
     <TimeSeries width={600} height={400}/>
    </div>
  );
}

export default App;
