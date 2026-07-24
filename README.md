# 🎓 Social Learning Platform

> **Nền tảng học tập xã hội** - Nơi sinh viên chia sẻ tiến trình học tập, tài nguyên và cộng tác với nhau.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Giới thiệu

**Social Learning Platform** là một ứng dụng web hiện đại được xây dựng để hỗ trợ sinh viên:

- 📝 **Chia sẻ tiến trình học tập**: Đăng updates, notes và resources
- 💬 **Cộng tác với bạn bè**: Comment, like và thảo luận
- 👥 **Tham gia nhóm học**: Tạo và quản lý study groups
- 🔔 **Nhận thông báo**: Real-time notifications với Socket.IO
- 📊 **Theo dõi tiến độ**: Dashboard tracking personal learning journey

---

## ✨ Features

### ✅ Đã hoàn thành (v1.0)

- [x] **Authentication System**
  - Đăng ký với username, email, password
  - Đăng nhập với email hoặc username
  - JWT-based authentication
  - Password hashing với bcrypt
  - Token persistence trong localStorage + httpOnly cookies
  - Protected routes middleware
  - Auto-load user session on app start
  - Password strength indicator
  - Show/hide password toggle

- [x] **Modern UI/UX**
  - Dark theme với gradient backgrounds
  - Glass morphism effects
  - Responsive design (mobile-first)
  - Form validation với react-hook-form
  - Toast notifications
  - Loading states và error handling
  - Tailwind CSS styling

### 🚧 Đang phát triển (v1.1)

- [ ] User Profile Management
- [ ] Posts CRUD (Create, Read, Update, Delete)
- [ ] Comments system
- [ ] Like/React functionality
- [ ] Image upload với Cloudinary
- [ ] Private routes với role-based access

### 📋 Kế hoạch tương lai (v2.0+)

- [ ] Study Groups & Communities
- [ ] Real-time chat với Socket.IO
- [ ] Notification system
- [ ] Password reset via email
- [ ] Email verification
- [ ] OAuth integration (Google, GitHub)
- [ ] Advanced search & filtering
- [ ] User mentions (@username)
- [ ] Hashtags support (#topic)
- [ ] File attachments (PDF, docs)
- [ ] Admin dashboard
- [ ] Analytics & insights
- [ ] Mobile app (React Native)

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator
- **File Upload**: Multer + Cloudinary
- **Real-time**: Socket.IO
- **HTTP Logger**: Morgan
- **CORS**: cors middleware

### Frontend
- **Framework**: React v19
- **Bundler**: Vite v7
- **State Management**: Redux Toolkit v2
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios v1
- **Form Handling**: React Hook Form v7
- **Validation**: Zod v4
- **Styling**: Tailwind CSS v3
- **Icons**: React Icons v5
- **Notifications**: React Hot Toast v2
- **Real-time**: Socket.IO Client v4

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Environment**: dotenv

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB v7.0+
- npm hoặc yarn

### Installation & Setup

```bash
# 1. Clone repository
git clone https://github.com/yourusername/SocialLearningPlatform.git
cd SocialLearningPlatform

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Chỉnh sửa .env với thông tin của bạn

# 3. Setup Frontend
cd ../frontend
npm install
cp .env.example .env
# Chỉnh sửa .env với thông tin của bạn

# 4. Start MongoDB (Docker)
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=123456 \
  mongo:latest

# 5. Start Backend (terminal 1)
cd backend
npm run dev

# 6. Start Frontend (terminal 2)
cd frontend
npm run dev
```

📚 **Chi tiết**: Xem [START.md](START.md) để có hướng dẫn từng bước chi tiết.

---

## 📂 Project Structure

```
SocialLearningPlatform/
│
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Configuration files (DB, JWT, Cloudinary)
│   │   ├── middlewares/       # Express middlewares (auth, error, upload)
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication (register, login, logout)
│   │   │   ├── user/          # User management (profile, avatar)
│   │   │   ├── post/          # Posts module
│   │   │   ├── comment/       # Comments module
│   │   │   └── ...
│   │   ├── routes/            # Route aggregation
│   │   ├── utils/             # Utility functions
│   │   ├── app.js             # Express app configuration
│   │   └── server.js          # Server entry point
│   ├── .env                   # Environment variables
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Frontend React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/            # Images, icons, fonts
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Common UI components
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/            # UI primitives
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Auth pages + Redux slice
│   │   │   ├── post/          # Post components
│   │   │   ├── user/          # User profile
│   │   │   └── ...
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── routes/            # Route configuration & guards
│   │   ├── services/          # API service clients
│   │   ├── store/             # Redux store configuration
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env                   # Environment variables
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf             # Nginx config for production
│   └── package.json
│
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
│       ├── ci.yml             # Continuous Integration
│       └── cd.yml             # Continuous Deployment
│
├── docker-compose.yml         # Docker Compose configuration
├── .gitignore
├── AUTH_GUIDE.md              # Authentication system documentation
├── START.md                   # Detailed setup guide
└── README.md                  # This file
```

---

## 🔐 Authentication Flow

### Registration
1. User nhập `username`, `email`, `password`, `fullName` (optional)
2. Frontend validate input với `react-hook-form`
3. Backend validate với `express-validator`
4. Kiểm tra username/email đã tồn tại
5. Hash password với `bcrypt` (10 rounds)
6. Lưu user vào MongoDB
7. Redirect đến `/login`

### Login
1. User nhập `identifier` (email hoặc username) + `password`
2. Backend tìm user theo email OR username
3. Verify password với `bcrypt.compare()`
4. Generate JWT token (expires 7d)
5. Set token trong httpOnly cookie + response body
6. Frontend lưu token vào `localStorage`
7. Load user data và update Redux state
8. Redirect đến homepage

### Session Management
- Token được lưu trong `localStorage` (key: `slp_token`)
- Axios interceptor tự động thêm `Authorization: Bearer <token>` vào mỗi request
- Protected routes check token validity và user existence
- App tự động load user khi khởi động nếu có valid token

📚 **Chi tiết**: Xem [AUTH_GUIDE.md](AUTH_GUIDE.md)

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/logout` | Logout | ✅ |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get current user | ✅ |
| PUT | `/users/me` | Update profile | ✅ |
| PUT | `/users/avatar` | Upload avatar | ✅ |

### Posts (`/api/posts`) - Coming Soon

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/posts` | Get all posts | ❌ |
| GET | `/posts/:id` | Get post by ID | ❌ |
| POST | `/posts` | Create post | ✅ |
| PUT | `/posts/:id` | Update post | ✅ |
| DELETE | `/posts/:id` | Delete post | ✅ |

📄 **Full API docs**: Xem [test-auth.http](test-auth.http) để test API với REST Client

---

## 🎨 UI Screenshots

### Login Page
![Login](docs/screenshots/login.png)

### Register Page
![Register](docs/screenshots/register.png)

### Home Page
![Home](docs/screenshots/home.png)

---

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### E2E Testing

```bash
npm run test:e2e
```

### API Testing với REST Client

1. Cài extension **REST Client** trong VS Code
2. Mở file `test-auth.http`
3. Click "Send Request" để test API endpoints

---

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  fullName: String,
  avatar: String (URL),
  role: Enum ['student', 'mentor', 'admin'],
  createdAt: Date,
  updatedAt: Date
}
```

### Post Collection (Coming Soon)

```javascript
{
  _id: ObjectId,
  author: ObjectId (ref: User),
  content: String,
  images: [String],
  likes: [ObjectId] (ref: User),
  commentCount: Number,
  visibility: Enum ['public', 'friends', 'private'],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Environment Variables

### Backend `.env`

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://admin:123456@localhost:27017/social_learning?authSource=admin

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env`

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Coding Standards

- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test before committing

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Your Name
- **Mentor**: Kiro AI Assistant 🤖
- **Contributors**: [View Contributors](https://github.com/yourusername/SocialLearningPlatform/graphs/contributors)

---

## 📞 Support & Contact

- 📧 Email: support@sociallearningplatform.com
- 💬 Discord: [Join our community](https://discord.gg/yourserver)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/SocialLearningPlatform/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/SocialLearningPlatform/wiki)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Socket.IO](https://socket.io/) - Real-time engine

---

## 📈 Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Project setup
- [x] Authentication system
- [x] Basic UI/UX

### Phase 2: Core Features (🚧 In Progress)
- [ ] User profiles
- [ ] Posts CRUD
- [ ] Comments
- [ ] Likes/Reactions

### Phase 3: Social Features
- [ ] Study groups
- [ ] Real-time chat
- [ ] Notifications
- [ ] File sharing

### Phase 4: Advanced Features
- [ ] Search & filters
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] AI recommendations

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Your Name] & Kiro AI

[⬆ Back to top](#-social-learning-platform)

</div>
