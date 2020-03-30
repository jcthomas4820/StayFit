import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('page render', async () => {
    it('renders without crashing');
});

describe('app component', async () => {
    it('provides a component description')
    it('displays the daily target protein');
    it('displays the daily target carbs');
    it('displays the daily target fats');
    it('displays the users current total protein');
    it('displays the users current total carbs');
    it('displays the users current total fats');
    it('displays area for user to input meal');
    it('displays area for user to see analysis');
    it('displays button for user to analyze meal');
    it('displays button for user to submit meal');
    it('correctly updates after a user enters a meal');
});

describe('input meal', async () => {
    it('requests ingredients from the user');
    it('correctly calculates macros')
    it('adds calculated macros to daily total');
});