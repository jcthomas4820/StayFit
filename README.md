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

We plan to improve the overall UI in making it more visually pleasing.
All database information will be reflected on the UI components including:
- The grid will update with exercises based on input
- The macro calculator will display the calculations
- The nutrition tracker will update based on the macro input
We plan to have the Edamam Nutrition Analysis API integrated into the application.
We plan to complete the front-end test suite using JEST.
We plan to complete the back-end test suite using Mocha.
We plan to incorporate user input error handling, and displaying these messages to the user. For example, this could include
- Login errors (incorrect username or password)
- Registration errors (not entering a valid password or attempting to use an in-use username)

## Deliverables for final project

Outline in English what the deliverables will be for the final checkpoint. This will should be
similar to the **Description** above, but written out as an explicit checklist rather than a human
readable description. Reminder that this is not *due* until checkpoint 4, but failing to plan is
planning to fail.

For each specialization, you must list specific checkpoints that are relevant to that particular specialization.

## Specialization deliverables

For each student/team adding a specialization, name that specialization and describe what
functionality you will be adding.

# Installation

By the time you get to the end of the final project, this section should have a full set of
instructions for how to spin up your app.
