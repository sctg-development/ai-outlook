import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AIPane from "./Aipane";
import Clean from "./Clean";
const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<AIPane />} />
          <Route path="/clean" element={<Clean />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
