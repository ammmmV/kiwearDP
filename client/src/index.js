import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import PatternStore from './store/PatternStore';
import BasketStore from './store/BasketStore';
import OrderStore from './store/OrderStore';
import ReviewStore from './store/ReviewStore';

export const Context = createContext(null);

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        user: new UserStore(),
        pattern: new PatternStore(),
        basket: new BasketStore(),
        order: new OrderStore(),
        review: new ReviewStore()
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);
console.log("work " + process.env.REACT_APP_API_URL);
 