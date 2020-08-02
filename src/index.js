import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  // you can also just use 'bottom center'
  position: positions.MIDDLE_LEFT,
  timeout: 1000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}
/**
 * Configure amplify , to connect our application to the backend API.
 */
Amplify.configure(aws_exports);

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}> <App />  </AlertProvider>,
  document.getElementById('root')
);


