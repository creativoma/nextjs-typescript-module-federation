// Socket.io server for real-time collaborative editing
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3010", "http://localhost:3011"],
    methods: ["GET", "POST"],
  },
});

// Store document state
const documents = new Map();
const userColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

// Active users per document
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a document room
  socket.on("join-document", ({ documentId, userName }) => {
    socket.join(documentId);

    // Initialize document if not exists
    if (!documents.has(documentId)) {
      documents.set(documentId, {
        content: "",
        title: "Untitled Document",
        lastModified: new Date().toISOString(),
        version: 0,
      });
    }

    // Track active users
    if (!activeUsers.has(documentId)) {
      activeUsers.set(documentId, new Map());
    }

    const docUsers = activeUsers.get(documentId);
    const userColor = userColors[docUsers.size % userColors.length];

    docUsers.set(socket.id, {
      id: socket.id,
      name: userName || `User ${docUsers.size + 1}`,
      color: userColor,
      cursor: { line: 0, column: 0 },
    });

    // Send current document state to the new user
    const document = documents.get(documentId);
    socket.emit("document-state", {
      ...document,
      users: Array.from(docUsers.values()),
      currentUser: docUsers.get(socket.id),
    });

    // Notify others about new user
    socket.to(documentId).emit("user-joined", {
      user: docUsers.get(socket.id),
      users: Array.from(docUsers.values()),
    });

    socket.documentId = documentId;
    console.log(`User ${socket.id} joined document: ${documentId}`);
  });

  // Handle document content changes
  socket.on(
    "document-change",
    ({ documentId, content, version, cursorPosition }) => {
      if (!documents.has(documentId)) return;

      const document = documents.get(documentId);

      // Simple version control - accept if version matches
      if (version >= document.version) {
        document.content = content;
        document.lastModified = new Date().toISOString();
        document.version = version + 1;
        documents.set(documentId, document);

        // Broadcast to other users in the room
        socket.to(documentId).emit("document-updated", {
          content,
          lastModified: document.lastModified,
          version: document.version,
          editorId: socket.id,
        });
      }

      // Update cursor position
      if (cursorPosition && activeUsers.has(documentId)) {
        const docUsers = activeUsers.get(documentId);
        const user = docUsers.get(socket.id);
        if (user) {
          user.cursor = cursorPosition;
          docUsers.set(socket.id, user);

          socket.to(documentId).emit("cursor-update", {
            userId: socket.id,
            cursor: cursorPosition,
            userName: user.name,
            color: user.color,
          });
        }
      }
    },
  );

  // Handle title changes
  socket.on("title-change", ({ documentId, title }) => {
    if (!documents.has(documentId)) return;

    const document = documents.get(documentId);
    document.title = title;
    document.lastModified = new Date().toISOString();
    documents.set(documentId, document);

    socket.to(documentId).emit("title-updated", {
      title,
      lastModified: document.lastModified,
    });
  });

  // Handle cursor position updates
  socket.on("cursor-move", ({ documentId, cursorPosition }) => {
    if (!activeUsers.has(documentId)) return;

    const docUsers = activeUsers.get(documentId);
    const user = docUsers.get(socket.id);

    if (user) {
      user.cursor = cursorPosition;
      docUsers.set(socket.id, user);

      socket.to(documentId).emit("cursor-update", {
        userId: socket.id,
        cursor: cursorPosition,
        userName: user.name,
        color: user.color,
      });
    }
  });

  // Handle user selection
  socket.on("selection-change", ({ documentId, selection }) => {
    if (!activeUsers.has(documentId)) return;

    const docUsers = activeUsers.get(documentId);
    const user = docUsers.get(socket.id);

    if (user) {
      socket.to(documentId).emit("selection-updated", {
        userId: socket.id,
        selection,
        userName: user.name,
        color: user.color,
      });
    }
  });

  // Handle typing indicator
  socket.on("typing-start", ({ documentId }) => {
    if (!activeUsers.has(documentId)) return;

    const docUsers = activeUsers.get(documentId);
    const user = docUsers.get(socket.id);

    if (user) {
      socket.to(documentId).emit("user-typing", {
        userId: socket.id,
        userName: user.name,
      });
    }
  });

  socket.on("typing-stop", ({ documentId }) => {
    socket.to(documentId).emit("user-stopped-typing", {
      userId: socket.id,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    const documentId = socket.documentId;
    if (documentId && activeUsers.has(documentId)) {
      const docUsers = activeUsers.get(documentId);
      const user = docUsers.get(socket.id);

      docUsers.delete(socket.id);

      if (docUsers.size === 0) {
        activeUsers.delete(documentId);
      } else {
        socket.to(documentId).emit("user-left", {
          userId: socket.id,
          userName: user?.name,
          users: Array.from(docUsers.values()),
        });
      }
    }
  });

  // Handle explicit leave
  socket.on("leave-document", ({ documentId }) => {
    if (activeUsers.has(documentId)) {
      const docUsers = activeUsers.get(documentId);
      const user = docUsers.get(socket.id);

      docUsers.delete(socket.id);
      socket.leave(documentId);

      socket.to(documentId).emit("user-left", {
        userId: socket.id,
        userName: user?.name,
        users: Array.from(docUsers.values()),
      });
    }
  });
});

const PORT = process.env.SOCKET_PORT || 3012;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log(`📝 Real-time collaboration ready!`);
});

module.exports = { io, httpServer };
