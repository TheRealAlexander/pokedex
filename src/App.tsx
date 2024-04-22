import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Pokedex from "./Pokedex";
import PokemonDetail from "./PokemonDetail";
import About from "./About";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/" className="nav-link">
          Pokédex
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;

export {};
