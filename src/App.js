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
import checkEditor from "./components/checkEditor";
import { UserProvider } from "./store/UserContext"


import "./App.css"
import signIn from './components/signIn';


global.Buffer = global.Buffer || require('buffer').Buffer
const App = () => {

  return (
    <div className="App">

      <HashRouter >
        <div id='ui container'>


          <Switch>

            <UserProvider>
              <Header />
              <Route path='/' exact component={Home} />
              <Route path='/Blog' exact component={Blog} />
              <Route path='/Blog/CreatePost' exact component={CreatePosts} />
              <Route path='/Blog/DisplayPost' exact component={DisplayPost} />
              <Route path='/Blog/DisplayPost/:id' exact component={SinglePost} />
              <Route path='/checkEditor' exact component={checkEditor} />
              <Route path='/signIn' exact component={signIn} />
            </UserProvider>
          </Switch>
        </div>
      </HashRouter>
    </div>
  );
}

//export default withAuthenticator(App);
export default App;