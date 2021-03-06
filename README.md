# Ballon Express

This repository contains the web frontend for the Ballon Express project.
This project is developed by the CoderDojo ninjas from CoderDojo Kennemerwaard (Netherlands).
It's companion project containing all the arduino code can be found at https://github.com/bieb-coders/ballon-express-arduino

## Requirements

* MongoDB 3.x
* NodeJS/NPM latest LTS

## Getting the code

Just clone the master branch from the repository, or download the master zip.

Next, install all the npm dependencies by running the following command in the project folder

| `$ npm install`

## Setup the initial data in MongoDB

The MongoDB needs some initial collections and document before running the application (_make sure MongoDB is running_):

Run the following command in the project folder

| `$ node setup.js`

## Running the application

* First start MongoDB (if not already running)
* Run the following command in the project folder

| ` $ npm run start`