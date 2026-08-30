import { useContext, useRef, useState } from "react";
import { Context } from "../../context/context";
import {
  PiListBold,
  PiPlusBold,
  PiMagnifyingGlassBold,
  PiChatCircleTextBold,
  PiGearSixBold,
  PiTrashBold,
  PiPencilSimpleBold,
  PiCheckBold,
  PiXBold,
  PiClockBold,
  PiPushPinSimpleBold,
  PiExportBold,
} from "react-icons/pi";

function Sidebar() {
  const {
    chats,
    filteredChats,
    activeChatId,
    createChat,
    switchChat,
    deleteChat,
    renameChat,
    sidebarOpen,
    setSidebarOpen,
    sidebarExtended: extended,
    setSidebarExtended: setExtended,
    setSettingsOpen,
    setSearchModalOpen,
    theme,
    pinChat,
    exportChat,
  } = useContext(Context);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [popoverChatId, setPopoverChatId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const chatBtnRef = useRef<HTMLButtonElement>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const handleRename = (id: string) => {
    if (editValue.trim()) {
      renameChat(id, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const startRename = (id: string, current: string) => {
    setEditingId(id);
    setEditValue(current);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  /* ── Chat list ── */
  const ChatList = ({ mobile }: { mobile?: boolean }) => (
    <div className="flex-1 overflow-y-auto mt-3 px-2.5">
      {filteredChats.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="relative"
              onMouseEnter={() => setHoveredId(chat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {editingId === chat.id ? (
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-800 animate-fade-in">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(chat.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300 font-medium"
                  />
                  <button onClick={() => handleRename(chat.id)} className="p-1 rounded-lg hover:bg-indigo-600/20 text-indigo-400">
                    <PiCheckBold className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 rounded-lg hover:bg-gray-700 text-gray-400">
                    <PiXBold className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => switchChat(chat.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 group/item ${
                    activeChatId === chat.id ? "bg-indigo-600/20 text-indigo-400" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    activeChatId === chat.id ? "bg-indigo-600/20" : "bg-gray-700 group-hover/item:bg-gray-800"
                  }`}>
                    <PiChatCircleTextBold className={`w-4 h-4 ${activeChatId === chat.id ? "text-indigo-400" : "text-gray-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      {chat.pinned && <PiPushPinSimpleBold className="w-3 h-3 text-indigo-400 shrink-0" />}
                    </div>
                    {(mobile || extended) && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <PiClockBold className="w-3 h-3 text-gray-500" />
                        <p className="text-[11px] text-gray-500">{formatDate(chat.updatedAt)}</p>
                      </div>
                    )}
                  </div>
                  {(mobile || extended) && hoveredId === chat.id && editingId !== chat.id && (
                    <div className="flex items-center gap-0.5 flex-shrink-0 animate-fade-in">
                      <div
                        onClick={(e) => { e.stopPropagation(); pinChat(chat.id); }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${chat.pinned ? "text-indigo-400 bg-indigo-600/20" : "hover:bg-gray-700 text-gray-300 hover:text-gray-200"}`}
                        title={chat.pinned ? "Unpin" : "Pin"}
                      >
                        <PiPushPinSimpleBold className="w-3.5 h-3.5" />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); startRename(chat.id, chat.title); }}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                        title="Rename"
                      >
                        <PiPencilSimpleBold className="w-3.5 h-3.5" />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); exportChat(chat.id, "markdown"); }}
                        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                        title="Export"
                      >
                        <PiExportBold className="w-3.5 h-3.5" />
                      </div>
                      <div
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(chat.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-600/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <PiTrashBold className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </button>
              )}
              {confirmDelete === chat.id && (
                <div className="fixed inset-0 z-10 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
                  <div className="fixed z-50 w-80 max-h-[70vh] bg-gray-900 border border-red-600/20 rounded-xl shadow-xl p-6 transform translate-middle top-1/2 left-1/2">
                    <span className="text-xs text-gray-500 font-medium">Delete "{chat.title}"?</span>
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => { deleteChat(chat.id); setConfirmDelete(null); }}
                        className="rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors"
                      >
                        <PiCheckBold className="w-4 h-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="rounded-lg hover:bg-gray-700 text-gray-400 transition-colors">
                        <PiXBold className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-12 px-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-700 flex items-center justify-center mb-3">
            <PiChatCircleTextBold className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 text-center">No conversations yet</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col h-screen overflow-hidden bg-gray-900 border-r border-gray-700 transition-[width] duration-300 ease-in-out fixed top-0 left-0 bottom-0 z-30 ${extended ? "w-[300px]" : "w-[72px]"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full group/sidebar">
          <div
            className={`pt-5 pb-2 flex items-center transition-all duration-300 ${extended ? "px-4" : "px-3 justify-center"}`}
          >
            {extended ? (
              <div className="flex items-center justify-between w-full animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <img
                    src={theme === "dark" ? "/lumina-logo-light.png" : "/lumina-logo.png"}
                    alt="Lumina"
                    className="w-9 h-9 rounded-xl object-cover shadow-[0_0_12px_var(--color-accent)/.15]"
                  />
                  <span className="text-lg font-bold text-gray-100 font-display tracking-tight whitespace-nowrap">Lumina</span>
                </div>
                <button onClick={() => setExtended(false)} className="p-2 rounded-xl hover:bg-gray-700 text-gray-400 transition-colors">
                  <PiListBold className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                {isHovered ? (
                  <button onClick={() => setExtended(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 transition-colors animate-fade-in" title="Expand sidebar">
                    <PiListBold className="w-5 h-5" />
                  </button>
                ) : (
                  <img
                    src={theme === "dark" ? "/lumina-logo-light.png" : "/lumina-logo.png"}
                    alt="Lumina"
                    className="w-10 h-10 rounded-xl object-cover shadow-[0_0_12px_var(--color-accent)/.15]"
                  />
                )}
              </div>
            )}
          </div>
          <div className={`mt-4 whitespace-nowrap overflow-hidden ${extended ? "px-3" : "px-2"}`}>
            <button
              onClick={() => createChat()}
              className={`flex items-center gap-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/20 hover:from-indigo-600/25 hover:to-purple-600/25 hover:border-indigo-600/30 active:scale-[0.98] transition-all duration-300 ease-in-out ${extended ? "w-full px-4 py-3 rounded-xl" : "w-10 h-10 mx-auto rounded-full justify-center"}`}
            >
              <PiPlusBold className="w-5 h-5 text-indigo-400 shrink-0" />
              {extended && <span className="text-sm text-indigo-400 font-semibold animate-fade-in whitespace-nowrap">New Chat</span>}
            </button>
          </div>
          {extended ? (
            <>
              <div className="mt-3 whitespace-nowrap overflow-hidden px-3">
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/20 hover:from-indigo-600/25 hover:to-purple-600/25 hover:border-indigo-600/30 active:scale-[0.98] transition-all duration-300 ease-in-out"
                >
                  <PiMagnifyingGlassBold className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-sm text-indigo-400 font-semibold animate-fade-in whitespace-nowrap">Search Chats</span>
                </button>
              </div>
              <ChatList />
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 mt-3 px-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/20 hover:from-indigo-600/25 hover:to-purple-600/25 transition-all duration-200 text-indigo-400"
                title="Search Chats"
              >
                <PiMagnifyingGlassBold className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  ref={chatBtnRef}
                  onClick={() => {
                    if (popoverChatId === "chats") { setPopoverChatId(null); }
                    else {
                      const rect = chatBtnRef.current!.getBoundingClientRect();
                      setPopoverPos({ top: rect.top, left: rect.right + 12 });
                      setPopoverChatId("chats");
                    }
                  }}
                  title="Chats"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${popoverChatId === "chats" ? "bg-indigo-600/20 text-indigo-400" : "bg-gray-800/50 border border-indigo-600/20 hover:from-indigo-600/25 hover:to-purple-600/25 text-indigo-400"}`}
                >
                  <PiChatCircleTextBold className="w-5 h-5" />
                </button>
                {popoverChatId === "chats" && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setPopoverChatId(null)} />
                    <div
                      className="fixed z-50 w-80 max-h-[70vh] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/25 animate-fade-in overflow-hidden flex flex-col"
                      style={{ top: popoverPos.top, left: popoverPos.left }}
                    >
                      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between shrink-0">
                        <p className="text-sm font-semibold text-gray-100">Chats</p>
                        <span className="text-[11px] text-gray-500">{chats.length} total</span>
                      </div>
                      <div className="flex-1 overflow-y-auto pt-3">
                        {filteredChats.length > 0 ? (
                          <div className="flex flex-col gap-0.5 px-2">
                            {filteredChats.map((chat) => (
                              <div key={chat.id} className="relative group">
                                {editingId === chat.id ? (
                                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-800 animate-fade-in">
                                    <input
                                      autoFocus
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      onKeyDown={(e) => { if (e.key === "Enter") handleRename(chat.id); if (e.key === "Escape") setEditingId(null); }}
                                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300 font-medium"
                                    />
                                    <button onClick={() => handleRename(chat.id)} className="p-1 rounded-lg hover:bg-indigo-600/20 text-indigo-400">
                                      <PiCheckBold className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="p-1 rounded-lg hover:bg-gray-700 text-gray-400">
                                      <PiXBold className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => { switchChat(chat.id); setPopoverChatId(null); }}
                                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 group/item ${activeChatId === chat.id ? "bg-indigo-600/20 text-indigo-400" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`}
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${activeChatId === chat.id ? "bg-indigo-600/20" : "bg-gray-700 group-hover/item:bg-gray-800"}`}>
                                      <PiChatCircleTextBold className={`w-4 h-4 ${activeChatId === chat.id ? "text-indigo-400" : "text-gray-500"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-medium truncate">{chat.title}</p>
                                        {chat.pinned && <PiPushPinSimpleBold className="w-3 h-3 text-indigo-400 shrink-0" />}
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <PiClockBold className="w-3 h-3 text-gray-500" />
                                        <p className="text-[11px] text-gray-500">{formatDate(chat.updatedAt)}</p>
                                      </div>
                                    </div>
                                    {hoveredId === chat.id && editingId !== chat.id && (
                                      <div className="flex items-center gap-0.5 flex-shrink-0 animate-fade-in">
                                        <div
                                          onClick={(e) => { e.stopPropagation(); pinChat(chat.id); }}
                                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${chat.pinned ? "text-indigo-400 bg-indigo-600/20" : "hover:bg-gray-700 text-gray-300 hover:text-gray-200"}`}
                                        title={chat.pinned ? "Unpin" : "Pin"}
                                        >
                                          <PiPushPinSimpleBold className="w-3.5 h-3.5" />
                                        </div>
                                        <div
                                          onClick={(e) => { e.stopPropagation(); startRename(chat.id, chat.title); }}
                                          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                                        title="Rename"
                                        >
                                          <PiPencilSimpleBold className="w-3.5 h-3.5" />
                                        </div>
                                        <div
                                          onClick={(e) => { e.stopPropagation(); exportChat(chat.id, "markdown"); }}
                                          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
                                        title="Export"
                                        >
                                          <PiExportBold className="w-3.5 h-3.5" />
                                        </div>
                                        <div
                                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(chat.id); }}
                                          className="p-1.5 rounded-lg hover:bg-red-600/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                        title="Delete"
                                        >
                                          <PiTrashBold className="w-3.5 h-3.5" />
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                )}
                                {confirmDelete === chat.id && (
                                  <div className="fixed inset-0 z-10 bg-gray-900/80 backdrop-blur-sm animate-fade-in">
                                    <div className="fixed z-50 w-80 max-h-[70vh] bg-gray-900 border border-red-600/20 rounded-xl shadow-xl p-6 transform translate-middle top-1/2 left-1/2">
                                      <span className="text-xs text-gray-500 font-medium">Delete "{chat.title}"?</span>
                                      <div className="flex gap-4 mt-6">
                                        <button
                                          onClick={() => { deleteChat(chat.id); setConfirmDelete(null); }}
                                          className="rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors"
                                        >
                                          <PiCheckBold className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setConfirmDelete(null)} className="rounded-lg hover:bg-gray-700 text-gray-400 transition-colors">
                                          <PiXBold className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-700 flex items-center justify-center mb-3">
                              <PiChatCircleTextBold className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-500 text-center">No conversations yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                    </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={`pb-4 ${extended ? "px-3" : "px-2"}`}>
          <button
            onClick={() => setSettingsOpen(true)}
            className={`flex items-center gap-3 transition-all duration-200 ${extended ? "w-full px-3 py-2.5 rounded-xl hover:bg-gray-700 text-sm text-gray-400 hover:text-gray-300" : "w-12 h-12 mx-auto justify-center rounded-xl hover:bg-gray-700 text-gray-500"}`}
          >
            <PiGearSixBold className="w-5 h-5 opacity-60 shrink-0" />
            {extended && <span className="font-medium whitespace-nowrap">Settings</span>}
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar ── */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-[300px] flex flex-col bg-gray-900 border-r border-gray-700 lg:hidden animate-slide-in shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <img
                src={theme === "dark" ? "/lumina-logo-light.png" : "/lumina-logo.png"}
                alt="Lumina"
                className="w-8 h-8 rounded-xl shadow-[0_0_15px_var(--color-accent)/.2] object-cover"
              />
              <span className="text-lg font-bold text-gray-100 font-display tracking-tight whitespace-nowrap">Lumina</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-700 transition-colors">
              <PiXBold className="w-5 h-5 text-gray-400" />
              </button>
          </div>
          <div className="px-4 mt-3">
            <button
              onClick={() => { createChat(); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/20 hover:from-indigo-600/25 hover:to-purple-600/25 active:scale-[0.98] transition-all duration-200"
            >
              <PiPlusBold className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-indigo-400 font-semibold whitespace-nowrap">New Chat</span>
            </button>
          </div>
          <div className="px-4 mt-2">
            <button
              onClick={() => { setSearchModalOpen(true); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-600/20 hover:from-indigo-600/25 hover:to-purple-600/25 hover:border-indigo-600/30 active:scale-[0.98] transition-all duration-200"
            >
              <PiMagnifyingGlassBold className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-indigo-400 font-semibold whitespace-nowrap">Search Chats</span>
            </button>
          </div>
          <ChatList mobile />
          <div className="px-3 pb-4">
            <button
              onClick={() => { setSettingsOpen(true); setSidebarOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-700 transition-colors w-full text-sm text-gray-400 font-medium"
            >
              <PiGearSixBold className="w-5 h-5 opacity-60" />
              <span className="whitespace-nowrap">Settings</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

export default Sidebar;