![Banner](apps/sketchidraw/public/images/Banner.png?raw=true "Sketchidraw app")

<div align="center">
  <h2>
    An open source virtual hand-drawn style whiteboard. </br>
    Collaborative and end-to-end encrypted. </br>
  <br />
  </h2>
</div>

### Demo Video

<video controls>
  <source src="https://github.com/markande98/sketchidraw/releases/download/video/sketchidraw-demo.mp4" type="video/mp4">
</video>

## 🎯 About

**SketchIDraw** is a powerful, free collaborative whiteboard that brings the charm of hand-drawn sketches to digital collaboration. Built with modern web technologies, it offers real-time collaboration with end-to-end encryption, making it perfect for brainstorming, design thinking, and visual communication.

### ✨ Why SketchIDraw?

- 🎨 **Hand-drawn aesthetics** - Beautiful, organic-looking shapes and lines
- 🔒 **Secure collaboration** - End-to-end encrypted real-time collaboration
- ⚡ **Lightning fast** - Optimized canvas engine with smooth performance
- 🌐 **Free forever** - Open source and completely free to use
- 🎯 **Feature-rich** - Everything you need for visual collaboration

---

## 🚀 Features

<div align="center">

| 🎨 **Drawing & Shapes** |   🔧 **Tools & Controls**    |     🌟 **Collaboration**     |
| :---------------------: | :--------------------------: | :--------------------------: |
|      Rectangle ▫️       | Instant property updates ⚡  | Real-time cursor tracking 🖱️ |
|       Ellipse ⭕        | Shape resizing & dragging 🔄 |   End-to-end encryption 🔒   |
|       Diamond 🔷        |       Text editing ✏️        |   Secure authentication 🔑   |
|   Lines & Arrows ➖➡️   |        Pencil tool 🖊️        |    Multi-user support 👥     |

</div>

### 🎨 **Drawing Tools**

- **Shape Rendering**: Create perfect rectangles, ellipses, diamonds, lines, and arrows
- **Pencil Tool**: Free-hand drawing with smooth curves
- **Text Tool**: Add, edit, resize, and move text elements
- **Smart Controls**: Instant property updates for all elements

### ⚡ **Canvas Experience**

- **Infinite Canvas**: Pan seamlessly across unlimited workspace
- **Zoom Support**: Programmatic and pinch gesture zooming
- **Smooth Performance**: Butter-smooth interactions with optimized rendering
- **Shape Manipulation**: Easy resizing, dragging, and deleting

### 🌟 **User Experience**

- **Light/Dark Mode**: Beautiful themes powered by next-themes
- **Local Storage Sync**: Never lose your work
- **Type-safe**: Built with TypeScript for reliability
- **Responsive Design**: Works perfectly on all devices

### 🔒 **Security & Collaboration**

- **End-to-end Encryption**: Your data stays private
- **Real-time Collaboration**: See changes instantly
- **Secure Authentication**: Powered by NextAuth.js
- **Postgres Database**: Reliable data persistence

---

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

**Frontend:**

- ⚛️ **Next.js** - React framework with SSR
- 🎯 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS** - Utility-first styling
- 🌍 **Zustand** - Global state management
- 🌗 **next-themes** - Theme management

**Backend:**

- 🔑 **NextAuth.js** - Authentication
- 🗄️ **PostgreSQL** - Database
- 🔒 **End-to-end encryption** - Secure collaboration

**Canvas Engine:**

- 🧑‍💻 **Custom OOP Architecture** - Modular and maintainable
- ⚡ **Optimized Rendering** - Smooth 60fps performance
- 📱 **Touch Support** - Mobile-friendly interactions

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Docker** and **Docker Compose**
- **Git**

### 📦 Quick Start with Docker

1. **Clone the repository**

```bash
  git clone https://github.com/markande98/sketchidraw.git
  cd sketchidraw
```

2. **Set up environment variables for the main app**

```bash
  cd apps/sketchidraw
  cp .env.example .env
  cd ../..
```

3. **Set up environment variables for the WebSocket server**

```bash
  cd apps/ws
  cp .env.example .env
  cd ../..
```

4. **Start the application**

```bash
docker compose up -d
```

5. **Open your browser Navigate to http://localhost:3000 and start sketching! 🎨**

#### Note: Make sure to update the .env files in both apps/sketchidraw and apps/ws directories with your specific configuration before running the application.

---

## 🤝 Contributing

We love contributions! Here's how you can help make SketchIDraw even better:

### 🐛 Found a Bug?

1. Check if it's already reported in [Issues](https://github.com/markande98/sketchidraw/issues)
2. Create a new issue with detailed steps to reproduce
3. Include screenshots or videos if helpful

### 💡 Have an Idea?

1. Open an issue to discuss your idea
2. Fork the repository
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### 📝 Development Guidelines

- Follow TypeScript best practices
- Write clean, self-documenting code
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by [Excalidraw](https://excalidraw.com/) for the hand-drawn aesthetic
- Built with amazing open-source technologies
- Thanks to all contributors and users! 💙
