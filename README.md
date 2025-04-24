# Training Management System - Server

This is the backend server for the Training Management System, built with Node.js, Express, TypeScript, and TypeORM.

## Features

- User authentication and authorization
- Delegate management
- Training session management
- Attendance tracking
- Banquet seating management
- QR code generation for delegates

## Tech Stack

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Build the project:
   ```bash
   npm run build
   ```

## Development

To run the server in development mode with hot reloading:

```bash
npm run dev
```

## Database Migrations

To run database migrations:

```bash
npm run prisma:migrate
```

## Seeding Data

To seed the database with initial data:

```bash
npm run seed
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/current-user` - Get current user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Delegates

- `GET /api/delegates` - Get all delegates
- `GET /api/delegates/:id` - Get delegate by ID
- `POST /api/delegates` - Create new delegate
- `PUT /api/delegates/:id` - Update delegate
- `DELETE /api/delegates/:id` - Delete delegate
- `POST /api/delegates/:id/trainings` - Assign trainings to delegate
- `POST /api/delegates/:id/banquet-seating` - Assign banquet seating

### Trainings

- `GET /api/trainings` - Get all trainings
- `GET /api/trainings/:id` - Get training by ID
- `POST /api/trainings` - Create new training
- `PUT /api/trainings/:id` - Update training
- `DELETE /api/trainings/:id` - Delete training

### Attendance

- `GET /api/attendance/training/:trainingId` - Get attendance for a training
- `GET /api/attendance/user/:userId` - Get attendance for a user
- `POST /api/attendance/check-in/:trainingId` - Check in for a training
- `GET /api/attendance/stats/:trainingId` - Get attendance statistics

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── entities/       # TypeORM entities
├── middleware/     # Custom middleware
├── routes/         # API routes
├── seed/          # Database seed files
└── index.ts       # Application entry point
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
