# School Admin Panel - Backend API

A comprehensive school management system built with NestJS, PostgreSQL, and TypeORM. This API provides role-based access control for administrators, teachers, and students.

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin, Teacher, Student)
- ✅ User management
- ✅ Class/Course management
- ✅ Attendance tracking
- ✅ Grade/Marks management
- ✅ Assignment management
- ✅ Notification system
- ✅ Swagger API documentation

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-admin-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=school_admin_db

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

PORT=3000
NODE_ENV=development
```

4. Create the PostgreSQL database:
```bash
createdb school_admin_db
```

Or using psql:
```sql
CREATE DATABASE school_admin_db;
```

5. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api/docs`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (Protected)

### User Management (Admin only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `GET /students/:id/classes` - Get student's classes
- `GET /students/:id/grades` - Get student's grades
- `GET /students/:id/attendance` - Get student's attendance

### Teachers
- `GET /teachers` - Get all teachers
- `GET /teachers/:id` - Get teacher by ID
- `GET /teachers/:id/classes` - Get teacher's classes

### Classes
- `GET /classes` - Get all classes
- `GET /classes/:id` - Get class by ID
- `POST /classes` - Create new class (Admin)
- `PUT /classes/:id` - Update class (Admin)
- `DELETE /classes/:id` - Delete class (Admin)
- `POST /classes/:id/enroll` - Enroll student in class

### Attendance
- `GET /attendance/class/:classId` - Get class attendance
- `POST /attendance` - Mark attendance (Teacher)
- `GET /attendance/student/:studentId` - Get student attendance

### Grades
- `GET /grades/student/:studentId` - Get student grades
- `POST /grades` - Create grade entry (Teacher)
- `PUT /grades/:id` - Update grade (Teacher)

### Assignments
- `GET /assignments` - Get all assignments
- `GET /assignments/:id` - Get assignment by ID
- `POST /assignments` - Create assignment (Teacher)
- `POST /assignments/:id/submit` - Submit assignment (Student)
- `PUT /assignments/submissions/:id/grade` - Grade submission (Teacher)

## User Roles

### Admin
- Full system access
- User management (CRUD)
- Class management
- View all reports and analytics

### Teacher
- Manage assigned classes
- Mark attendance
- Enter and update grades
- Create and grade assignments
- View student information

### Student
- View personal dashboard
- Check attendance records
- View grades
- Access and submit assignments

## Database Schema

The database includes the following main entities:
- Users (with roles: Admin, Teacher, Student)
- Admins
- Teachers
- Students
- Classes
- StudentClass (Enrollment)
- Attendance
- Assignments
- AssignmentSubmissions
- Grades
- Notifications

For detailed schema information, see [SCHOOL_ADMIN_PANEL.md](./SCHOOL_ADMIN_PANEL.md)

## Development

```bash
# Run in development mode with hot reload
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── decorators/      # Custom decorators (GetUser, Roles)
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards (JWT, Roles)
│   ├── strategies/      # Passport strategies
│   └── interfaces/      # TypeScript interfaces
├── common/              # Common utilities
│   └── enums/          # Enums (UserRole, AttendanceStatus, etc.)
├── entities/           # TypeORM entities
│   ├── user.entity.ts
│   ├── admin.entity.ts
│   ├── teacher.entity.ts
│   ├── student.entity.ts
│   ├── class.entity.ts
│   └── ...
└── modules/            # Feature modules (to be implemented)
    ├── users/
    ├── students/
    ├── teachers/
    ├── classes/
    ├── attendance/
    ├── grades/
    └── assignments/
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based access control with guards
- Input validation and sanitization
- SQL injection prevention (TypeORM)
- CORS enabled
- Environment variable configuration

## Next Steps

The following modules need to be implemented:
- [ ] User management module
- [ ] Student management module
- [ ] Teacher management module
- [ ] Class management module
- [ ] Attendance module
- [ ] Grades module
- [ ] Assignment module
- [ ] Notification module
- [ ] Dashboard module

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
