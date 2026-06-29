<div align="center">

# DevTinder

### *Swipe. Connect. Code Together.*

> **Tinder — but for Developers.** Find your perfect coding partner, mentor, or tech buddy.

[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

```
[Developer]  ======  Swipe Right  ======  [Developer]
              Connect. Mentor. Grow.
```

</div>

---

## What is DevTinder?

DevTinder is a developer-first social networking platform that brings the magic of matchmaking to the tech world. Whether you are a junior developer looking for a mentor, a senior engineer wanting to give back, or simply looking for a like-minded peer to collaborate on side projects, DevTinder bridges the gap.

No more cold LinkedIn messages. No more awkward emails. Just swipe, match, and collaborate.

---

## Vision & Learning Goals

DevTinder was conceived with two primary objectives in mind:
1. **Mastering Production-Grade Backend Development**: Designed as a deep dive into scalable backend architecture using Node.js, Express, and MongoDB. It implements robust authentication, database schema design, and secure API endpoints.
2. **Fostering Developer Communities**: Connecting developers in a distraction-free space. DevTinder helps juniors find mentors, enables seniors to guide the next generation, and saves busy developers time by matching them directly with others who share their goals and tech stack.

---

## Key Features

| Feature | Description |
|---|---|
| **Developer Profiles** | Showcase your skills, tech stack, experience level, and professional goals. |
| **Swipe Matching** | Swipe right to connect, left to pass. Simple, intuitive networking. |
| **Real-time Chat** | Engage with your matches instantly to collaborate or schedule code sessions. |
| **Mentor-Mentee Mode** | Align connections based on experience level to foster teaching and learning. |
| **Smart Filtering** | Find relevant developers based on programming language, frameworks, and availability. |
| **Connection Feed** | Explore a curated stream of developers in your local area or globally. |

---

## Why DevTinder?

```
"Every great developer started as a beginner. 
 All they needed was the right connection."
```

* **Targeted Networking**: Avoid the noise of generic social media networks. DevTinder is built exclusively for code.
* **Empowering Junior Developers**: Skip the hierarchy and find experienced mentors who have walked the path before you.
* **Enabling Senior Contributions**: Give back to the open-source community by shaping the next generation of builders.
* **Efficiency**: Designed for busy professionals who want to establish meaningful connections fast.

---

## Tech Stack

### Backend
```
Node.js  |  Express.js  |  MongoDB  |  Mongoose  |  JWT Authentication  |  Socket.io
```

### Frontend
```
React.js  |  React Router  |  Redux / Context API  |  Tailwind CSS / CSS Modules
```

### Tools & DevOps
```
Git  |  GitHub  |  Postman  |  VS Code  |  npm
```

---

## Project Structure

```
DevTinder/
│
├── backend/
│   ├── config/          # Database and environment configurations
│   ├── controllers/     # Route handlers and business logic
│   ├── models/          # Mongoose schemas (User, ConnectionRequest, Message)
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # Authentication and global error handling
│   └── server.js        # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application screens (Login, Feed, Chat, Profile)
│   │   ├── hooks/       # Custom React hooks
│   │   └── App.jsx
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (local community server or MongoDB Atlas)
* [Git](https://git-scm.com/)

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/your-username/DevTinder.git
cd DevTinder
```

**2. Configure the Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server in development mode:
```bash
npm run dev
```

**3. Configure the Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

**4. Run the Application**
Open your browser and navigate to the local development server (typically `http://localhost:5173`).

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new developer profile |
| `POST` | `/api/auth/login` | Authenticate user and receive a secure token |
| `POST` | `/api/auth/logout` | Terminate session and clear credentials |

### User Profile & Feed
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/profile` | Retrieve the authenticated user's profile |
| `PATCH` | `/api/user/profile` | Update profile information and skills |
| `GET` | `/api/feed` | Fetch the feed of swipeable developer profiles |

### Connections & Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/request/send/:status/:userId` | Send connection request (interested or ignored) |
| `POST` | `/api/request/review/:status/:requestId` | Review incoming request (accepted or rejected) |
| `GET` | `/api/connections` | Retrieve all active connections |

---

## Key Learning Outcomes

Building DevTinder provides a hands-on experience with full-stack development, specifically:
* Designing structured REST APIs with Express.js.
* Securing routes and managing state with JWT and cookie-based authentication.
* Modelling database schemas with Mongoose and optimizing queries.
* Implementing modular middleware for authentication gates and centralized error handling.
* Structuring interactive frontend client architectures using React.
* Synchronizing client-side global state with server data.

---

## Contributing

Contributions are welcome. Please follow the standard branching and pull request workflow:

```bash
# Fork the repository, then clone and create a new branch:
git checkout -b feature/your-feature-name

# Commit your changes with descriptive messages:
git commit -m "Add: your feature description"

# Push your changes:
git push origin feature/your-feature-name

# Open a Pull Request on the main repository.
```

---

## Development Roadmap

* [x] User authentication & developer profiles
* [x] Swipe feed interface with card matchmaking
* [x] Secure connection request system
* [ ] Real-time messaging using Socket.io
* [ ] Push notifications for new matches and messages
* [ ] Location-based profile filtering
* [ ] Mobile application using React Native
* [ ] Intelligent recommendation engine using machine learning

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Developed by developers, for developers.**

*If DevTinder inspired you or helped you learn, consider starring the repository.*

</div>
