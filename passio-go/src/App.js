import './App.css';
import HarvardSquareMap from './components/map';

function App() {
  return (
    <div className="App">
      <h1 className="m-4">Passio Go</h1>
      <div className="row flex no-gutter">
        <div className="col-3 bg-primary">
          Routes
        </div>
        <div className="col-9 bg-secondary">
          <HarvardSquareMap/>
        </div>
      </div>
    </div>
  );
}

export default App;
