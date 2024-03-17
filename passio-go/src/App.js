import "./App.css";
import HarvardSquareMap from "../../passio-go/src/components/map";
import SideBar from "./components/sidebar";

function App() {
  return (
    <div className="App">
      <h1 className="m-4 text-center">Passio Go</h1>
      <div className="row flex no-gutter">
        <div className="col-3">
          <div className="routes-title text-left">Routes</div>
          <SideBar />
        </div>
        <div className="col-9 bg-secondary">
          <HarvardSquareMap />
        </div>
      </div>
    </div>
  );
}

export default App;
