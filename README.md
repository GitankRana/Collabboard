# CollabBoard

A full-stack real-time collaborative whiteboard application where multiple users can draw, sketch, and brainstorm together — live, in the same room. Built with a clean dark UI inspired by Excalidraw and Figma, with a focus on smooth real-time collaboration.

🔗🔗 **Live Demo:** [collabboard-omega.vercel.app](https://collabboard-omega.vercel.app)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| State Management | Zustand |
| Real-time | Socket.IO Client |
| Backend | Node.js, Express |
| WebSockets | Socket.IO |
| Drawing | Canvas API |
| Routing | React Router DOM |
| Notifications | React Hot Toast |

---

## ✨ Features

🎨 **Freehand Drawing** — Smooth pencil tool with pressure-sensitive stroke rendering using quadratic curves

🟦 **Shape Tools** — Rectangle, ellipse, line, and arrow tools with live preview while drawing

✏️ **Text Tool** — Click anywhere on the canvas to add and edit text directly

📝 **Sticky Notes** — Add colorful sticky notes anywhere on the infinite canvas

🌐 **Real-time Multiplayer** — Multiple users draw simultaneously in the same room with zero-conflict syncing via Socket.IO

👥 **Live Cursors** — See other users' cursors moving in real time with their username labels and drawing indicators

💬 **Built-in Chat** — Real-time chat panel inside every room so collaborators can communicate without leaving the board

🎨 **Style Panel** — Color picker with preset colors and stroke width selector that apply to all drawing tools

↩️ **Undo / Redo** — Full history stack with `Ctrl+Z` and `Ctrl+Y` support, up to 50 steps

🔍 **Zoom & Pan** — Smooth zoom toward cursor with `Ctrl+Scroll`, pan with the hand tool or middle mouse button

⌨️ **Keyboard Shortcuts** — Full shortcut support: `P` pencil, `R` rectangle, `E` ellipse, `L` line, `A` arrow, `T` text, `N` sticky, `X` eraser, `S` select, `H` hand, `Escape` to cancel

🌙 **Dark / Light Mode** — Toggle between dark and light themes with one click, persisted across the session

🏠 **Room System** — Create rooms with unique IDs, share the room code with teammates to collaborate instantly

👤 **Guest Mode** — Jump in without an account — just enter a username and start drawing

🎯 **Eraser Tool** — Click any element to remove it from the canvas, synced to all users in real time

🏷️ **Presence Indicators** — See who's in the room with avatar badges and a live drawing animation dot

---

## 🧠 What We Learned

How to architect a real-time full-stack application from scratch — structuring a WebSocket server with Socket.IO, managing room state in memory on the backend, and syncing drawing events to all connected clients with low latency

Implementing an infinite canvas drawing engine using the raw Canvas API — handling coordinate transforms for zoom and pan, rendering different element types (paths, shapes, text), and maintaining smooth performance during freehand drawing

Designing a conflict-free element sync system where each drawing element has a unique ID and version number, so updates from multiple users don't overwrite each other

Building a Zustand state management architecture that separates canvas state, auth state, and room state into clean independent stores, each with typed interfaces

Understanding the full Socket.IO event lifecycle — joining rooms, broadcasting to specific room members, handling reconnections, and cleaning up state on disconnect

Implementing coordinate space transformations — converting between screen coordinates and canvas coordinates to correctly account for zoom level and pan offset in all mouse interactions

Managing complex React component interactions between a canvas element, floating UI panels, and real-time socket events without causing unnecessary re-renders

Debugging TypeScript strict mode errors across a monorepo-style project with shared types between frontend components, Zustand stores, and socket event handlers

Building reusable UI patterns — floating toolbars, modal overlays, chat bubbles, presence avatars — that work consistently in both light and dark mode using CSS custom properties

How small UX details — live cursor labels, drawing pulse animations, connection status dots, toast notifications, and smooth zoom toward cursor — dramatically improve the feel of a collaborative app

---

## ⌨️ Keyboard Shortcuts

| Key | Tool |
|---|---|
| `S` | Select |
| `H` | Hand / Pan |
| `P` | Pencil |
| `R` | Rectangle |
| `E` | Ellipse |
| `L` | Line |
| `A` | Arrow |
| `T` | Text |
| `N` | Sticky Note |
| `X` | Eraser |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+A` | Select All |
| `Delete` | Delete Selected |
| `Escape` | Cancel / Select Tool |
