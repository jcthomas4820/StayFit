import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('page render', async () => {
    it('renders without crashing');
    it('provides a StayFit! app description')
});

describe('register app component', async () => {
    it('has a location for the user to enter a username');
    it('has a location for the user to enter a password');
    it('has button for register');
    it('displays error messages if username is taken');
    it('displays error messages if password is invalid');
});

describe('login app component', async () => {
    it('has a location for the user to enter a username');
    it('has a location for the user to enter a password');
    it('displays error messages if username does not exist');
    it('displays error messages if password is invalid');
    it('has button for login');
});