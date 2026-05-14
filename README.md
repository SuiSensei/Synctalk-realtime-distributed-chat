# SyncTalk

**Real-Time Distributed Chat Application**

A WebSocket-powered chat platform demonstrating distributed system principles in practice.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-In_Development-blue?style=flat-square)

[Overview](#overview) · [Architecture](#architecture) · [Getting Started](#getting-started) · [API Reference](#websocket-api) · [Contributing](#contributing)

---

## Overview

SyncTalk is a real-time chat application designed to demonstrate how multiple users can communicate instantly using **distributed system concepts**. Built on WebSocket-based bidirectional communication, it enables seamless, low-latency message exchange between clients connected to a central server.

The project explores fundamental concepts in distributed computing — including concurrent connection management, message broadcasting, state synchronization, and fault tolerance — through a practical, hands-on implementation.

### Project Goals

- Provide a practical exploration of WebSocket protocols and real-time messaging
- Demonstrate distributed system principles in an accessible codebase
- Serve as a foundation that can be extended toward production-grade scalability
- Maintain type-safe, maintainable code through TypeScript-first development

---

## Features

- **Real-time messaging** — Instant communication powered by persistent WebSocket connections
- **Multi-user support** — Concurrent client connections handled by a central server
- **Bidirectional communication** — Full-duplex messaging between clients and server
- **Message broadcasting** — Efficient relay of messages across all connected peers
- **Modern frontend** — Clean, responsive user interface
- **Type-safe backend** — Built with TypeScript for compile-time safety
- **Distributed-systems foundation** — Designed to demonstrate concurrency, state synchronization, and message handling patterns

---

## Architecture

SyncTalk follows a **client-server architecture** in which WebSocket connections form a star topology around a central server.

```text
              ┌─────────────┐
              │   Client A  │
              └──────┬──────┘
                     │ WS
                     ▼
┌─────────┐    ┌───────────┐    ┌─────────┐
│ Client B├───►│  Server   │◄───┤ Client C│
└─────────┘ WS │ (WS Hub)  │ WS └─────────┘
               └─────┬─────┘
                     │ WS
                     ▼
              ┌─────────────┐
              │   Client D  │
              └─────────────┘
```

### Message Flow

1. The client establishes a persistent WebSocket connection to the server.
2. The server registers the client within its active connection pool.
3. When a client sends a message, the server broadcasts it to all connected peers.
4. Clients receive and render messages in real time.

---

## Tech Stack

| Layer           | Technology                                                |
| --------------- | --------------------------------------------------------- |
| Backend         | Node.js, TypeScript, WebSocket (`ws`)                     |
| Frontend        | Specify your frontend framework (e.g., React, Vue, Vanilla JS) |
| Protocol        | WebSocket (RFC 6455)                                      |
| Language        | TypeScript                                                |
| Package Manager | npm                                                       |

---

## Project Structure

```text
synctalk-realtime-distributed-chat/
│
├── .github/                      # GitHub configuration
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.md
│   │   └── feature-request.md
│   ├── CODEOWNERS
│   └── pull-request-template.md
│
├── docs/                         # Project documentation
│
├── frontend/                     # Client-side application
│
├── websocket/                    # WebSocket server
│   ├── server.ts                 # Main server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── package-lock.json
└── README.md
```

---

## Getting Started

Follow these steps to run SyncTalk locally.

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** v18.0.0 or higher — [nodejs.org](https://nodejs.org/)
- **npm** v9.0.0 or higher (bundled with Node.js)
- **Git** — [git-scm.com](https://git-scm.com/)

Verify your installation:

```bash
node --version
npm --version
git --version
```

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/synctalk-realtime-distributed-chat.git
cd synctalk-realtime-distributed-chat
```

#### 2. Install root dependencies

```bash
npm install
```

#### 3. Install WebSocket server dependencies

```bash
cd websocket
npm install
```

#### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### Running the Application

Start the WebSocket server:

```bash
cd websocket
npm run dev
```

The server will start on `ws://localhost:8080` (or your configured port).

In a separate terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Open your browser and navigate to the frontend URL (typically `http://localhost:3000` or `http://localhost:5173`).

---

## WebSocket API

### Connection Endpoint

```text
ws://localhost:8080
```

### Message Format

Messages are exchanged as JSON-encoded strings:

```json
{
  "type": "message",
  "username": "alice",
  "content": "Hello, world!",
  "timestamp": "2026-05-12T10:30:00Z"
}
```

### Event Types

| Event Type   | Direction       | Description            |
| ------------ | --------------- | ---------------------- |
| `connect`    | Client → Server | Client joins the chat  |
| `message`    | Bidirectional   | Chat message broadcast |
| `disconnect` | Client → Server | Client leaves the chat |

---

## Documentation

Additional documentation is available in the [`docs/`](./docs) directory.

---

## Roadmap

- [ ] User authentication and session management
- [ ] Private messaging and direct messages
- [ ] Chat rooms and channels
- [ ] Message persistence with a database
- [ ] Typing indicators
- [ ] Online/offline presence status
- [ ] File and media sharing
- [ ] Horizontal scaling with Redis pub/sub
- [ ] End-to-end encryption

---

## Contributing

Contributions are welcome and greatly appreciated. To contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please review the [issue templates](./.github/ISSUE_TEMPLATE) and the [pull request template](./.github/pull-request-template.md) before submitting.

### Reporting Bugs

If you encounter a bug, please open an issue using the [bug report template](./.github/ISSUE_TEMPLATE/bug-report.md).

### Suggesting Features

To propose a new feature, submit a [feature request](./.github/ISSUE_TEMPLATE/feature-request.md).

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Authors

- **Your Name** — *Initial work* — [@your-github](https://github.com/your-github)

See the list of [contributors](https://github.com/<your-username>/synctalk-realtime-distributed-chat/contributors) who have participated in this project.

### Acknowledgments

- Inspired by distributed systems coursework and real-world chat applications
- Built with the [`ws`](https://github.com/websockets/ws) WebSocket library
- Thanks to the open-source community

---
