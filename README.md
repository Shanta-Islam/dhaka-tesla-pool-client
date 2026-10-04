# Dhaka Tesla Pool 🚗⚡

A full-stack ride-pooling platform that allows passengers to share rides, split fares, and join available pools in Dhaka.

## 🚀 Live Project

* **Frontend:** (https://dhaka-tesla-pool-client-rouge.vercel.app/)

## ✨ Features

### Passenger

* User registration and login
* JWT-based authentication
* Create ride requests
* View available ride pools
* Join an available pool
* Select required seats
* View active ride status
* Track ride progress
* Automatic ride status updates
* Ride history

### Driver

* Driver registration and login
* Add and manage vehicles
* Create a ride pool
* Set pool capacity
* View passengers in the pool
* Update ride status
* Driver Arrived → Start Ride → Complete Ride
* Manage active pool

### Pool Management

* Real-time available seat calculation
* Maximum pool capacity validation
* Prevent duplicate pool membership
* Pickup and drop-off distance validation
* Automatic pool status updates
* Fare sharing between passengers
* Pool completion handling

## 🛠️ Technologies

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Hook Form
* TanStack Query
* Axios
* SweetAlert2
* React Router

### Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* bcryptjs
* Zod
