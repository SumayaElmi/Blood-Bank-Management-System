
https://github.com/omarlibaax/Blood-Bank-Management-System.git
# 🩸 Blood Bank Management System

## Project Overview
The Blood Bank Management System is a full-stack web application developed to improve the management of blood bank operations. The system provides an efficient and secure way to manage blood donors, blood donations, blood inventory, hospital requests, appointments, users, and reports.

The project was developed using Spring Boot for the backend and ReactJS for the frontend as part of the Full-Stack Group Project.


## Project Objectives
The main objectives of this project are:
* Manage blood donor information.
* Record blood donations.
* Maintain blood inventory.
* Process blood requests from hospitals.
* Schedule donor appointments.
* Generate reports.
* Implement secure authentication using JWT.
* Control access using role-based permissions.


## Technology Stack

### Backend
* Java 17
* Spring Boot 3.x
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* Maven

### Frontend
* ReactJS 18
* React Router DOM
* Axios
* CSS

### Database
* PostgreSQL

---

## System Features

* **Authentication:** Secure Login, JWT Authentication, Role-Based Authorization
* **Donor Management:** Add Donor, Update Donor, Delete Donor, Search Donor
* **Donation Management:** Record Blood Donation, Donation History
* **Blood Inventory:** Add Blood Stock, Update Blood Stock, Track Available Blood
* **Hospital Management:** Register Hospitals, Update Hospital Information
* **Blood Request Management:** Create Blood Request, Approve Blood Request, Reject Blood Request
* **Appointment Management:** Schedule Appointment, Update Appointment, Cancel Appointment
* **Reports:** Donation Report, Inventory Report, Blood Request Report, Hospital Report
* **User Management:** Add User, Edit User, Delete User, Assign Roles


## User Roles
The system supports four different user roles:

1. **Administrator**
   * Full system access (User Management, Reports, Inventory, Donors, Donations, Requests, Appointments)
2. **Staff**
   * Access: Dashboard, Donors, Blood Requests, Hospital Report, Request Report, Appointments
3. **Doctor**
   * Access: Dashboard, Blood Inventory, Blood Requests, Inventory Report, Hospital Report, Request Report
4. **Lab Technician**
   * Access: Dashboard, Donors, Donation History, Blood Inventory, Appointments


## Project Structure

```text
Blood-Bank-Management-System/
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── security/
│   ├── config/
│   └── resources/
└── frontend/
    ├── components/
    ├── pages/
    ├── services/
    ├── context/
    ├── assets/
    └── styles/


## Database Setup

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE blood_bank_db;
   ```

2. Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/blood_bank_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   server.port=8080
   ```

---

## Backend Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Open Backend Folder:
   ```bash
   cd backend
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
* **Backend URL:** `http://localhost:8080`

---

## Frontend Installation

1. Open Frontend Folder:
   ```bash
   cd frontend
   ```
2. Install Dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm run dev
   ```
* **Frontend URL:** `http://localhost:5173`


## Default Login Accounts

| Username | Password | Role |
| :--- | :--- | :--- |
| `admin` | `admin` | Administrator |
| `staff` | `staff` | Staff |
| `doctor123` | `doctor123` | Doctor |
| `labtechnicion123` | `labtechnicion123` | Lab Technician |


## API Overview

* **Authentication:** `POST /api/auth/signin`
* **Donors:** `GET /api/donors`, `POST /api/donors`, `PUT /api/donors/{id}`, `DELETE /api/donors/{id}`
* **Donations:** `GET /api/donations`, `POST /api/donations`
* **Inventory:** `GET /api/inventory`
* **Requests:** `GET /api/requests`, `POST /api/requests`
* **Appointments:** `GET /api/appointments`, `POST /api/appointments`
* **Reports:** `GET /api/reports/*`

## Future Improvements
* Email Notification
* SMS Notification
* Blood Donation Reminder
* Dashboard Analytics
* Export Reports to PDF
* Barcode Support
* QR Code Support



## Team Members
* Omar – Team Leader
* Sumaya
* Abdifitah
* Arwaax

## License
This project was developed for educational purposes as a Full-Stack Group Project at Jamhuriya University of Science and Technology.