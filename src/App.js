import React, { useState, useEffect } from 'react';
import DisplayPost from "./components/DisplayPost"
import CreatePosts from "./components/CreatePosts";
import Blog from "./components/Blog";
import Home from "./components/Home"
import { withAuthenticator } from '@aws-amplify/ui-react';
import { HashRouter, Route, Switch } from "react-router-dom";
import SinglePost from './components/SinglePost';
import Header from "./components/Header"
import { Auth } from 'aws-amplify'

import "./App.css"
global.Buffer = global.Buffer || require('buffer').Buffer
const App = () => {
  const [userName, setUsername] = useState("");


  useEffect(() => {
    Auth.currentAuthenticatedUser().then(
      user => {

        setUsername(user.username);
      }
    )
  })

  return (
    <div className="App">

      <HashRouter >
        <div id='ui container'>
          <h2>Hi {userName}</h2>
          <Header />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/Blog' exact component={Blog} />
            <Route path='/Blog/CreatePost' exact component={CreatePosts} />
            <Route path='/Blog/DisplayPost' exact component={DisplayPost} />
            <Route path='/Blog/DisplayPost/:id' exact component={SinglePost} />
          </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

export default withAuthenticator(App);
