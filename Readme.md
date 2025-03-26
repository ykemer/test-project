# API for the project

## Before you start
1. Make sure you have docker installed on your machine
2. Make sure you have node.js installed on your machine. Version 22.14.0 is prefered
3. Obtain API keys from OpenWeatherMap
   - Register: https://home.openweathermap.org/users/sign_up
   - Get API key: https://home.openweathermap.org/api_keys


## How to install
1. Clone the repository to your local machine
2. Run `npm install` to install all the dependencies
3. Install typescript globally by running `npm install -g typescript`
4. Install ts-node globally by running `npm install -g ts-node`
5. Run `docker-compose up -d` in infra folder to start the database and redis
6. Create a `.env` file in the root folder and add the variables from `.env.dist` file. Update what is required
7. Run `npm run migrage` to run migrations
8. Run `npm run seed-db` to seed db with data. (Creates admin user. Username and password is in .env file)
9. Run `npm run dev` to start the server
10. Run `npm run build` to build the project
11. Run `npm start` to start the server in production mode


## Endpoints
To check endpoint documentation, run the server and go to `http://localhost:3000/api-docs`

### Insomnia
You can import the insomnia file in the docs folder to test the endpoints

## Code style
1. For code quality and style, we use eslint and prettier
2. You can run lint `npm run lint` and fix lint issues `npm run lint:fix`
3. You can configure your editor to use eslint and prettier for better development experience

## Tests
1. To run all tests, run `npm run test`.
2. To run integration tests, run `npm run test:integration:run`
3. To run unit tests, run `npm run test:unit:run`
4. To run acceptance tests, run `npm run test:acceptance:run`
4. To run e2e tests, run `npm run test:e2e:run`


## Additional
[View Improvement Suggestions](docs/improvements.md)

