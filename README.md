<div align="center">

# 💻 DevTinder

### *Swipe. Connect. Code Together.*

> **Tinder — but for Developers.** Find your perfect coding partner, mentor, or tech buddy.

[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

```
👨‍💻  ──────  swipe right  ──────  👩‍💻
      Connect. Mentor. Grow.
```

</div>

---

##  What is DevTinder?

**DevTinder** is a developer-first social networking platform that brings the magic of matchmaking to the tech world. Whether you're a junior developer looking for a mentor, a senior engineer wanting to give back, or just someone looking for a like-minded coding buddy — DevTinder is your place.

No more cold LinkedIn messages. No more awkward cold emails. Just **swipe, match, and collaborate.**

---

##  Key Features

| Feature | Description |
|---|---|
| 👤 **Developer Profiles** | Showcase your skills, tech stack, experience, and goals |
| 🔥 **Swipe Matching** | Swipe right to connect, left to pass — just like Tinder |
| 💬 **Real-time Chat** | Message your matches and discuss ideas instantly |
| 🎓 **Mentor–Mentee Mode** | Senior devs can offer guidance; juniors can seek it |
| 🔍 **Smart Filtering** | Filter by tech stack, experience level, availability, and more |
| 🤝 **Connection Feed** | Browse and explore the developer community |

---

## 🎯 Why DevTinder?

```
"Every great developer started as a junior once.
 All they needed was the right connection."
```

-   **For Junior Devs** — Find experienced mentors who've walked the path before you
-   **For Senior Devs** — Give back to the community; shape the next generation
-   **For All Devs** — Build your network without the noise of generic social platforms
-   **Saves Time** — Built for busy developers who want meaningful connections fast

---

##  Tech Stack

### 🔙 Backend
```
Node.js  ─  Express.js  ─  MongoDB  ─  Mongoose  ─  JWT Auth  ─  Socket.io
```

### 🖥️ Frontend
```
React.js  ─  React Router  ─  Redux / Context API  ─  Tailwind CSS / CSS Modules
```

### 🛠️ Tools & DevOps
```
Git  ─  GitHub  ─  Postman  ─  VS Code  ─  npm
```

---

## 📂 Project Structure

```
DevTinder/
│
├── 📁 backend/
│   ├── 📁 config/          # Database & environment config
│   ├── 📁 controllers/     # Route logic & business rules
│   ├── 📁 models/          # Mongoose schemas (User, Match, Message)
│   ├── 📁 routes/          # API endpoints
│   ├── 📁 middleware/       # Auth, error handling
│   └── server.js           # Entry point
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable React components
│   │   ├── 📁 pages/       # App screens (Login, Feed, Chat, Profile)
│   │   ├── 📁 hooks/       # Custom React hooks
│   │   └── App.jsx
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### ⚙️ Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/DevTinder.git
cd DevTinder
```

**2. Setup the Backend**
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Start the backend server:
```bash
npm run dev
```

**3. Setup the Frontend**
```bash
cd ../frontend
npm install
npm start
```

**4. Open in Browser**
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new developer |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `POST` | `/api/auth/logout` | Logout user |

### User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/profile` | Get logged-in user's profile |
| `PATCH` | `/api/user/profile` | Update profile details |
| `GET` | `/api/feed` | Get developer feed (swipeable) |

### Connection Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/request/send/:status/:userId` | Send interested / ignored |
| `POST` | `/api/request/review/:status/:requestId` | Accept or reject request |
| `GET` | `/api/connections` | View all connections |

---

## 🧠 Learning Outcomes

This project was built as a deep-dive into **real-world backend development**:

- ✅ REST API design with Express.js
- ✅ Authentication with JWT & bcrypt
- ✅ MongoDB schema design with Mongoose
- ✅ Middleware patterns (auth guards, error handlers)
- ✅ React component architecture
- ✅ State management in real applications
- ✅ Connecting frontend to backend via APIs

---

## 🤝 Contributing

Contributions are welcome and appreciated! 🙌

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
# Open a Pull Request 🎉
```

---

## 🛣️ Roadmap

- [x] User authentication & profiles
- [x] Developer feed with swipe functionality
- [x] Connection request system
- [ ] 💬 Real-time chat with Socket.io
- [ ] 🔔 Push notifications
- [ ] 🌍 Location-based matching
- [ ] 📱 Mobile app (React Native)
- [ ] 🤖 AI-powered developer recommendations

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and share.

---

<div align="center">



# TARGET
TO CREATE A PLATFORM WHICH HELPS ME IN GAINING KNOWLEDGE OF BACKEND 
It should also enhance my backend code knowledge.

# BENEFITS 
1.Teaches real world applicaton of backend development by Node.js.
2.Mainly focused on connecting developers so it acts as the platform for the developers to connect wth their fellow developers and share their experience and learnings.
It saves time for busy develpers.
3.Support junior developers to make connection with senior developer.

**Made with ❤️ by a developer, for developers.**

*If DevTinder helped you in any way, drop a ⭐ on the repo — it means the world!*


</div>


