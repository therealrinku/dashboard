import { BrowserRouter as Router, Route } from "react-router-dom";
import homepage from "./pages/homepage";

function App() {
  return (
    <Router>
      <Route path="/" component={homepage} />
    </Router>
  );
}

export default App;
