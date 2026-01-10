import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import DashboardLayout from "@/pages/components/dashboard-layout";
import CollaborativeEditor from "@/components/collaborative/collaborative-editor";
import { Button } from "@/components/ui/button";
import { Card, Title, Text } from "@tremor/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CollaborativeDocumentPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { docId } = router.query;

  const [documentId, setDocumentId] = useState<string>("");
  const [joinDocId, setJoinDocId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (docId && typeof docId === "string") {
      setDocumentId(docId);
      setIsEditing(true);
    }
  }, [docId]);

  const handleCreateNewDocument = () => {
    const newDocId = `doc-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    setDocumentId(newDocId);
    setIsEditing(true);
    router.push(`/dashboard/collaborative?docId=${newDocId}`, undefined, {
      shallow: true,
    });
  };

  const handleJoinDocument = () => {
    if (joinDocId.trim()) {
      setDocumentId(joinDocId.trim());
      setIsEditing(true);
      router.push(
        `/dashboard/collaborative?docId=${joinDocId.trim()}`,
        undefined,
        { shallow: true },
      );
    }
  };

  const handleBackToLobby = () => {
    setIsEditing(false);
    setDocumentId("");
    router.push("/dashboard/collaborative", undefined, { shallow: true });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/dashboard/collaborative?docId=${documentId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const userName = session?.user?.name || "Anonymous";

  return (
    <DashboardLayout title="Real-time Collaborative Document 📝">
      {!isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero Section */}
          <Card className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="text-center">
              <Title className="text-3xl font-bold text-white mb-4">
                Real-time Collaborative Editing
              </Title>
              <Text className="text-white/90 text-lg max-w-2xl mx-auto">
                Create or join a document and collaborate with others in
                real-time. See live cursor positions, typing indicators, and
                instant updates.
              </Text>
            </div>
          </Card>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create New Document */}
            <Card className="p-6">
              <Title className="mb-4">Create New Document</Title>
              <Text className="text-slate-500 dark:text-slate-400 mb-6">
                Start a new collaborative document and invite others to join.
              </Text>
              <Button
                onClick={handleCreateNewDocument}
                className="w-full"
                size="lg"
              >
                Create New Document
              </Button>
            </Card>

            {/* Join Existing Document */}
            <Card className="p-6">
              <Title className="mb-4">Join Existing Document</Title>
              <Text className="text-slate-500 dark:text-slate-400 mb-4">
                Enter a document ID to join an existing collaborative session.
              </Text>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="docId">Document ID</Label>
                  <Input
                    id="docId"
                    value={joinDocId}
                    onChange={(e) => setJoinDocId(e.target.value)}
                    placeholder="Enter document ID..."
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleJoinDocument}
                  disabled={!joinDocId.trim()}
                  className="w-full"
                  variant="outline"
                >
                  Join Document
                </Button>
              </div>
            </Card>
          </div>

          {/* Features */}
          <Card className="p-6">
            <Title className="mb-4">Features</Title>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="font-semibold mb-2">Multi-user Editing</h3>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Multiple users can edit the same document simultaneously
                </Text>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold mb-2">Live Cursors</h3>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  See where other users are typing in real-time
                </Text>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Instant Sync</h3>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Changes are synchronized instantly using Socket.io
                </Text>
              </div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between">
            <Button onClick={handleBackToLobby} variant="outline" size="sm">
              ← Back to Lobby
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Document ID:{" "}
                <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                  {documentId}
                </code>
              </span>
              <Button onClick={handleCopyLink} variant="outline" size="sm">
                Copy Link
              </Button>
            </div>
          </div>

          {/* Collaborative Editor */}
          <CollaborativeEditor documentId={documentId} userName={userName} />
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default CollaborativeDocumentPage;
