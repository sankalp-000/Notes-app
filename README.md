# Secure and Scalable RESTful API for Notes

This repository contains the implementation of a secure RESTful API for managing notes. The API allows users to perform CRUD operations on their notes, share notes with others, and search for notes based on keywords. It also include authentication and authorization.

## Table of Contents

- [Technical Stack](#technical-stack)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Rate Limiting and Request Throttling](#rate-limiting-and-request-throttling)
- [Search Functionality](#search-functionality)
- [Testing](#testing)
- [Getting Started](#getting-started)
- [Evaluation Criteria](#evaluation-criteria)
- [Contributing](#contributing)
- [License](#license)

## Technical Stack

The implementation of the API is built using the following technologies:

- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) for its flexibility in handling unstructured data
- **Authentication:** [JSON Web Token (JWT)](https://jwt.io/) for secure user authentication
- **Rate Limiting:** Implemented using middleware such as [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- **Request Throttling:** Handled through middleware like [express-throttle](https://www.npmjs.com/package/express-throttle) for handling high traffic
- **Testing:** [Jest](https://jestjs.io/) for unit and integration tests
- **Search Functionality:** Leveraging MongoDB's text indexing for high-performance keyword search

## API Endpoints

### Authentication Endpoints

- **POST /api/auth/signup:** Create a new user account.
- **POST /api/auth/login:** Log in to an existing user account and receive an access token.

### Note Endpoints

- **GET /api/notes:** Get a list of all notes for the authenticated user.
- **GET /api/notes/:id:** Get a note by ID for the authenticated user.
- **POST /api/notes:** Create a new note for the authenticated user.
- **PUT /api/notes/:id:** Update an existing note by ID for the authenticated user.
- **DELETE /api/notes/:id:** Delete a note by ID for the authenticated user.
- **POST /api/notes/:id/share:** Share a note with another user for the authenticated user.
- **GET /api/search?q=:query:** Search for notes based on keywords for the authenticated user.

## Authentication

The API uses JSON Web Token (JWT) for authentication. When a user logs in, they receive an access token that must be included in the headers of subsequent requests to access protected endpoints.

## Rate Limiting and Request Throttling

The API employs rate limiting and request throttling to handle high traffic. Middleware such as express-rate-limit and express-throttle is used to control the number of requests a user can make within a specified time frame.

## Search Functionality

The API implements text indexing in MongoDB to enable efficient searching for notes based on keywords. This provides users with a fast and scalable search experience.

## Testing

The API is thoroughly tested using Jest. The test suite includes unit tests for individual functions and integration tests to ensure the proper functioning of API endpoints.

## Getting Started

Follow these instructions to set up and run the project locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/sankalp-000/Notes-app.git
   ```

2. **install Dependencies**

   ```
   npm install
   ```

## Run the application

run the following command: 
   ```
   npm start
   ```

now go to postman and hit any api you want and test the response.
1. Signup: 
```
   url : http://localhost:3000/api/auth/signup
   request type: POST
   add header: key: (Content-Type , value: application/json) 
   sample Body : 
   {
     "username": "ranjan1",
     "password": "123456",
     "email":"ranjan@gmail.com"
   }
   hit send button.
```
   

2. Login: 
```
   url : http://localhost:3000/api/auth/login
   request type: POST
   add header: (key: Content-Type , value: application/json) 
   sample Body : 
   {
    "username": "ranjan",
    "password": "123456"
   }
   hit send button.
   copy the token recieved on response.

```
   3.  create a new note: 
   ```
   url : http://localhost:3000/api/notes
   request type: POST
   add header: (key:Content-Type , value: application/json) 
   add header: (key:Authorization, value: Bearer <token copied from previous step>)
   sample body :
   {
    "title": "banana Fruit ranjan",
    "content": "peel it and then we eat it."
   }
   hit send button.
   ```

   4. get all notes for a logged in user: 
   ```
   url : http://localhost:3000/api/notes
   request type: GET
   add header: (key:Authorization, value: Bearer <token copied from login step>) 
   hit send button.
   ```

   5.  update a  note: 
   ```
   url : http://localhost:3000/api/notes/:id
   request type: PUT
   add header: (key:Content-Type , value: application/json) 
   add header: (key:Authorization, value: Bearer <token copied from previous step>)
   in path variable: add note id of any note(you can get this from get all notes api)
   sample body :
   {
    "title": "banana Fruit updated",
    "content": "peel it and then we eat it."
   }
   hit send button.
   ```

   6.  delete a  note by note id: 
   ```
   url : http://localhost:3000/api/notes/:id
   request type: DELETE
   add header: (key:Authorization, value: Bearer <token copied from previous step>)
   in path variable: add note id of any note(you can get this from get all notes api)
   hit send button.
   ```
  
   7. search notes using keyword:
   ```
   url : http://localhost:3000/api/notes/search?q=banana
   request type: GET
   add header: (key:Authorization, value: Bearer <token copied from previous step>)
   in query params: add whatever keyword you want to search (ex : banana)
   hit send button.
   ```

   8. share notes:
   ```
   url : http://localhost:3000/api/notes/:id/share
   request type: POST
   add header: (key:Content-Type , value: application/json) 
   add header: (key:Authorization, value: Bearer <token copied from previous step>)
   in path variable: add note id of any note(you can get this from get all notes api)
   {
    "sharedUsername": "sankalp" // enter username of any user you want to share.
   }
   hit send button.

   ```

## Run Unit Test
run the following command:
   ```
   npm test
   ```
## check the Rate limit and request throtting

in one of the terminal run the application by running "npm start" command.
now add one more terminal in parallel and run the following command:
   ```
   node .\test\testRateLimit.js
   ```
