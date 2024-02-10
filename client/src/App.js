import './App.css';
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {Tab} from './pages/tab';
import {Home} from './pages/home';
import {New} from './pages/new';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>,
    },
    {
      path: 'notetab/new',
      element: <New/>,
    },
    {
      path: 'notetab/:urlKey',
      element: <Tab/>,
    },
  ]);

  return (
    <div className='App'>
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
