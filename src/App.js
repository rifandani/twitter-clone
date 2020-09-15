import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
// toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// files
import './App.css';
import UserContext from './contexts/UserContext';
import useAuth from './hooks/useAuth';
// import PrivateRoute from './components/PrivateRoute/PrivateRoute';
// components
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Forgot from './components/Forgot/Forgot';
import Tweet from './components/Tweet/Tweet';
import Profile from './components/Profile/Profile';
import User from './components/User/User';

function App() {
  const [user, setUser] = useAuth();

  return (
    <CookiesProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="app font-sans">
          <ToastContainer />

          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/trending">
              <Home />
            </Route>
            <Route exact path="/favorite">
              <Home />
            </Route>
            <Route exact path="/retweet">
              <Home />
            </Route>
            <Route exact path="/explore">
              <Home />
            </Route>
            <Route exact path="/profile/:userId">
              <Profile />
            </Route>
            <Route exact path="/user/:userId">
              <User />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/forgot-password">
              <Forgot />
            </Route>
            <Route exact path="/post/:postId">
              <Tweet />
            </Route>
          </Switch>
        </div>
      </UserContext.Provider>
    </CookiesProvider>
  );
}

export default App;
