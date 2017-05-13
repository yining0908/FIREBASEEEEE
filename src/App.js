import React, { Component } from 'react';
import * as firebase from 'firebase';
import { LoginStack } from './Router';

class App extends Component {

  componentWillMount() {
    firebase.initializeApp({
    apiKey: "AIzaSyAzd3oYuOR6SMTMxMyXnNLl7IUuAnEzCuY",
    authDomain: "weeek13.firebaseapp.com",
    databaseURL: "https://weeek13.firebaseio.com",
    projectId: "weeek13",
    storageBucket: "weeek13.appspot.com",
    messagingSenderId: "980685772106"
    });
  }

  render() {
    return (
      <LoginStack />
    );
  }
}


export default App;
