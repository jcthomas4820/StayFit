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

We will prevent XSS attacks by escaping user-generated input out of all HTML specific symbols and making sure that 
the user input will be rendered as a text only before injecting dynamic HTML in our website.

We will prevent SQL-injection by using prepared statements with parameterized queries for performing SQL queries 
because this forces us to first define the SQL code and then pass specific parameters to SQL query. This way the data entered will be limited to a scope it can’t expand beyond. 

We will also discard sensitive data whenever it is no longer needed.