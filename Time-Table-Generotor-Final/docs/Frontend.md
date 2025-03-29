# Frontend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
5. [Component Details](#component-details)
   - [App.jsx](#appjsx)
   - [AddConstraints.jsx](#addconstraintsjsx)
   - [AddCourse.jsx](#addcoursejsx)
   - [AddTemplate.jsx](#addtemplatejsx)
   - [ConstraintList.jsx](#constraintlistjsx)
   - [CourseList.jsx](#courselistjsx)
   - [EditConstraints.jsx](#editconstraintsjsx)
   - [EditCourse.jsx](#editcoursejsx)
   - [EditTemplate.jsx](#edittemplatejsx)
   - [RecommendationSystem.jsx](#recommendationsystemjsx)
   - [TemplateList.jsx](#templatelistjsx)
   - [Timetable.jsx](#timetablejsx)
   - [UserRegistration.jsx](#userregistrationjsx)
   - [UserLogin.jsx](#userloginjsx)
   - [RoleBasedAccessControl.jsx](#rolebasedaccesscontroljsx)
   - [AnalyticsReporting.jsx](#analyticsreportingjsx)
   - [CalendarIntegration.jsx](#calendarintegrationjsx)
   - [CollaborationFeatures.jsx](#collaborationfeaturesjsx)
   - [AsanaIntegration.jsx](#asanaintegrationjsx)
   - [TrelloIntegration.jsx](#trellointegrationjsx)
6. [Testing Procedures and Best Practices](#testing-procedures-and-best-practices)

## Overview

The frontend part of the project is built using React and Material-UI. It provides a user interface for managing courses, constraints, templates, and generating timetables.

## Architecture

The frontend application follows a component-based architecture. Each component is responsible for a specific part of the user interface. The main components are:

- `App.jsx`: The main entry point of the application. It sets up the routing for different pages.
- `AddConstraints.jsx`: A component for adding new constraints.
- `AddCourse.jsx`: A component for adding new courses.
- `AddTemplate.jsx`: A component for adding new templates.
- `ConstraintList.jsx`: A component for displaying a list of constraints.
- `CourseList.jsx`: A component for displaying a list of courses.
- `EditConstraints.jsx`: A component for editing existing constraints.
- `EditCourse.jsx`: A component for editing existing courses.
- `EditTemplate.jsx`: A component for editing existing templates.
- `RecommendationSystem.jsx`: A component for displaying course recommendations.
- `TemplateList.jsx`: A component for displaying a list of templates.
- `Timetable.jsx`: A component for displaying the generated timetable.
- `UserRegistration.jsx`: A component for user registration.
- `UserLogin.jsx`: A component for user login.
- `RoleBasedAccessControl.jsx`: A component for managing role-based access control.
- `AnalyticsReporting.jsx`: A component for visualizing analytics data and exporting reports.
- `CalendarIntegration.jsx`: A component for integrating and visualizing the timetable in a calendar view.
- `CollaborationFeatures.jsx`: A component for providing real-time collaboration features.
- `AsanaIntegration.jsx`: A component for integrating with Asana for task management.
- `TrelloIntegration.jsx`: A component for integrating with Trello for task management.

## Technologies Used

The frontend application uses the following technologies:

- React: A JavaScript library for building user interfaces.
- Material-UI: A popular React UI framework for building responsive and customizable components.
- Axios: A promise-based HTTP client for making API requests.
- React Router: A library for handling routing in React applications.
- SweetAlert2: A library for displaying beautiful and customizable alerts.
- React Beautiful DnD: A library for drag-and-drop functionality.
- React Big Calendar: A library for calendar integration and visualization.
- Chart.js: A library for creating charts and graphs.
- Framer Motion: A library for creating animations and interactive elements.
- React Aria: A library for improving accessibility in React applications.

## Setup Instructions

To set up the frontend application, follow these steps:

1. Install the required dependencies:

```bash
npm install
```

2. Start the frontend development server:

```bash
npm start
```

This will start the development server and open the application in your default web browser.

## Component Details

### `App.jsx`

The `App.jsx` file is the main entry point of the application. It sets up the routing for different pages using React Router.

### `AddConstraints.jsx`

The `AddConstraints.jsx` component provides a form for adding new constraints. It allows users to select days, time ranges, and specify consecutive and non-consecutive subjects. Tooltips are provided to help users understand how to use the form. The component also includes better error handling and user feedback mechanisms using SweetAlert2, as well as interactive elements and animations using Framer Motion. Accessibility has been improved by following best practices for web accessibility.

### `AddCourse.jsx`

The `AddCourse.jsx` component provides a form for adding new courses. It allows users to enter the course name and code. Tooltips are provided to help users understand how to use the form. The component also includes better error handling and user feedback mechanisms using SweetAlert2, as well as interactive elements and animations using Framer Motion. Accessibility has been improved by following best practices for web accessibility.

### `AddTemplate.jsx`

The `AddTemplate.jsx` component provides a form for adding new templates. It allows users to enter the template name and description.

### `ConstraintList.jsx`

The `ConstraintList.jsx` component displays a list of constraints. It allows users to search, edit, and delete constraints.

### `CourseList.jsx`

The `CourseList.jsx` component displays a list of courses. It allows users to search, edit, and delete courses.

### `EditConstraints.jsx`

The `EditConstraints.jsx` component provides a form for editing existing constraints. It allows users to update the constraint details.

### `EditCourse.jsx`

The `EditCourse.jsx` component provides a form for editing existing courses. It allows users to update the course details.

### `EditTemplate.jsx`

The `EditTemplate.jsx` component provides a form for editing existing templates. It allows users to update the template details.

### `RecommendationSystem.jsx`

The `RecommendationSystem.jsx` component displays course recommendations. It fetches recommendations from the backend and displays them in a list.

### `TemplateList.jsx`

The `TemplateList.jsx` component displays a list of templates. It allows users to search, edit, and delete templates.

### `Timetable.jsx`

The `Timetable.jsx` component displays the generated timetable. It fetches the timetable data from the backend and renders it in a calendar view. It also provides a drag-and-drop interface for creating and editing timetables.

### `UserRegistration.jsx`

The `UserRegistration.jsx` component provides a form for user registration. It allows users to create a new account by entering their details.

### `UserLogin.jsx`

The `UserLogin.jsx` component provides a form for user login. It allows users to log in to their account by entering their credentials.

### `RoleBasedAccessControl.jsx`

The `RoleBasedAccessControl.jsx` component provides an interface for managing role-based access control. It allows administrators to assign roles and permissions to users.

### `AnalyticsReporting.jsx`

The `AnalyticsReporting.jsx` component provides visualizations for the analytics data, such as charts and graphs. It also allows users to export analytics reports in various formats, such as PDF or Excel.

### `CalendarIntegration.jsx`

The `CalendarIntegration.jsx` component integrates a calendar view to visualize the timetable. It allows users to sync schedules with different calendar types, such as Google Calendar and Microsoft Outlook.

### `CollaborationFeatures.jsx`

The `CollaborationFeatures.jsx` component provides real-time collaboration features, allowing multiple users to work on the same timetable simultaneously. It includes functionalities for adding comments and saving versions.

### `AsanaIntegration.jsx`

The `AsanaIntegration.jsx` component provides a form for creating tasks in Asana. It allows users to enter task details and create tasks in Asana.

### `TrelloIntegration.jsx`

The `TrelloIntegration.jsx` component provides a form for creating tasks in Trello. It allows users to enter task details and create tasks in Trello.

## Testing Procedures and Best Practices

To maintain a high level of code quality, please follow these testing procedures and best practices:

- Write tests for any new functionality or changes to existing functionality.
- Ensure that all critical functionality is covered by tests.
- Use the existing test files (`src/tests/AddConstraints.test.js`, `src/tests/App.test.js`) as examples for writing new tests.
- Run all tests locally before submitting a pull request to ensure that they pass.
- Use Jest and React Testing Library for writing and running tests.
- Mock external dependencies and API calls to ensure tests are isolated and reliable.
- Aim for high test coverage, but prioritize testing critical and complex parts of the application.
- Regularly run tests during development to catch issues early.
