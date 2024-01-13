import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import {loadTab, saveTab} from './io/api'

function App() {
  const [key, setKey] = useState("new");
  const [title, setTitle] = useState("Note Tab");
  const [body, setBody] = useState("");

  const handleTitleChange = (title) => {
    document.title = title;
    setTitle(title);
  }

  const handleBodyChange = (body) => {
    setBody(body);
  }

  const handleLoad = () => {
    loadTab(key).then((result) => {
      handleTitleChange(result.title);
      handleBodyChange(result.body);
    }).catch(err => console.log(err));
  }

  const handleSave = () => {
    saveTab(key, title, body).then((result) => {
      setKey(result.key);
    }).catch(err => console.log(err));
  }

  return (
    <div className="App">
      <header className="App-header">
        <input value={key} onChange={(e) => setKey(e.target.value)}/>
        <button onClick={handleLoad}>load</button>
        <button onClick={handleSave}>save</button>
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)}/>
        <textarea type="text" value={body} onChange={(e) => handleBodyChange(e.target.value)}/>
        <p>{title}</p>
        <p>{body}</p>
      </header>
    </div>
  );
}

export default App;
