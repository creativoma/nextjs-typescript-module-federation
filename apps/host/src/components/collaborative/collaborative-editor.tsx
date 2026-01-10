import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import socketService, {
  User,
  DocumentState,
  DocumentUpdate,
  CursorUpdate,
} from "@/lib/socket";

interface CollaborativeEditorProps {
  documentId: string;
  userName: string;
}

interface RemoteCursor {
  userId: string;
  userName: string;
  color: string;
  position: { top: number; left: number };
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  documentId,
  userName,
}) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled Document");
  const [version, setVersion] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(
    new Map(),
  );
  const [isConnected, setIsConnected] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLocalChange = useRef(false);

  // Connect to socket and join document
  useEffect(() => {
    socketService.connect();
    socketService.joinDocument(documentId, userName);

    // Setup event listeners
    socketService.onDocumentState((state: DocumentState) => {
      setContent(state.content);
      setTitle(state.title);
      setVersion(state.version);
      setUsers(state.users);
      setCurrentUser(state.currentUser);
      setLastSaved(state.lastModified);
      setIsConnected(true);
    });

    socketService.onDocumentUpdated((update: DocumentUpdate) => {
      if (!isLocalChange.current) {
        setContent(update.content);
        setVersion(update.version);
        setLastSaved(update.lastModified);
      }
      isLocalChange.current = false;
    });

    socketService.onTitleUpdated(({ title, lastModified }) => {
      setTitle(title);
      setLastSaved(lastModified);
    });

    socketService.onUserJoined(({ users }) => {
      setUsers(users);
    });

    socketService.onUserLeft(({ users }) => {
      setUsers(users);
      // Clean up cursor for left user
      setRemoteCursors((prev) => {
        const newCursors = new Map(prev);
        users.forEach((u) => {
          if (!users.find((user) => user.id === u.id)) {
            newCursors.delete(u.id);
          }
        });
        return newCursors;
      });
    });

    socketService.onCursorUpdate((update: CursorUpdate) => {
      updateRemoteCursor(update);
    });

    socketService.onUserTyping(({ userId, userName }) => {
      setTypingUsers((prev) => new Set(prev).add(userName));
    });

    socketService.onUserStoppedTyping(({ userId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        const user = users.find((u) => u.id === userId);
        if (user) newSet.delete(user.name);
        return newSet;
      });
    });

    return () => {
      socketService.leaveDocument(documentId);
      socketService.removeAllListeners();
    };
  }, [documentId, userName]);

  // Calculate cursor position in pixels
  const updateRemoteCursor = useCallback((update: CursorUpdate) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const lines = textarea.value.split("\n");
    const lineHeight = 24; // Approximate line height
    const charWidth = 9.6; // Approximate character width for monospace

    const top = update.cursor.line * lineHeight + 8;
    const left = update.cursor.column * charWidth + 12;

    setRemoteCursors((prev) => {
      const newCursors = new Map(prev);
      newCursors.set(update.userId, {
        userId: update.userId,
        userName: update.userName,
        color: update.color,
        position: { top, left },
      });
      return newCursors;
    });
  }, []);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    isLocalChange.current = true;

    // Get cursor position
    const cursorIndex = e.target.selectionStart;
    const textBeforeCursor = newContent.substring(0, cursorIndex);
    const lines = textBeforeCursor.split("\n");
    const cursorPosition = {
      line: lines.length - 1,
      column: lines[lines.length - 1].length,
    };

    // Send change to server
    socketService.sendDocumentChange(
      documentId,
      newContent,
      version,
      cursorPosition,
    );
    setVersion((v) => v + 1);

    // Handle typing indicator
    socketService.sendTypingStart(documentId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTypingStop(documentId);
    }, 1000);
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    socketService.sendTitleChange(documentId, newTitle);
  };

  // Handle cursor movement
  const handleCursorMove = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorIndex = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorIndex);
    const lines = textBeforeCursor.split("\n");

    const cursorPosition = {
      line: lines.length - 1,
      column: lines[lines.length - 1].length,
    };

    socketService.sendCursorMove(documentId, cursorPosition);
  };

  // Handle selection change
  const handleSelection = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const textBeforeStart = content.substring(0, start);
      const textBeforeEnd = content.substring(0, end);

      const startLines = textBeforeStart.split("\n");
      const endLines = textBeforeEnd.split("\n");

      const selection = {
        start: {
          line: startLines.length - 1,
          column: startLines[startLines.length - 1].length,
        },
        end: {
          line: endLines.length - 1,
          column: endLines[endLines.length - 1].length,
        },
      };

      socketService.sendSelectionChange(documentId, selection);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not saved yet";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Document Title */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-white"
            placeholder="Document title..."
          />
        </div>

        {/* Active Users */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
            {users.length} user{users.length !== 1 ? "s" : ""} online
          </span>
          <div className="flex -space-x-2">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {typingUsers.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm"
          >
            {Array.from(typingUsers).join(", ")}{" "}
            {typingUsers.size === 1 ? "is" : "are"} typing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Area */}
      <div className="relative flex-1 p-4">
        {/* Remote Cursors */}
        {Array.from(remoteCursors.values()).map((cursor) => (
          <motion.div
            key={cursor.userId}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none z-10"
            style={{
              top: cursor.position.top,
              left: cursor.position.left,
            }}
          >
            <div
              className="w-0.5 h-5 rounded"
              style={{ backgroundColor: cursor.color }}
            />
            <div
              className="absolute -top-5 left-0 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </motion.div>
        ))}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onSelect={handleSelection}
          onClick={handleCursorMove}
          onKeyUp={handleCursorMove}
          className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          placeholder="Start typing to collaborate in real-time..."
          style={{ lineHeight: "24px" }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
        <div>
          {content.length} characters •{" "}
          {content.split(/\s+/).filter(Boolean).length} words •{" "}
          {content.split("\n").length} lines
        </div>
        <div>Last saved: {formatDate(lastSaved)}</div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
