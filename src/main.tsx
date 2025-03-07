import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>
);

// //* This behavior only happens in development, not in production.
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// import { BrowserRouter as Router } from 'react-router-dom';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   // <React.StrictMode>
//   //   <App />
//   // </React.StrictMode>,
//   <Router>
//     <App />
//   </Router>,
// )

//* for production
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <App />
// )


//! Below code is good but it doesn't work for the ID parsing
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// // import { BrowserRouter } from 'react-router-dom'
// import { BrowserRouter as Router } from 'react-router-dom';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   // <React.StrictMode>

//   // <BrowserRouter>
//   //   <App />
//   // </BrowserRouter>
//   <Router>
//     <App />
//   </Router>,
//   // </React.StrictMode>,
// )
