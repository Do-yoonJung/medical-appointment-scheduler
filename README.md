# Medical Appointment Scheduler

## Project Overview
The Medical Appointment Scheduler is a web-based application for managing medical appointments. The system supports two user roles: Patient and Receptionist.

Patients can register, log in, book appointments, and manage their own appointments. Receptionists can log in and manage appointments for patients.

## Setup

### Requirements
- Node.js
- MongoDB Atlas
- npm

### Installation
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file with the required environment variables.
4. Run `npm start`.
5. Open `http://localhost:3000` in a web browser.

Example `.env` structure:

MONGODB_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-session-secret>

## Architecture
The application uses a simple client-server architecture.

- Frontend: HTML, CSS and JavaScript
- Backend: Node.js and Express
- Database: MongoDB Atlas with Mongoose
- Authentication: express-session and bcrypt
- User roles: Patient and Receptionist
- Main services: Authentication Service and Appointment Service

The Patient and Receptionist interfaces communicate with the backend services, while persistent user and appointment data is stored in MongoDB.

## Known Limitations
- Doctor accounts and doctor-specific authentication are not implemented.
- Email and SMS appointment notifications are not supported.
- Online payment functionality is not included.
- Receptionist accounts cannot be created through public registration.
- The application is an assessment prototype and is not intended for production use.

## Deployment
The application is deployed on AWS EC2 and runs using PM2.

Deployment URL: http://3.27.181.4:3000