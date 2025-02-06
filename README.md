# Authentication Template

## Overview
This is a template for authentication, featuring session storage, protected routes, and Passport.js integration.

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Passport.js with session-based authentication

## Features
- User authentication with session handling
- Protected routes for authorized users only
- Secure password management
- MongoDB integration

## Installation and Setup

### 1. Clone the Repository
```sh
git clone <repository-url>
cd authentication-template
```

### 2. Install Dependencies
```sh
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Configuration
Create a `.env` file in the server directory and update the MongoDB connection string:
```env
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

### 4. Run the Application
#### Start the Server
```sh
cd server
npm start
```

#### Start the Client
```sh
cd client
npm run dev
```

## Usage
- Users can sign up and log in securely.
- Protected routes require authentication.
- Sessions persist across page reloads.

## License
This project is licensed under the MIT License.

