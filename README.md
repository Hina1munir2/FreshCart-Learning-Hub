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