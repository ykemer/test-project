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
7. Run `npm run sync-db` to create the tables in the database
8. Run `npm run create-admin-user` to create admin user
9. Run `npm run dev` to start the server


## Endpoints
To check endpoint documentation, run the server and go to `http://localhost:3000/api-docs`

## Documentation
[View Improvement Suggestions](docs/improvements.md)

