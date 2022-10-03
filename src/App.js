import Pages from "./Pages";
import NavBar from "./complonents/Navbar";

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Pages />
    </BrowserRouter>
  );
}

export default App;
