# Fleet Core - Fleet Management Application

**Fleet Core** is a comprehensive fleet management application developed as part of my Bachelor's Thesis. It is designed to assist multinational organizations in managing their logistics by providing a centralized platform to oversee all aspects of their fleet.

## User Roles
The application supports two distinct user roles:
1. **Admin**: The logistics department manager with access to a wide range of functionalities, including vehicle and driver management, and route configuration.
2. **Driver**: The drivers responsible for transport operations.

## Functionalities

### 1. Authentication and Authorization
The application is designed to support multiple organizations in optimizing their logistics. Therefore, only organization admins can create accounts by providing their and their organization's details. The organization's admin exclusively creates driver accounts. Once their information is submitted, drivers receive an auto-generated password via email for login.

Technologies used:
- **Spring Security**: Secures REST endpoints by applying filters that block malicious requests, ensuring proper authentication and authorization.
- **JSON Web Tokens (JWT)**: Provides stateless, signed tokens that validate user identity while ensuring data integrity and security against various attacks.
- **BCrypt**: Hashes and salts user passwords to safeguard against brute force attacks and reversed hashing, enhancing security.
- **Angular AuthGuards**: Blocks unauthorized access and enforces role-based access control, ensuring secure, role-specific navigation within the application.

### 2. Managing Vehicles, Drivers, and Dashboard
Admins can oversee all crucial aspects of fleet management, including:
- **Vehicle Management**: Add vehicles with technical details and access statistics such as vehicle status, accidents, breakdowns, and completed routes. Receive maintenance alerts and schedule maintenance directly through the application.
- **Driver Management**: Create driver accounts and analyze performance through detailed statistics, offering insights into each driver's contribution.
- **Dashboard**: An interactive dashboard providing a thorough overview of the entire fleet.

### 3. Transport Routes Configuration
Admins can configure custom routes for upcoming transports using the Google Maps API:
- **Route Generation**: Select start and destination points to generate the optimal route using the Google Maps Directions API.
- **Rest Break Planning**: In compliance with European Directive 2022/2561, rest breaks are scheduled every 4.5 hours of driving.
- **Scheduling and Assignment**: Schedule the route and assign an available driver and vehicle.
- **Fuel Station Integration**: View and add fuel stations along the route, optimizing fuel costs.
- **Route Statistics Calculation**: Calculate total time, distance, and costs for the route.

After configuration, all route details are saved to the database, and users can view scheduled routes on a dedicated page.

### 4. Driver Functionalities
- **View Assigned Routes**: Drivers can access all routes assigned by the admin.
- **View Waypoints**: Drivers can see all waypoints, including rest breaks and fuel stations.
- **Start Route and Real-Time Tracking**: Drivers can start a route and share their location in real-time with the admin.
- **GPS Navigation**: Drivers can open the route in the Google Maps app for navigation.
- **Alert Notifications**: Notify the admin of alerts and additional costs incurred.
- **Route Completion Notification**: Notify the admin once the route is completed.

### 5. Real-time Communication using WebSockets
Real-time communication between the admin and driver ensures seamless coordination:
- **Real-time Location Tracking**: Admins can track the driver’s location on the map in real-time.
- **Route Alert Notifications**: Admins receive real-time alerts and updates on alert resolutions.
- **Route Status Updates**: The admin interface updates in real-time to reflect changes in route status.

### 6. Ops and Deployment
The application is developed using Spring Boot for the backend and Angular for the frontend. The deployment workflow includes:
- **Docker Containers**: Separate Docker containers for the backend (Maven image) and frontend (Node.js image).
- **Docker Registry**: Images are pushed to a private Docker registry on Docker Hub.
- **Azure Deployment**: The application is deployed on Azure using two Azure App Services and a MySQL Server for backend communication.
- **GitHub Workflows**: Automated CI/CD pipeline using GitHub Actions to trigger build and deployment processes on every commit to the main branch.
This setup ensures a robust, scalable, and automated deployment pipeline, enabling seamless updates and efficient management of the application infrastructure.

## Interfaces

### 1. Authentication Page
![image](https://github.com/AndreiMachidon/Bachelor_Thesis_Fleet_Management_App/assets/97346052/1c348e72-3588-4f97-be80-09f72360bfd9)

### 2. Dashboard
![image](https://github.com/AndreiMachidon/Bachelor_Thesis_Fleet_Management_App/assets/97346052/7ca2a59f-4c1e-4886-ac61-5d22dcf4c7d1)

### 3. Vehicle Management Page
![image](https://github.com/AndreiMachidon/Bachelor_Thesis_Fleet_Management_App/assets/97346052/2b3f0701-8040-4bfb-8098-4fcb60109646)

### 4. Route configuration Page
![image](https://github.com/AndreiMachidon/Bachelor_Thesis_Fleet_Management_App/assets/97346052/e7e74925-be74-46f5-94bc-2c0443f71f90)

### 5. Route statuses page
![image](https://github.com/AndreiMachidon/Bachelor_Thesis_Fleet_Management_App/assets/97346052/77bab772-4381-4eda-a6b3-b340e831138f)

### 6. Driver Functionalities
![image](https://github.com/AndreiMachidon/Bachelor_Thesis_Fleet_Management_App/assets/97346052/64340ffe-68da-4067-ae57-6a095cd9aec5)

