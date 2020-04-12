# Sources used during development

#### Getting set up with React
Documentation: https://reactjs.org/docs/getting-started.html

#### Setting up MERN Stack
Followed these tutorials taking bits and pieces from both, and combined it with the file structure from previous homework assignments: 
- https://blog.cloudboost.io/creating-your-first-mern-stack-application-b6604d12e4d3
- https://medium.com/javascript-in-plain-english/full-stack-mongodb-react-node-js-express-js-in-one-simple-app-6cc8ed6de274

Parts two and three of this four step tutorial to connect the back and front end:
- https://codingthesmartway.com/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-2/
- https://codingthesmartway.com/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-3/

Setting up express-sessions with MERN
- https://itnext.io/mastering-session-authentication-aa29096f6e22

#### Handling React Input
- https://medium.com/the-andela-way/handling-user-input-in-react-crud-1396e51a70bf

#### JEST
Documentation: https://jestjs.io/docs/en/getting-started

#### SECURITY RISKS AND PREVENTION OWASP
- https://owasp.org/www-project-top-ten/

#### CORS
I ran into an issue with the express-session not persisting across axios calls. I believed it to be a CORS issue. This helped solve the problem I was running into: https://glitteringglobofwisdom.com/session-cookies-auth-and-cors-using-axios-and-an-express-server/

#### Get random int 
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

#### Get random string
- https://gist.github.com/6174/6062387#gistcomment-2915959

#### Macros calculation
- https://www.healthline.com/nutrition/how-to-count-macros#step-by-step

#### Date conversion to string
- https://www.tutorialrepublic.com/faq/how-to-get-day-month-and-year-from-a-date-object-in-javascript.php

#### FindOneAndUpdate
- https://mongoosejs.com/docs/tutorials/findoneandupdate.html

#### Docker with Node.js, Mongo and REACT
- Sections 2 and 3: https://dev.to/vguleaev/dockerize-a-node-js-app-connected-to-mongodb-5bp1
- Sources to solve the following error:
    ```
    return process.dlopen(module, path._makeLong(filename));
    Error: /code/node_modules/bcrypt/lib/binding/bcrypt_lib.node: invalid ELF header
    ```
    - https://stackoverflow.com/questions/42817446/docker-with-node-bcrypt-invalid-elf-header
    - https://stackoverflow.com/questions/30043872/docker-compose-node-modules-not-present-in-a-volume-after-npm-install-succeeds 

#### Kanich MongoDB Service Example (for Github Actions)
- https://github.com/kaytwo/example-services/blob/master/.github/workflows/mongodb-service.yml

#### Calorie Calculation
- http://www.checkyourhealth.org/eat-healthy/cal_calculator.php

#### Spoonacular Diet Planner
- https://spoonacular.com/food-api/docs#Generate-Meal-Plan

#### Using Fetch API
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
