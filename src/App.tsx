import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Context } from "./context/context";
import Sidebar from "./components/SideBar/SideBar";
import ChatWindow from "./components/chat/ChatWindow";
import Auth from "./components/auth/Auth";
import Settings from "./components/settings/Settings";
import SearchModal from "./components/modals/SearchModal";
import Landing from "./components/landing/Landing";

function ChatApp() {
  const { currentUser, sidebarOpen, setSidebarOpen } = useContext(Context);

  if (!currentUser) return <Auth />;

  return (
    <div className="flex h-screen bg-surface-0 text-txt overflow-x-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar />
      <ChatWindow />
      <Settings />
      <SearchModal />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<ChatApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
