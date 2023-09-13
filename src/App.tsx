import React from "react";
import "./App.css";
import { Parser } from "./services/parser";
import { ClassParser } from "./services/classParser";

import { Layout } from "./layout/Layout";
import { readFile } from "./services/fileReader";

function App() {
  let classes = ClassParser(readFile());

  const data = Parser(readFile(), classes);
  return (
    <div className="App">
      <header className="App-header">
        <Layout data={data}></Layout>
      </header>
    </div>
  );
}
export default App;
