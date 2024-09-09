// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SubscriptionForm from "./components/SubscriptionForm";
import Success from "./Success";
import Cancel from "./Cancel";

const App = () => {
  console.log("App component is rendering...");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubscriptionForm />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </Router>
  );
};

export default App;
