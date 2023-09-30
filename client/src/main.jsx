import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers";
import "./firebase.js";
import "./assets/scss/style.scss";

// store
const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>,
)
