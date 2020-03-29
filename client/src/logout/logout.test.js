import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('page render', async () => {
    it('renders without crashing');
});

describe('login/register component', async () => {
    it('has a location for the user to enter a username');
    it('has a location for the user to enter a password');
    it('has a login button');
    it('has a register button');
    it('displays error messages if username is in use');
    it('displays error messages if username does not exist');
    it('displays error messages if password is invalid');
});