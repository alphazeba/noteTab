import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import {loadTab, saveTab} from './io/api'
import {Tab} from './pages/tab';
import {Home} from './pages/home';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "notetab/:urlKey",
      element: <Tab/>
    },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
