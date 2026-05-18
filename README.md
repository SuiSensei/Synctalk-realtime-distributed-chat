# SyncTalk

**Real-Time Distributed Chat Application**

A WebSocket-powered chat platform demonstrating distributed system principles in practice.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

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
- **User authentication** — Session-based authentication for secure access
- **Chat rooms and channels** — Multiple conversation spaces for organized discussions
- **Message persistence** — Chat history stored in a database for reliable retrieval
- **Typing indicators** — Real-time feedback when other users are composing messages
- **Modern frontend** — Clean, responsive UI built with Next.js
- **Type-safe codebase** — End-to-end TypeScript for compile-time safety
- **Distributed-systems foundation** — Demonstrates concurrency, state synchronization, and message handling patterns

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
2. The server authenticates the client and registers it within its active connection pool.
3. When a client sends a message, the server persists it and broadcasts to all peers in the same room.
4. Clients receive and render messages in real time.

---

## Tech Stack

| Layer           | Technology                                                |
| --------------- | --------------------------------------------------------- |
| Backend         | Node.js, TypeScript, WebSocket (`ws`)                     |
| Frontend        | Next.js, React, TypeScript                                |
| Protocol        | WebSocket (RFC 6455)                                      |
| Language        | TypeScript                                                |
| Package Manager | pnpm                                                      |

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
├── frontend/                     # Next.js client application
│
├── websocket/                    # WebSocket server
│   ├── server.ts                 # Main server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── pnpm-lock.yaml
└── README.md
```

---

## Getting Started

Follow these steps to run SyncTalk locally.

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** v18.0.0 or higher — [nodejs.org](https://nodejs.org/)
- **pnpm** v8.0.0 or higher — [pnpm.io](https://pnpm.io/installation)
- **Git** — [git-scm.com](https://git-scm.com/)

Verify your installation:

```bash
node --version
pnpm --version
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
pnpm install
```

#### 3. Install WebSocket server dependencies

```bash
cd websocket
pnpm install
```

#### 4. Install frontend dependencies

```bash
cd ../frontend
pnpm install
```

### Running the Application

Start the WebSocket server:

```bash
cd websocket
pnpm dev
```

The server will start on `ws://localhost:8080` (or your configured port).

In a separate terminal, start the frontend:

```bash
cd frontend
pnpm dev
```

Open your browser and navigate to `http://localhost:3000`.

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

| Event Type   | Direction       | Description                       |
| ------------ | --------------- | --------------------------------- |
| `connect`    | Client → Server | Client joins the chat             |
| `message`    | Bidirectional   | Chat message broadcast            |
| `typing`     | Bidirectional   | Typing indicator notification     |
| `join_room`  | Client → Server | Client joins a chat room          |
| `leave_room` | Client → Server | Client leaves a chat room         |
| `disconnect` | Client → Server | Client leaves the chat            |

---

## Documentation

Additional documentation is available in the [`docs/`](./docs) directory.

---

## Roadmap

- [x] User authentication and session management
- [x] Chat rooms and channels
- [x] Message persistence with a database
- [x] Typing indicators
- [ ] Private messaging and direct messages
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

## Authors

- **Jhey Gulde** — *Documentation and Quality Assurance*
- **Gerlie Campion** — *Frontend Developer*
- **Kathleen Grace Gultiano** — *Frontend Developer*
- **John Carl Ramirez** — *Full Stack Developer*
- **Francis Adrian Esteban** — *Backend Developer*

See the list of [contributors](https://github.com/SuiSensei/Synctalk-realtime-distributed-chat/graphs/contributors?from=2%2F14%2F2026) who have participated in this project.

### Acknowledgments

- Inspired by distributed systems coursework and real-world chat applications
- Built with the [`ws`](https://github.com/websockets/ws) WebSocket library
- Thanks to the open-source community

---
