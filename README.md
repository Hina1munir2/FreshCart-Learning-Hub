# FreshCart Learning Hub

FreshCart Learning Hub is a lightweight learning platform being developed for
FreshCart Grocers as part of a MERN Stack project.

The platform is intended to help FreshCart customers learn about organic foods,
seasonal recipes, and sustainable shopping habits through short learning
courses.

## Task 1 — Project Scaffolding and Landing Page

Task 1 focuses on setting up the project structure and creating a simple,
branded landing page.

The project contains separate frontend and backend applications:

- `/client` — React frontend
- `/server` — Express backend

The landing page is available at `/` and includes FreshCart branding,
navigation, a learning-focused tagline, and a **View Courses** button that
routes users to `/courses`.

## Features Implemented

- FreshCart Learning Hub branded landing page
- FreshCart logo and navigation
- Home page available at `/`
- Hero section with:
  - FreshCart Learning Hub branding
  - "Learn. Grow. Succeed." tagline
  - Supporting description
  - View Courses call-to-action
- View Courses navigation to `/courses`
- Courses page route
- Responsive landing page styling
- Fixed transparent navigation bar
- Hero background image
- ESLint configuration
- Prettier configuration
- Separate React client and Express server
- Git repository structure

## Technology Stack

### Frontend

- React
- React Router
- CSS
- Create React App

### Backend

- Node.js
- Express

### Development Tools

- Git
- GitHub
- VS Code
- ESLint
- Prettier
- npm

## Project Structure
FreshCart-Learning-Hub/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Courses.jsx
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── ...
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore

# Task 2 — Database and Course API

Task 2 focuses on connecting the FreshCart Learning Hub backend to MongoDB Atlas and building a REST API for courses and lessons.

## What Was Implemented

- Connected Express backend to a free MongoDB Atlas cluster
- Added `.env` configuration using `dotenv`
- Created Course and Lesson Mongoose schemas
- Added required field validation
- Added title ,description,`videoUrl` fields for courses and lessons
- Implemented Course CRUD REST endpoints:
  - `GET /api/courses`
  - `POST /api/courses`
  - `PUT /api/courses/:id`
  - `DELETE /api/courses/:id`
- Added pagination using `page` and `limit`
- Added validation and error handling
- Added proper HTTP status codes
- Created a database seed script
- Seeded 3 FreshCart courses with 2 lessons each
- Tested the API using Postman

## Sample Learning Content

The seeded courses focus on:

- Organic Foods
- Seasonal Recipes
- Sustainable Shopping

Each course contains two lessons related to its topic.

## API Example
GET /api/courses?page=1&limit=2

## Tools Used
Node.js
Express
MongoDB Atlas
Mongoose
dotenv
Postman
Git/GitHub

## Task 3: Authentication and Authorization

### What I Did
- Created a User model to store user email, hashed password, and role.
- Implemented user registration and login using Express.js.
- Used bcrypt to hash passwords and verify login credentials securely.
- Implemented JSON Web Token (JWT) authentication with a **7-day expiration**.
- Created authentication middleware to protect API routes and reject missing or invalid tokens.
- Protected enrollment and learning progress endpoints so users can access their own data through authenticated requests.
- Tested registration, login, token expiration, and protected endpoints using Postman.

### Why I Did It
These features improve application security by protecting passwords, verifying user identity, and preventing unauthorized access to protected API endpoints.

### Technologies Used
Node.js, Express.js, MongoDB atlas, Mongoose, bcrypt, JSON Web Token (JWT), and Postman.

# Task 4: FreshCart Learning Hub — Course Catalog and Learning Progress

## Overview

In Task 4, I developed React pages for FreshCart Learning Hub to allow users to browse courses, enroll in courses, watch lesson videos, and track their learning progress. The application uses React, Axios, React Router, and JWT-based authentication to connect the frontend with the backend API.

## Features Implemented

### 1. Authentication and User Management
- Used `AuthContext` to manage authentication state and user information.
- Stored and used the JWT token for authenticated API requests.
- Restricted enrollment and learning features to logged-in users.

### 2. Course Catalog
- Fetched course information from the backend using Axios.
- Displayed courses in a responsive card layout.
- Implemented pagination to navigate through course lists.
- Added a search bar to search for courses by title.
- Added a category dropdown to filter courses.

### 3. Course Enrollment
- Added an **Enroll Now** button to course cards.
- Connected enrollment to the protected `POST /api/enrollments` endpoint.
- Updated the button and interface to show when a user is enrolled.
- Redirected users to the login page when authentication is required.

### 4. Lesson Viewer
- Retrieved course and lesson information from the backend.
- Implemented lesson video playback using the available video URL.
- Added functionality to mark a lesson as completed through a backend API request.
- Provided navigation to the selected lesson using its course and lesson IDs.

### 5. User Dashboard and Progress Tracking
- Displayed enrolled courses on the user dashboard.
- Added course information, including titles and descriptions.
- Included progress bars to visually represent course completion.
- Connected the dashboard to enrollment and learning-progress information.

### 6. Responsive User Interface
- Used CSS to create a clean, consistent course catalog and dashboard.
- Added responsive layouts for different screen sizes.
- Used green-themed course cards, buttons, and progress indicators to match the FreshCart Learning Hub design.

## Technologies Used

- **React** — building reusable UI components and pages.
- **Axios** — communicating with backend API endpoints.
- **React Router** — navigation between pages and lessons.
- **JWT** — authentication for protected operations.
- **Bootstrap and CSS** — responsive interface styling.
- **React Testing Library** — testing React components.


