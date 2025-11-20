# School Admin Panel - MVP Documentation

## Project Overview
A comprehensive school management system with role-based access control for administrators, teachers, and students.

## User Roles

### 1. Admin
- Full system access and control
- User management (create, update, delete users)
- System configuration
- Reports and analytics

### 2. Teacher
- Manage assigned classes
- Mark attendance
- Enter and update grades
- View student information
- Upload assignments and materials

### 3. Student
- View personal dashboard
- Check attendance records
- View grades and progress
- Access assignments and materials
- Submit assignments

---

## MVP Features

### 1. Authentication & Authorization
- **Login System**
  - Email/username and password authentication
  - JWT-based session management
  - Role-based access control (RBAC)
  - Password reset functionality
  - Secure logout

### 2. User Management (Admin Only)
- **Admin Features:**
  - Create/Read/Update/Delete users
  - Assign roles (Admin, Teacher, Student)
  - Bulk user import (CSV)
  - User activation/deactivation
  - Password reset for users
  - Profile management

### 3. Student Management
- **Admin/Teacher Features:**
  - Student registration and profiles
  - Student personal information
  - Enrollment status
  - Class assignment
  - Parent/guardian contact information

- **Student Features:**
  - View personal profile
  - Update contact information (limited)
  - View enrolled classes

### 4. Teacher Management
- **Admin Features:**
  - Teacher registration and profiles
  - Subject/course assignment
  - Class assignment
  - Schedule management

- **Teacher Features:**
  - View personal profile
  - View assigned classes and students
  - Update availability

### 5. Class/Course Management
- **Admin Features:**
  - Create/Update/Delete classes
  - Assign teachers to classes
  - Enroll students in classes
  - Set class schedules
  - Academic year management

- **Teacher Features:**
  - View assigned classes
  - View class roster
  - Add class announcements

- **Student Features:**
  - View enrolled classes
  - View class schedules
  - View class announcements

### 6. Attendance Management
- **Teacher Features:**
  - Mark daily attendance
  - Edit attendance records
  - View attendance reports for classes

- **Admin Features:**
  - View attendance reports (all classes)
  - Generate attendance analytics

- **Student Features:**
  - View personal attendance record
  - Attendance percentage

### 7. Grade/Marks Management
- **Teacher Features:**
  - Enter marks for assignments/tests/exams
  - Update grades
  - Calculate final grades
  - Generate grade reports

- **Admin Features:**
  - View all grades
  - Generate comprehensive reports
  - Export grade data

- **Student Features:**
  - View personal grades
  - View grade history
  - Download report cards

### 8. Assignment Management
- **Teacher Features:**
  - Create assignments
  - Set deadlines
  - Upload assignment materials
  - View submitted assignments
  - Grade submissions

- **Student Features:**
  - View assignments
  - Download assignment materials
  - Submit assignments
  - View submission status and grades

### 9. Dashboard
- **Admin Dashboard:**
  - Total users (students, teachers)
  - Active classes
  - Recent activities
  - System analytics
  - Quick actions

- **Teacher Dashboard:**
  - Assigned classes
  - Today's schedule
  - Pending tasks (grading, attendance)
  - Recent announcements

- **Student Dashboard:**
  - Today's classes
  - Upcoming assignments
  - Recent grades
  - Attendance summary
  - Announcements

### 10. Notifications
- Email notifications for:
  - New assignments
  - Grade updates
  - Attendance alerts
  - System announcements
- In-app notification center

---

## Database Schema

### Users Table
```
- id (UUID, Primary Key)
- email (unique)
- username (unique)
- password (hashed)
- role (enum: ADMIN, TEACHER, STUDENT)
- firstName
- lastName
- phone
- avatar
- isActive
- createdAt
- updatedAt
```

### Admin Table
```
- id (UUID, Primary Key)
- userId (Foreign Key to Users)
- department
- position
```

### Teacher Table
```
- id (UUID, Primary Key)
- userId (Foreign Key to Users)
- employeeId (unique)
- department
- qualification
- subjects (array)
- joiningDate
```

### Student Table
```
- id (UUID, Primary Key)
- userId (Foreign Key to Users)
- studentId (unique)
- dateOfBirth
- parentName
- parentEmail
- parentPhone
- address
- enrollmentDate
- currentGrade
```

### Class Table
```
- id (UUID, Primary Key)
- className
- grade
- section
- teacherId (Foreign Key to Teacher)
- academicYear
- schedule
- maxStudents
- isActive
```

### StudentClass (Enrollment)
```
- id (UUID, Primary Key)
- studentId (Foreign Key to Student)
- classId (Foreign Key to Class)
- enrollmentDate
- status (enum: ACTIVE, COMPLETED, DROPPED)
```

### Attendance Table
```
- id (UUID, Primary Key)
- studentId (Foreign Key to Student)
- classId (Foreign Key to Class)
- date
- status (enum: PRESENT, ABSENT, LATE, EXCUSED)
- markedBy (Foreign Key to Teacher)
- remarks
```

### Assignment Table
```
- id (UUID, Primary Key)
- classId (Foreign Key to Class)
- teacherId (Foreign Key to Teacher)
- title
- description
- dueDate
- totalMarks
- attachments (array)
- createdAt
```

### AssignmentSubmission Table
```
- id (UUID, Primary Key)
- assignmentId (Foreign Key to Assignment)
- studentId (Foreign Key to Student)
- submissionDate
- attachments (array)
- marksObtained
- feedback
- status (enum: SUBMITTED, GRADED, LATE, PENDING)
```

### Grade Table
```
- id (UUID, Primary Key)
- studentId (Foreign Key to Student)
- classId (Foreign Key to Class)
- examType (enum: QUIZ, TEST, MIDTERM, FINAL, ASSIGNMENT)
- subject
- marksObtained
- totalMarks
- grade (A, B, C, D, F)
- semester
- academicYear
- gradedBy (Foreign Key to Teacher)
- remarks
```

### Notification Table
```
- id (UUID, Primary Key)
- userId (Foreign Key to Users)
- title
- message
- type (enum: ASSIGNMENT, GRADE, ATTENDANCE, ANNOUNCEMENT)
- isRead
- createdAt
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/profile
PUT    /api/auth/profile
```

### User Management (Admin)
```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
POST   /api/users/bulk-import
PATCH  /api/users/:id/activate
PATCH  /api/users/:id/deactivate
```

### Students
```
GET    /api/students
GET    /api/students/:id
POST   /api/students (Admin)
PUT    /api/students/:id
DELETE /api/students/:id (Admin)
GET    /api/students/:id/classes
GET    /api/students/:id/grades
GET    /api/students/:id/attendance
```

### Teachers
```
GET    /api/teachers
GET    /api/teachers/:id
POST   /api/teachers (Admin)
PUT    /api/teachers/:id
DELETE /api/teachers/:id (Admin)
GET    /api/teachers/:id/classes
```

### Classes
```
GET    /api/classes
GET    /api/classes/:id
POST   /api/classes (Admin)
PUT    /api/classes/:id (Admin)
DELETE /api/classes/:id (Admin)
POST   /api/classes/:id/enroll
DELETE /api/classes/:id/students/:studentId
GET    /api/classes/:id/students
```

### Attendance
```
GET    /api/attendance/class/:classId
POST   /api/attendance
PUT    /api/attendance/:id
GET    /api/attendance/student/:studentId
GET    /api/attendance/reports
```

### Grades
```
GET    /api/grades/student/:studentId
POST   /api/grades
PUT    /api/grades/:id
DELETE /api/grades/:id
GET    /api/grades/class/:classId
GET    /api/grades/reports
```

### Assignments
```
GET    /api/assignments
GET    /api/assignments/:id
POST   /api/assignments (Teacher)
PUT    /api/assignments/:id (Teacher)
DELETE /api/assignments/:id (Teacher)
GET    /api/assignments/class/:classId
POST   /api/assignments/:id/submit (Student)
GET    /api/assignments/:id/submissions (Teacher)
PUT    /api/assignments/submissions/:id/grade (Teacher)
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id
```

### Dashboard
```
GET    /api/dashboard/admin
GET    /api/dashboard/teacher
GET    /api/dashboard/student
```

---

## Technology Stack

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger

### Additional Libraries
- bcrypt (password hashing)
- multer (file uploads)
- nodemailer (email notifications)
- @nestjs/config (environment configuration)
- @nestjs/schedule (cron jobs)

---

## Security Features
1. Password hashing with bcrypt
2. JWT token authentication
3. Role-based access control (Guards)
4. Input validation and sanitization
5. SQL injection prevention (TypeORM)
6. Rate limiting
7. CORS configuration
8. Helmet (security headers)

---

## Future Enhancements (Post-MVP)
- Fee management
- Library management
- Exam scheduling
- Time table management
- Parent portal
- SMS notifications
- Video conferencing integration
- Mobile app
- Real-time chat
- Document management
- Transport management
- Cafeteria management
