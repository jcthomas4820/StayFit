# Senior Squad Final Project

## Description

The StayFit! web application is your one-stop shop to reaching your fitness heights.
Staying fit with StayFit! involves optimizing both nutrition and exercise.

This web app uses the Edamam Nutrition Analysis API and CRUD infrastructure to give its users the chance to reach their most ambitious fitness goals.
The components of this web app include:

- Exercise Grid: For each specific exercise, users can save their personal record, muscle worked, and day. This component comes with options to organize their  
   exercises and track their progress. This will require a database to store these exercise values, in which we'll be implementing MongoDB, and a view model for the grid's layout.
- Macro Calculator: Users can calculate their own personal distribution of daily nutrients based on their personal values (e.g. height, weight, age, activity level,
  etc.). The calculator will spit out personal daily recommendation on protein, carbohydrates. and fats. This can be implemented either using an external API, or researched equations we can add in. Users can then submit these values, which would store them into the database and be tracked with the Nutrition Tracker component.
- Nutrition Tracker: The macros calculated from the Macro Calculator will be displayed as the user's daily goals. Users can input in plain text their specific meal
  that day, and analyze the macros contained in the meal (this is done through the Edamam Nutrition Analysis API). They can then submit these values,which would perform some calculations in the backend, and display how close they are to reaching their nutritional goals for that day.

## Authors

| Member            | Web dev level          | Specialization |
| ----------------- | ---------------------- | -------------- |
| Justin Thomas     | Web Programming Novice | n/a            |
| Jessica DeStefano | Web Programming Novice | n/a            |
| Saema Ansari      | Web Programming Novice | n/a            |

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
- Edit .github/workflows/mongodb-service.yml to properly run GitHub Actions using a mongo container

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

_Note: The full test suite is included here, but we will split this work between the final two checkpoints_

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

## Progress Report

What we aimed to finish for checkpoints 2-4 was having an application where a user could track their exercises and progress, as well as providing them a means of having healthy meals.

### What is currently working

- The user can create an account, login and logout
- There is a navigation bar that the user can use to get around the web app
- The exercise grid - allows the user to enter an exercise with its name, date and a descriptio - the user can organize this by name or date
- The meal planner - allows the user to generate their daily required calories based on their gender, age, weight and height - The user can recalculate their necessary calories when needed - Generate a meal plan for a day including breakfast, lunch and dinner - uses their calorie calculation - specify their chosen diet (ex: vegetarian, vegan) - specify anything they want to exclude from meals (ex: shellfish) - Redirected to view their meal names, its required time, its serving size and the nutrient information for the day

### Who did what

#### Justin

##### Backend

- Integrated the Spoonacular API into the application
- Implemented the /save-cal-rec, /get-cal-rec, /generate-meal-plan and /get-meal-plan routes
- Wrote the integration tests for these routes
- Reorganized the routes so they are each in their own route file

##### Frontend

- Set up initial React Components
- Wrote simple HTML skeleton code to get app started
- Added event handlers to update state
- Added routing between components

##### Other

- In collaboration with Jess: Dockerized the app

#### Saema

##### Backend

- Implemented the /get-exercise-data and /save-exercise-data
- Wrote the integration tests for these routes

##### Frontend

- Incorporated backend route calls into the event handlers in the exercise grid components

##### Other

- GitHub actions

#### Jess

##### Backend

- Setup initial backend file structure
- Implemented /, /login, /register, and /logout routes
- Wrote the integration tests for these routes

##### Frontend

- Revamped the existing frontend UI using styled-components
- Modified the frontend and backend code to allow for multiple exercises - Used react-tables for this as it provides a sorting mechanism for the columns
- Created the UI for the meal plan addition
- Incorporated backend route calls into the event handlers in the relevant components
- Wrote the front end tests

##### Other

- Setup GitHub action for ESLint checks
- In collaboration with Justin: Dockerized the app

### What didn't get done in time

- We wanted to keep the functionality of editing an exercise entry and add in the functionality of deleting an entry. This is going to be pushed to checkpoint 5
- Working to make the app more secure. We really wanted to focus on having a fully functioning application, and this was pushed to the side. However, our top priority for the next checkpoint is increasing the security precautions for the app.

### Changes

We initially were planning on using the Edamam Nutrition Analysis API. With this, the user could calculate their required macros for the day. Then, they could input meals they ate and it would update their macros. However, this API had a limit on how many API calls could be made in a month. Upon researching for others, we came across Spoonacular. We liked the overall API a lot more, and decided to allow the user to generate a meal plan for the day instead of needing to input different meals. With this API, we are not as limited to monthly API calls as we can make up to 150 per day instead of 200 for the whole month.

## Deliverables for final project

- Allow the users to edit and delete their exercises on the grid
  - Backend route implementation + unit tests + frontend implementation
- Allow the user to view the recipe of the meal that was generated for them
  - Route implementation + unit tests + frontend implementation
- Work to make the application more secure
  - Mainly working with sanitizing user input (bulk of the application)

### Who will be doing what

#### Justin

- Implement /delete-exercise and /get-recipe route on backend
- Write the unit tests for these routes and complete meal plan unit tests

#### Saema

- Implement /edit-exercise on the backend
- Write unit tests for this route

#### Jess

- Complete the frontend unit tests
- Implement the frontend UI for the recipe and edit/deleting of exercises
- Continue improving UI

#### Collectively

- Work to make the app more secure (#1 priority)

### Server Tests
1.  delete_grid_row-test
    - it('rejects operation if user is not logged in')
    - it('does not allow a user to delete a non-existent row')
    - it('properly deletes an existing row')

2.  get_calories-test
    - it('returns an error if calories were not calculated')
    - it('correctly pulls up calculated calories')

3.  meal_generator-test
    - it('does not allow generation without calorie calculation')

4.  get_mealplan-test
    - it('does not pull up meal plan if one is not saved')
    - it('does pull up a meal plan if one is saved')

5.  get_recipe-test
    - it('returns error if user is not logged in')
    - it('returns error for an invalid recipe')
    - it('returns correct recipe for a valid recipe')

### Frontend Tests
Based on some changes we made, a lot of the tests were removed. These are the remaining tests that will be implemented for the final deliverable. The files can be viewed in client/src/. Each file is found within its relavent component.

1. logout.test.js

   - test.todo("displays error messages if username is in use on register");
   - test.todo("displays error messages if username does not exist on login");
   - test.todo("displays error messages if password is incorrect on login");
   - test.todo("displays error messages if no password is entered");

2. grid.test.js

   - test.todo("correctly updates after a user inputs an exercise");
   - test.todo("correctly updates after a user edits an exercise");
   - test.todo("correctly updates after a user deletes an exercise");

3. mealplanner.test.js

   - test.todo("tells the user to calculate their calories if they don't have any");
   - test.todo("updates the user's calories once they have been calculated");

4. mealplannergenerate.test.js

   - test.todo("had inputs for the user's diet preference");
   - test.todo("had inputs for the user's food preferences");
   - test.todo("redirects the user to view their meal plan when calculated");

5. mealplannerview.test.js

   - test.todo("displays the breakfast meal information");
   - test.todo("displays the breakfast meal recipe link");
   - test.todo("displays the lunch meal information");
   - test.todo("displays the lunch meal recipe link");
   - test.todo("displays the dinner meal information");
   - test.todo("displays the dinner meal recipe link");
   - test.todo("displays the nutrient information");

## Specialization deliverables

n/a

## Installation

### Checkpoint 2 / Running locally

```
git clone https://github.com/ckanich-classrooms/final-project-senior-squad-1.git
cd final-project-senior-squad-1
npm start
```

Application will be visible at: http://localhost:3000

### Checkpoint 3-Final / Deployment using Docker

From the root of the responsitory, run the following command to build and start containers:

```
docker-compose up --build
```

Then, visit http://localhost:3000 to view the application

Run the following command to stop and remove all containers:

```
docker-compose down
```
