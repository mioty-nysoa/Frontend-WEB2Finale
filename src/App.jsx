import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <div style={{ padding: "2rem" }}>
          <h1>Test de la Navbar</h1>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;