# Security Analysis

Describe the security considerations you will take when building your app in this file. This should
include both a threat assessment and a planned defense strategy.

#### Attacks
An attacker can try to guess username and passwords to login into a user’s profile in our app, 
inject hostile data into our interpreter through attack vectors such as Cross Site Scripting and SQL-Injection 
to steal username and passwords, make changes to the way our app works, delete, corrupt user health and personal 
information, display wrong dietary information to the user and misguide the user by miscalculating their dietary 
needs and goals.

#### Prevention
We will perform a weak-password check when a user is registering or creating a new password, and ensure registration 
and login against account enumeration attacks by using the same messages for all outcomes.

We will prevent XSS attacks by escaping user-generated input out of all HTML specific symbols. So we will make sure that 
the user input provided through text-fields such as username and password in the Login Page, and user's meal input in 
Nutrition Tracker component of the app, will be rendered as a text and not as HTML before injecting dynamic HTML in our website.

We will prevent SQL-injection by using prepared statements with parameterized queries for performing SQL queries such as
queries for saving username and password when a user registers, query for checking if the user is a valid user and has 
entered a valid password when they are logging in, query for for calculating user's macro nutrients report, and query 
for analyzing/adding up user's per day nutrients. Doing so will force us to first define the SQL code and then 
pass specific parameters to SQL query. This way the data entered will be limited to a scope it can’t expand beyond. 

We will also discard sensitive data whenever it is no longer needed. 
For instance, we will discard user information such as user gender, age, height, weight, and activity level after using 
it to calculating and displaying their macro nutrient report. 
