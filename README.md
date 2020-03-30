# Senior Squad Final Project

## Description
The StayFit! web application is your one-stop shop to reaching your fitness heights.
Staying fit with StayFit! involves optimizing both nutrition and exercise.

This web app uses the Edamam Nutrition Analysis API and CRUD infrastructure to give its users the chance to reach their most ambitious fitness goals.
The components of this web app include:
- Exercise Grid:        For each specific exercise, users can save their personal record, muscle worked, and day. This component comes with options to organize their   
                        exercises and track their progress. This will require a database to store these exercise values, in which we'll be implementing MongoDB, and a view model for the grid's layout.
- Macro Calculator:     Users can calculate their own personal distribution of daily nutrients based on their personal values (e.g. height, weight, age, activity level,
                        etc.). The calculator will spit out personal daily recommendation on protein, carbohydrates. and fats. This can be implemented either using an external API, or researched equations we can add in. Users can then submit these values, which would store them into the database and be tracked with the Nutrition Tracker component.
- Nutrition Tracker:    The macros calculated from the Macro Calculator will be displayed as the user's daily goals. Users can input in plain text their specific meal 
                        that day, and analyze the macros contained in the meal (this is done through the Edamam Nutrition Analysis API). They can then submit these values,which would perform some calculations in the backend, and display how close they are to reaching their nutritional goals for that day. 

## Authors

| Member | Web dev level | Specialization |
| --- | --- | --- |
| Justin Thomas | Web Programming Novice | n/a |
| Jessica DeStefano | Web Programming Novice | n/a |
| Saema Ansari | Web Programming Novice | n/a |

## Deliverables for checkpoint 2

The CRUD deliverables will be a view model of each component (doesn't need to be fancy, just simply an outline we can add style to later).
We plan to use the MERN stack.
There should be a login/register screen, where a user can either sign up for the first time or login. This would send a POST request to the
server, allowing the user to login (if credentials match) or register. 
On the next screen, they can choose between the three components.
For this checkpoint, we are simply going to send POST/GET requests to the server with the specific data of the component. The data will be saved in 
the MongoDB database, and React will handle the UI.

## Deliverables for checkpoint 4
- Improve the overall UI in making it more visually pleasing
- Integrate the Edamam Nutrition Analysis API
    - Allows the user to input a meal and updates their macro count
    - Complete unit tests for this addition
- Add additional Exercise Grid features
    - Allow for the user to keep track of more than three exercises
    - Allow for the user to delete an exercise 
    - Allows the user to change how they organize the grid
    - Complete unit tests for this addition
- Begin writing front end tests using JEST
- Work to make the application more secure 
    - Mainly working with sanitizing user input (bulk of the application) 
- Abstract out the routes into their own Router files (user, grid, nutrition)

### Checkpoint 4 tests
The focus on checkpoint 3 was ensuring our server-side tests were passing. For checkpoint 4, we plan to add more server-side tests as we implement for features. However, we will be shifting some of our focus to starting to write the front-end test suite.
#### Backend (server/test/integration.js)
1. exercise-test
    - it('allows user to remove rows from the grid')
    - it('allows the user select how to organize the grid')
2. nutrition-test
    - it('requires a logged in user to input a meal')
    - it('allows user to input a meal')
    - it('calculates the user's current macro count')
    - it('alerts the user when they are over their daily macro intake')
#### Frontend (client/src - found within each component)
*Note: The full test suite is included here, but we will split this work between the final two checkpoints*
1. calculator.test
    - it ('renders without crashing')
    - it('provides a component description')
    - it('has boxes/buttons for user to input information');
    - it('has a calculate button');
    - it('has a submit button');
    - it('has a results display box')
    - it('displays accurate macro information after calculation');
    - it("submits the proper calculated results");
    - it("only submits after results are calculated");

2. grid.test
    - it('renders without crashing');
    - it('provides a component description')
    - it('properly populates blank initial rows for a new user');
    - it('properly populates initial rows for a returning user');
    - it('allows a user to edit a row');
    - it('allows a user to save a row');
    - it('correctly updates when user removes a row');
    - it('properly adds a row');
    - it('has proper textboxes for input for each row')
    - it('has edit and save buttons for each row')

3. selection.test
    - it('renders without crashing');
    - it('provides a component description')
    - it('contains the exercise grid button');
    - it('contains the macro calculator button');
    - it('contains the nutrition tracker button');
    - it('contains the logout button');
    - it('contains the username on the screen');
    - it('properly routes to exercise grid')
    - it('properly routes to macro calculator')
    - it('properly routes to nutrition tracker')
    - it('properly routes to logout')

4. logout.test
    - it('renders without crashing');
    - it('provides a StayFit! app description')    
    - it('has a location for the user to enter a username');
    - it('has a location for the user to enter a password');
    - it('has a login button');
    - it('has a register button');
    - it('displays error messages if username is in use');
    - it('displays error messages if username does not exist');
    - it('displays error messages if password is invalid');

5. tracker.test
    - it('renders without crashing');
    - it('provides a component description')
    - it('displays the daily target protein');
    - it('displays the daily target carbs');
    - it('displays the daily target fats');
    - it('displays the users current total protein');
    - it('displays the users current total carbs');
    - it('displays the users current total fats');
    - it('displays area for user to input meal');
    - it('displays area for user to see analysis');
    - it('displays button for user to analyze meal');
    - it('displays button for user to submit meal');
    - it('correctly updates after a user enters a meal');
    - it('requests ingredients from the user');
    - it('correctly calculates macros')
    - it('adds calculated macros to daily total');
    

## Deliverables for final project

Outline in English what the deliverables will be for the final checkpoint. This will should be
similar to the **Description** above, but written out as an explicit checklist rather than a human
readable description. Reminder that this is not *due* until checkpoint 4, but failing to plan is
planning to fail.

For each specialization, you must list specific checkpoints that are relevant to that particular specialization.

## Specialization deliverables

For each student/team adding a specialization, name that specialization and describe what
functionality you will be adding.

## Installation
### Checkpoint 2 / Running locally
```
git clone https://github.com/ckanich-classrooms/final-project-senior-squad-1.git
cd final-project-senior-squad-1
npm start
```
Application will be visible at: http://localhost:3000

### Checkpoint 3-Final / Deployment using Docker
TODO: Add the installation instructions 
