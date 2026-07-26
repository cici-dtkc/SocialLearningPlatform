# 🎓 Social Learning Platform

> **Nền tảng học tập xã hội** - Nơi sinh viên chia sẻ tiến trình học tập, tài nguyên và cộng tác với nhau.
## 📖 Giới thiệu

**Social Learning Platform** là một ứng dụng web hiện đại được xây dựng để hỗ trợ sinh viên:

- 📝 **Chia sẻ tiến trình học tập**: Đăng updates, notes và resources
- 💬 **Cộng tác với bạn bè**: Comment, like và thảo luận
- 👥 **Tham gia nhóm học**: Tạo và quản lý study groups
- 🔔 **Nhận thông báo**: Real-time notifications với Socket.IO
- 📊 **Theo dõi tiến độ**: Dashboard tracking personal learning journey



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
## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Socket.IO](https://socket.io/) - Real-time engine



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


