import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('page render', async () => {
    it('renders without crashing');
});

describe('app component', async () => {
    it('displays the daily target');
    it('displays the users current total');
    it('correctly updates after a user enters a meal');
    it('has an input meal area');
});

describe('input meal', async () => {
    it('requests ingredients from the user');
    it('calculates the macros and subtracts from daily total');
});