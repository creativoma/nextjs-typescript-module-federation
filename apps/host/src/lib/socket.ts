import { io, Socket } from "socket.io-client";

export interface User {
  id: string;
  name: string;
  color: string;
  cursor: CursorPosition;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface Selection {
  start: CursorPosition;
  end: CursorPosition;
}

export interface DocumentState {
  content: string;
  title: string;
  lastModified: string;
  version: number;
  users: User[];
  currentUser: User;
}

export interface DocumentUpdate {
  content: string;
  lastModified: string;
  version: number;
  editorId: string;
}

export interface CursorUpdate {
  userId: string;
  cursor: CursorPosition;
  userName: string;
  color: string;
}

export interface SelectionUpdate {
  userId: string;
  selection: Selection;
  userName: string;
  color: string;
}

class SocketService {
  private socket: Socket | null = null;
  private documentId: string | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3012",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );

    this.socket.on("connect", () => {
      console.log("Connected to collaboration server");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from collaboration server:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      if (this.documentId) {
        this.leaveDocument(this.documentId);
      }
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinDocument(documentId: string, userName: string): void {
    if (!this.socket) {
      this.connect();
    }
    this.documentId = documentId;
    this.socket?.emit("join-document", { documentId, userName });
  }

  leaveDocument(documentId: string): void {
    this.socket?.emit("leave-document", { documentId });
    this.documentId = null;
  }

  sendDocumentChange(
    documentId: string,
    content: string,
    version: number,
    cursorPosition?: CursorPosition,
  ): void {
    this.socket?.emit("document-change", {
      documentId,
      content,
      version,
      cursorPosition,
    });
  }

  sendTitleChange(documentId: string, title: string): void {
    this.socket?.emit("title-change", { documentId, title });
  }

  sendCursorMove(documentId: string, cursorPosition: CursorPosition): void {
    this.socket?.emit("cursor-move", { documentId, cursorPosition });
  }

  sendSelectionChange(documentId: string, selection: Selection): void {
    this.socket?.emit("selection-change", { documentId, selection });
  }

  sendTypingStart(documentId: string): void {
    this.socket?.emit("typing-start", { documentId });
  }

  sendTypingStop(documentId: string): void {
    this.socket?.emit("typing-stop", { documentId });
  }

  // Event listeners
  onDocumentState(callback: (state: DocumentState) => void): void {
    this.socket?.on("document-state", callback);
  }

  onDocumentUpdated(callback: (update: DocumentUpdate) => void): void {
    this.socket?.on("document-updated", callback);
  }

  onTitleUpdated(
    callback: (data: { title: string; lastModified: string }) => void,
  ): void {
    this.socket?.on("title-updated", callback);
  }

  onUserJoined(callback: (data: { user: User; users: User[] }) => void): void {
    this.socket?.on("user-joined", callback);
  }

  onUserLeft(
    callback: (data: {
      userId: string;
      userName: string;
      users: User[];
    }) => void,
  ): void {
    this.socket?.on("user-left", callback);
  }

  onCursorUpdate(callback: (update: CursorUpdate) => void): void {
    this.socket?.on("cursor-update", callback);
  }

  onSelectionUpdate(callback: (update: SelectionUpdate) => void): void {
    this.socket?.on("selection-updated", callback);
  }

  onUserTyping(
    callback: (data: { userId: string; userName: string }) => void,
  ): void {
    this.socket?.on("user-typing", callback);
  }

  onUserStoppedTyping(callback: (data: { userId: string }) => void): void {
    this.socket?.on("user-stopped-typing", callback);
  }

  // Cleanup listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners();
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
