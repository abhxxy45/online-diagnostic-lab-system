
-- MySQL Database Schema for Online Diagnostic Lab Reporting System

CREATE DATABASE IF NOT EXISTS diagnostic_lab_system;
USE diagnostic_lab_system;

-- 1. Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'PATIENT', 'LAB_STAFF') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Profile table
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Lab Staff Profile table
CREATE TABLE lab_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(100),
    employee_id VARCHAR(50) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Appointments table
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_status ENUM('BOOKED', 'PAID', 'SAMPLED', 'PROCESSING', 'READY', 'CANCELLED') DEFAULT 'BOOKED',
    payment_status ENUM('UNPAID', 'PAID') DEFAULT 'UNPAID',
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- 5. Payments & Transactions table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('UPI', 'CARD', 'CASH'),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- 6. Test Reports table
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    report_data JSON, -- Stores key-value results
    ai_insights TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    technician_id INT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (technician_id) REFERENCES users(id)
);

-- Mock Data Injection
INSERT INTO users (name, email, password, role) VALUES 
('System Administrator', 'admin@example.com', 'admin123', 'ADMIN'),
('Alice Smith', 'patient@example.com', 'patient123', 'PATIENT'),
('Dr. Bob Wilson', 'lab@example.com', 'staff123', 'LAB_STAFF');
