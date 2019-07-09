# Volunteer Portal API

## Endpoints

* /races - GET
* /shifts: 
    GET - returns all shifts
    GET (/:race_id) - returns all shifts with the associated race id
    GET (/:user_id) - returns all shifts with the associated user id
    POST - Creates new shift
    PATCH - (/:shift_id) Add user Id to a shift upon selection.
            user_id is sent in the request body.
* /users:
    POST: Creates new user 
        email, full_name, and password are submitted in the request body
    PATCH (/users/:user_id) adds points to user

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

 