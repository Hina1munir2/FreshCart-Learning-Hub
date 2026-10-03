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