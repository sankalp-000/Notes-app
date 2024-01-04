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
   git clone https://github.com/your-username/notes-api.git
