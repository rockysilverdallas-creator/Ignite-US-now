import React, { useState, useEffect } from "react";
import {
  FileText,
  Presentation,
  HardDrive,
  FolderOpen,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
  Download,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { User } from "firebase/auth";
import { AuditResponse, WorkspaceItem } from "../types";
import {
  googleSignIn,
  logout,
  getAccessToken,
  openGooglePicker,
  initAuth,
} from "../services/googleAuth";
import {
  createProposalGoogleDoc,
  createPitchDeckGoogleSlides,
  saveAuditDossierToDrive,
  listDriveFiles,
  deleteDriveFile,
} from "../services/workspaceService";

interface WorkspaceHubProps {
  auditData: AuditResponse;
}

export const WorkspaceHub: React.FC<WorkspaceHubProps> = ({ auditData }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "doc" | "slide" | "sheet">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<WorkspaceItem[]>([]);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
    linkUrl?: string;
    linkText?: string;
  } | null>(null);
  const [isExportingDoc, setIsExportingDoc] = useState(false);
  const [isExportingSlides, setIsExportingSlides] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [pickedFile, setPickedFile] = useState<any | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<WorkspaceItem | null>(null);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive files when user is signed in
  const fetchFiles = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;

    setIsLoadingFiles(true);
    try {
      let mimeType: string | undefined = undefined;
      if (activeFilter === "doc") mimeType = "application/vnd.google-apps.document";
      if (activeFilter === "slide") mimeType = "application/vnd.google-apps.presentation";
      if (activeFilter === "sheet") mimeType = "application/vnd.google-apps.spreadsheet";

      const driveFiles = await listDriveFiles(currentToken, {
        mimeType,
        searchTerm: searchTerm.trim() || undefined,
        pageSize: 30,
      });
      setFiles(driveFiles);
    } catch (err: any) {
      console.error("Error listing Drive files:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to load Google Drive files. Please verify credentials.",
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
    }
  }, [token, activeFilter]);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setNotification(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setNotification({
          type: "success",
          message: `Connected as ${res.user.displayName || res.user.email}. Google Workspace ready!`,
        });
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setNotification({
        type: "error",
        message: err.message || "Google Sign-In was cancelled or failed.",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setFiles([]);
    setPickedFile(null);
    setNotification({
      type: "info",
      message: "Signed out of Google Workspace.",
    });
  };

  // Export to Google Docs
  const handleExportToDocs = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      handleSignIn();
      return;
    }

    setIsExportingDoc(true);
    setNotification(null);
    try {
      const res = await createProposalGoogleDoc(auditData, currentToken);
      setNotification({
        type: "success",
        message: `Successfully created Google Doc for ${auditData.clientInfo.clientName}!`,
        linkUrl: res.webViewLink,
        linkText: "Open Proposal in Google Docs ↗",
      });
      fetchFiles();
    } catch (err: any) {
      console.error("Docs export failed:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to generate Google Doc.",
      });
    } finally {
      setIsExportingDoc(false);
    }
  };

  // Export to Google Slides
  const handleExportToSlides = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      handleSignIn();
      return;
    }

    setIsExportingSlides(true);
    setNotification(null);
    try {
      const res = await createPitchDeckGoogleSlides(auditData, currentToken);
      setNotification({
        type: "success",
        message: `Successfully created 5-Slide Pitch Deck for ${auditData.clientInfo.clientName}!`,
        linkUrl: res.webViewLink,
        linkText: "Open Pitch Deck in Google Slides ↗",
      });
      fetchFiles();
    } catch (err: any) {
      console.error("Slides export failed:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to generate Google Slides deck.",
      });
    } finally {
      setIsExportingSlides(false);
    }
  };

  // Save JSON Dossier to Drive
  const handleSaveToDrive = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      handleSignIn();
      return;
    }

    setIsSavingToDrive(true);
    setNotification(null);
    try {
      const res = await saveAuditDossierToDrive(auditData, currentToken);
      setNotification({
        type: "success",
        message: `Saved Audit Package (${res.name}) to Google Drive!`,
        linkUrl: res.webViewLink,
        linkText: "View File in Google Drive ↗",
      });
      fetchFiles();
    } catch (err: any) {
      console.error("Drive upload failed:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to upload file to Google Drive.",
      });
    } finally {
      setIsSavingToDrive(false);
    }
  };

  // Open Google Picker
  const handleOpenPicker = async () => {
    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      handleSignIn();
      return;
    }

    try {
      await openGooglePicker((doc) => {
        setPickedFile(doc);
        setNotification({
          type: "success",
          message: `Selected "${doc.name}" via Google Picker!`,
          linkUrl: doc.url,
          linkText: "Open Picked File ↗",
        });
      });
    } catch (err: any) {
      console.error("Picker error:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to launch Google Picker.",
      });
    }
  };

  // Execute deletion with confirmation
  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem || !token) return;

    try {
      await deleteDriveFile(deleteConfirmItem.id, deleteConfirmItem.name, token);
      setNotification({
        type: "info",
        message: `Permanently removed "${deleteConfirmItem.name}" from Google Drive.`,
      });
      setFiles((prev) => prev.filter((f) => f.id !== deleteConfirmItem.id));
      if (pickedFile?.id === deleteConfirmItem.id) {
        setPickedFile(null);
      }
    } catch (err: any) {
      console.error("Delete failed:", err);
      setNotification({
        type: "error",
        message: err.message || "Failed to delete file from Google Drive.",
      });
    } finally {
      setDeleteConfirmItem(null);
    }
  };

  const getItemIcon = (type: WorkspaceItem["type"]) => {
    switch (type) {
      case "doc":
        return <FileText className="w-5 h-5 text-blue-400" />;
      case "slide":
        return <Presentation className="w-5 h-5 text-amber-400" />;
      case "sheet":
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case "folder":
        return <FolderOpen className="w-5 h-5 text-yellow-400" />;
      default:
        return <HardDrive className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Enterprise Integration
              </span>
              <span className="text-gray-400 text-xs font-mono">Google Cloud Project: ignitus-497415</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Google Workspace Hub
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-mono leading-relaxed">
              Export live <span className="text-white font-bold">{auditData.clientInfo.clientName}</span> audits, generate client-ready <span className="text-blue-400 font-bold">Google Docs</span> proposals, compile 5-slide <span className="text-amber-400 font-bold">Google Slides</span> pitch decks, and browse Drive files with <span className="text-emerald-400 font-bold">Google Picker</span>.
            </p>
          </div>

          {/* User Auth Card */}
          <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-4 min-w-[280px]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-10 h-10 rounded-full border border-emerald-500/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-white truncate max-w-[160px]">
                        {user.displayName || "Google Account"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate max-w-[160px] font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#242b35]">
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ✓ Full Workspace Scopes
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-red-400 font-mono transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-gray-400 font-mono">
                  Sign in with Google to create Docs, Slides, and access Google Drive.
                </div>
                {/* Official Sign in with Google Button */}
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs py-2.5 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isAuthenticating ? "Signing in..." : "Sign in with Google"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
            notification.type === "success"
              ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
              : notification.type === "error"
              ? "bg-rose-950/80 border-rose-500 text-rose-200"
              : "bg-blue-950/80 border-blue-500 text-blue-200"
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {notification.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {notification.type === "info" && <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            {notification.linkUrl && (
              <a
                href={notification.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-white font-bold underline flex items-center space-x-1"
              >
                <span>{notification.linkText || "Open Resource ↗"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 4 Quick Integration Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Google Docs */}
        <div className="bg-[#161a1f] border border-[#242b35] hover:border-blue-500/60 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all group shadow-lg">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-sm">1. Google Docs Proposal</div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Generate formatted Gladiator Proposal with Capital Leak Diagnostic for {auditData.clientInfo.clientName}.
            </p>
          </div>
          <button
            onClick={handleExportToDocs}
            disabled={isExportingDoc}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow shadow-blue-900/30 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isExportingDoc ? "Creating Doc..." : "Create Google Doc"}</span>
          </button>
        </div>

        {/* Card 2: Google Slides */}
        <div className="bg-[#161a1f] border border-[#242b35] hover:border-amber-500/60 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all group shadow-lg">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-sm">2. Google Slides Pitch Deck</div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Build the 5-Slide Executive Pitch Deck in Google Slides with wasabi-sharp data points.
            </p>
          </div>
          <button
            onClick={handleExportToSlides}
            disabled={isExportingSlides}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow shadow-amber-900/30 disabled:opacity-50"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>{isExportingSlides ? "Creating Slides..." : "Create Google Slides"}</span>
          </button>
        </div>

        {/* Card 3: Google Drive Dossier */}
        <div className="bg-[#161a1f] border border-[#242b35] hover:border-emerald-500/60 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all group shadow-lg">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-sm">3. Google Drive Archive</div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Store full client audit dataset, technical stack analysis, and metrics snapshot on Drive.
            </p>
          </div>
          <button
            onClick={handleSaveToDrive}
            disabled={isSavingToDrive}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow shadow-emerald-900/30 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isSavingToDrive ? "Uploading..." : "Save to Google Drive"}</span>
          </button>
        </div>

        {/* Card 4: Google Picker */}
        <div className="bg-[#161a1f] border border-[#242b35] hover:border-purple-500/60 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all group shadow-lg">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="font-bold text-white text-sm">4. Google Picker Explorer</div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              Launch native Google Picker dialog to select documents, slide decks, and spreadsheets.
            </p>
          </div>
          <button
            onClick={handleOpenPicker}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all shadow shadow-purple-900/30"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Launch Google Picker</span>
          </button>
        </div>
      </div>

      {/* Selected Google Picker File Banner */}
      {pickedFile && (
        <div className="bg-[#161a1f] border border-purple-500/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-purple-400 font-bold">
                Selected from Google Picker
              </div>
              <div className="text-sm font-bold text-white">{pickedFile.name}</div>
              <div className="text-[11px] text-gray-400 font-mono">
                ID: {pickedFile.id} • Type: {pickedFile.mimeType}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {pickedFile.url && (
              <a
                href={pickedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center space-x-1.5"
              >
                <span>Open in Google ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setPickedFile(null)}
              className="text-gray-400 hover:text-white px-2.5 py-1.5 text-xs font-mono"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Drive File Browser Section */}
      <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242b35] pb-4">
          <div className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-black text-white uppercase font-mono">
              Google Drive Repository
            </h3>
            <span className="text-xs text-gray-400 font-mono">({files.length} items)</span>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-[#161a1f] border border-[#242b35] rounded-lg p-1 space-x-1 text-xs">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeFilter === "all" ? "bg-red-600 text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                All Files
              </button>
              <button
                onClick={() => setActiveFilter("doc")}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeFilter === "doc" ? "bg-blue-600 text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                Docs
              </button>
              <button
                onClick={() => setActiveFilter("slide")}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeFilter === "slide" ? "bg-amber-600 text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                Slides
              </button>
              <button
                onClick={() => setActiveFilter("sheet")}
                className={`px-2.5 py-1 rounded font-mono ${
                  activeFilter === "sheet" ? "bg-emerald-600 text-white font-bold" : "text-gray-400 hover:text-white"
                }`}
              >
                Sheets
              </button>
            </div>

            <button
              onClick={fetchFiles}
              disabled={isLoadingFiles || !token}
              title="Refresh Google Drive files"
              className="p-2 bg-[#161a1f] border border-[#242b35] hover:border-gray-500 rounded-lg text-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? "animate-spin text-red-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="flex items-center space-x-2 bg-[#161a1f] border border-[#242b35] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Google Docs, Slides, and Drive files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchFiles()}
            className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                fetchFiles();
              }}
              className="text-[11px] text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Files List */}
        {!token ? (
          <div className="text-center py-12 space-y-4 border border-dashed border-[#242b35] rounded-xl">
            <HardDrive className="w-12 h-12 text-gray-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-mono">Sign in to browse Google Drive</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto font-mono">
                Connect your Google Account to view your Docs, Slides, and client proposals.
              </p>
            </div>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg"
            >
              <span>Sign in with Google</span>
            </button>
          </div>
        ) : isLoadingFiles ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2 text-gray-400 font-mono text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
            <span>Loading Google Drive repository...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-10 space-y-2 border border-dashed border-[#242b35] rounded-xl">
            <FileText className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-xs text-gray-400 font-mono">No files found matching criteria.</p>
            <p className="text-[11px] text-gray-500 font-mono">
              Use "Create Google Doc" or "Create Google Slides" above to generate your first client proposal!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/40 p-3.5 rounded-xl flex flex-col justify-between space-y-3 group transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getItemIcon(file.type)}</div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                      {file.name}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {file.modifiedTime
                        ? `Updated: ${new Date(file.modifiedTime).toLocaleDateString()}`
                        : "Google Workspace"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#242b35]">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 px-1.5 py-0.5 bg-[#12151a] rounded">
                    {file.type.toUpperCase()}
                  </span>

                  <div className="flex items-center space-x-2">
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                        title="Open in Google Workspace"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => setDeleteConfirmItem(file)}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Dialog for Deletions (Workspace Skill Compliance) */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a1f] border border-red-500/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-white uppercase font-mono">
                Confirm Google Drive File Deletion
              </h4>
            </div>

            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-bold">"{deleteConfirmItem.name}"</strong> from your Google Drive? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#242b35]">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold font-mono text-gray-400 hover:text-white bg-[#12151a] hover:bg-[#1a1f26] border border-[#242b35]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg text-xs font-bold font-mono text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-900/40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
