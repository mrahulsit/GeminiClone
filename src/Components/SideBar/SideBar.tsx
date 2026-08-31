import { useContext, useRef, useState } from "react";
import { Context } from "../../context/context";
import type { Chat } from "../../types";
import {
  PiPlusBold,
  PiMagnifyingGlassBold,
  PiChatCircleTextBold,
  PiGearSixBold,
  PiSignOutBold,
  PiTrashBold,
  PiPencilSimpleBold,
  PiCheckBold,
  PiXBold,
  PiPushPinSimpleBold,
  PiPushPinSlashBold,
  PiExportBold,
  PiFileCodeBold,
  PiDotsThreeVerticalBold,
  PiSunBold,
  PiMoonBold,
  PiSparkleBold,
  PiArrowLineLeftBold,
  PiArrowLineRightBold,
  PiClockBold,
} from "react-icons/pi";

/* ── Helpers ── */
interface Group {
  label: string;
  chats: Chat[];
}

const groupChats = (chats: Chat[]): Group[] => {
  const pinned = chats.filter((c) => c.pinned);
  const rest = chats
    .filter((c) => !c.pinned)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const now = Date.now();
  const day = 86400000;
  const today: Chat[] = [];
  const yesterday: Chat[] = [];
  const week: Chat[] = [];
  const older: Chat[] = [];

  for (const c of rest) {
    const diff = now - c.updatedAt;
    if (diff < day) today.push(c);
    else if (diff < 2 * day) yesterday.push(c);
    else if (diff < 7 * day) week.push(c);
    else older.push(c);
  }

  const groups: Group[] = [];
  if (pinned.length) groups.push({ label: "Pinned", chats: pinned.slice(0, 5) });
  if (today.length) groups.push({ label: "Today", chats: today });
  if (yesterday.length) groups.push({ label: "Yesterday", chats: yesterday });
  if (week.length) groups.push({ label: "Previous 7 days", chats: week });
  if (older.length) groups.push({ label: "Older", chats: older });
  return groups;
};

const formatDate = (ts: number) => {
  const d = new Date(ts);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (ts >= startOfDay) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  if (ts >= startOfDay - 86400000) return "Yesterday";
  if (ts >= startOfDay - 6 * 86400000) {
    return d.toLocaleDateString("en-US", { weekday: "short" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "U";

function Sidebar() {
  const {
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
    toggleTheme,
    pinChat,
    exportChat,
    logout,
    currentUser,
  } = useContext(Context);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [chatsPopoverOpen, setChatsPopoverOpen] = useState(false);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [chatsPopoverPos, setChatsPopoverPos] = useState({ top: 0, left: 0 });
  const [userPopoverPos, setUserPopoverPos] = useState({ bottom: 0, left: 0 });
  const [railHovered, setRailHovered] = useState(false);
  const chatsBtnRef = useRef<HTMLButtonElement>(null);
  const userBtnRef = useRef<HTMLButtonElement>(null);

  const groups = groupChats(filteredChats);
  const total = filteredChats.length;
  const pinnedCount = groups[0]?.label === "Pinned" ? groups[0].chats.length : 0;

  /* ── Actions ── */
  const handleRename = (id: string) => {
    if (editValue.trim()) renameChat(id, editValue.trim());
    setEditingId(null);
    setEditValue("");
  };

  const startRename = (id: string) => {
    const chat = filteredChats.find((c) => c.id === id);
    if (!chat) return;
    setMenuId(null);
    setEditingId(id);
    setEditValue(chat.title);
  };

  const openChatsPopover = () => {
    const rect = chatsBtnRef.current!.getBoundingClientRect();
    const vh = window.innerHeight;
    const maxPopHeight = Math.min(0.7 * vh, 600);
    const top = Math.min(rect.top - 4, vh - maxPopHeight - 24);
    setUserPopoverOpen(false);
    setChatsPopoverPos({ top, left: rect.right + 14 });
    setChatsPopoverOpen(true);
  };

  const openUserPopover = () => {
    const rect = userBtnRef.current!.getBoundingClientRect();
    setChatsPopoverOpen(false);
    setUserPopoverPos({ bottom: window.innerHeight - rect.bottom - 4, left: rect.right + 14 });
    setUserPopoverOpen(true);
  };

  /* ── Delete confirm modal ── */
  const DeleteConfirm = ({ chatId, title }: { chatId: string; title: string }) => (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
      <div className="w-80 bg-surface-1 border border-red-500/20 rounded-2xl shadow-2xl p-5 animate-scale-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <PiTrashBold className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-txt">Delete chat?</p>
            <p className="text-xs text-txt-muted">This can't be undone.</p>
          </div>
        </div>
        <p className="text-sm text-txt-secondary mb-5">
          "{title}" will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              deleteChat(chatId);
              cancelDelete();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-[0.98] transition-all"
          >
            Delete
          </button>
          <button
            onClick={cancelDelete}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-2 text-txt-secondary text-sm font-medium hover:bg-surface-3 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  const cancelDelete = () => setConfirmDelete(null);

  /* ── Rename inline input ── */
  const RenameInput = () => (
    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-2 ring-1 ring-accent/30 animate-fade-in">
      <input
        autoFocus
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleRename(editingId!);
          if (e.key === "Escape") setEditingId(null);
        }}
        className="flex-1 bg-transparent border-none outline-none text-sm text-txt font-medium"
      />
      <button onClick={() => handleRename(editingId!)} className="p-1 rounded-lg hover:bg-accent/15 text-accent">
        <PiCheckBold className="w-4 h-4" />
      </button>
      <button onClick={() => setEditingId(null)} className="p-1 rounded-lg hover:bg-surface-3 text-txt-muted">
        <PiXBold className="w-4 h-4" />
      </button>
    </div>
  );

  /* ── Kebab overflow menu ── */
  const OverflowMenu = ({ chat }: { chat: Chat }) => (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />
      <div className="absolute right-0 top-full mt-1 w-52 bg-surface-1 border border-border rounded-xl shadow-2xl shadow-black/30 z-50 animate-scale-in p-1.5">
        <button
          onClick={() => startRename(chat.id)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-txt-secondary hover:bg-surface-2 hover:text-txt transition-colors"
        >
          <PiPencilSimpleBold className="w-4 h-4" /> Rename
        </button>
        <button
          onClick={() => { exportChat(chat.id, "markdown"); setMenuId(null); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-txt-secondary hover:bg-surface-2 hover:text-txt transition-colors"
        >
          <PiExportBold className="w-4 h-4" /> Export · Markdown
        </button>
        <button
          onClick={() => { exportChat(chat.id, "json"); setMenuId(null); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-txt-secondary hover:bg-surface-2 hover:text-txt transition-colors"
        >
          <PiFileCodeBold className="w-4 h-4" /> Export · JSON
        </button>
        <div className="my-1 h-px bg-border" />
        <button
          onClick={() => { setMenuId(null); setConfirmDelete(chat.id); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <PiTrashBold className="w-4 h-4" /> Delete
        </button>
      </div>
    </>
  );

  /* ── Single chat row ── */
  const ChatRow = ({ chat, showActions }: { chat: Chat; showActions: boolean }) => {
    const isActive = activeChatId === chat.id;

    return (
      <div className="relative group/row">
        {editingId === chat.id ? (
          <RenameInput />
        ) : (
          <button
            onClick={() => { switchChat(chat.id); setMenuId(null); setChatsPopoverOpen(false); }}
            className={`w-full flex items-center gap-2.5 rounded-xl pl-2.5 pr-16 py-2 text-left transition-all duration-150 ${
              isActive
                ? "bg-accent/12 text-txt ring-1 ring-accent/25"
                : "text-txt-muted hover:bg-surface-2 hover:text-txt"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                isActive ? "bg-accent/20" : "bg-surface-2 group-hover/row:bg-surface-3"
              }`}
            >
              <PiChatCircleTextBold className={`w-4 h-4 ${isActive ? "text-accent" : "text-txt-muted"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium truncate">{chat.title}</p>
                {chat.pinned && <PiPushPinSimpleBold className="w-3 h-3 text-accent shrink-0" />}
              </div>
              <p className="flex items-center gap-1 text-[11px] text-txt-muted mt-0.5">
                <PiClockBold className="w-3 h-3" />
                {formatDate(chat.updatedAt)}
              </p>
            </div>
          </button>
        )}

        <div className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 ${
          showActions ? "flex" : "hidden group-hover/row:flex"
        }`}>
            <button
              onClick={(e) => { e.stopPropagation(); pinChat(chat.id); }}
              className={`p-1.5 rounded-lg transition-colors ${
                chat.pinned
                  ? "text-accent bg-accent/12"
                  : "text-txt-muted hover:bg-surface-3 hover:text-txt"
              }`}
              title={chat.pinned ? "Unpin" : "Pin"}
            >
              {chat.pinned ? <PiPushPinSlashBold className="w-3.5 h-3.5" /> : <PiPushPinSimpleBold className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuId(menuId === chat.id ? null : chat.id); }}
              className={`p-1.5 rounded-lg transition-colors ${
                menuId === chat.id ? "text-accent bg-surface-3" : "text-txt-muted hover:bg-surface-3 hover:text-txt"
              }`}
              title="More"
            >
              <PiDotsThreeVerticalBold className="w-3.5 h-3.5" />
            </button>
          </div>

        {menuId === chat.id && <OverflowMenu chat={chat} />}
        {confirmDelete === chat.id && <DeleteConfirm chatId={chat.id} title={chat.title} />}
      </div>
    );
  };

  /* ── Grouped list ── */
  const ChatList = () => (
    <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:thin]">
      {groups.length > 0 ? (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <p className="px-2 pt-1 text-[11px] font-semibold text-txt-muted uppercase tracking-wider">
                {group.label}
              </p>
              {group.label === "Pinned" && pinnedCount >= 1 && (
                <p className="px-2 pb-1 text-[10px] text-txt-muted -mt-1">{pinnedCount} pinned</p>
              )}
              {group.chats.map((chat) => (
                <ChatRow key={chat.id} chat={chat} showActions />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center mt-14 px-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center mb-3">
            <PiChatCircleTextBold className="w-6 h-6 text-txt-muted" />
          </div>
          <p className="text-sm text-txt-muted">No conversations yet</p>
          <p className="text-xs text-txt-muted/70 mt-1">Start a new chat to begin</p>
        </div>
      )}
    </div>
  );

  /* ── User footer ── */
  const UserActions = ({ compact }: { compact?: boolean }) => (
    <div className={`flex items-center ${compact ? "flex-col gap-1" : "gap-0.5"}`}>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-txt-muted hover:bg-surface-3 hover:text-txt transition-colors"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <PiSunBold className="w-4 h-4" /> : <PiMoonBold className="w-4 h-4" />}
      </button>
      <button
        onClick={() => setSettingsOpen(true)}
        className="p-2 rounded-lg text-txt-muted hover:bg-surface-3 hover:text-txt transition-colors"
        title="Settings"
      >
        <PiGearSixBold className="w-4 h-4" />
      </button>
      <button
        onClick={() => logout()}
        className="p-2 rounded-lg text-txt-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
        title="Sign out"
      >
        <PiSignOutBold className="w-4 h-4" />
      </button>
    </div>
  );

  const UserCard = () => (
    <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-surface-2 transition-colors">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-surface-0 text-sm font-bold flex-shrink-0">
        {initials(currentUser?.name || "U")}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-txt truncate">{currentUser?.name}</p>
        <p className="text-[11px] text-txt-muted truncate">{currentUser?.email}</p>
      </div>
      <UserActions />
    </div>
  );

  const logo = theme === "dark" ? "/lumina-logo-light.png" : "/lumina-logo.png";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        onMouseEnter={() => setRailHovered(true)}
        onMouseLeave={() => setRailHovered(false)}
        className={`hidden lg:flex flex-col h-screen bg-surface-0 border-r border-border transition-[width] duration-300 ease-in-out ${
          extended ? "w-[300px]" : "w-[76px]"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center pt-5 pb-3 ${extended ? "px-4 justify-between" : "justify-center"}`}>
          {extended ? (
            <>
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="Lumina" className="w-9 h-9 rounded-xl object-cover" />
                <div className="leading-tight">
                  <p className="text-base font-bold text-txt font-display tracking-tight">Lumina</p>
                  <p className="text-[10px] text-txt-muted font-medium">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setExtended(false)}
                className="p-2 rounded-lg text-txt-muted hover:bg-surface-2 hover:text-txt transition-colors"
                title="Collapse sidebar"
              >
                <PiArrowLineLeftBold className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setExtended(true)}
              className="p-1 rounded-full hover:bg-surface-2 transition-colors"
              title={railHovered ? "Open sidebar" : "Expand sidebar"}
            >
              {railHovered ? (
                <span className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center">
                  <PiArrowLineRightBold className="w-5 h-5 text-txt" />
                </span>
              ) : (
                <img src={logo} alt="Lumina" className="w-10 h-10 rounded-full object-cover" />
              )}
            </button>
          )}
        </div>

        {/* New chat + search */}
        <div className={`flex flex-col gap-2 ${extended ? "px-3" : "items-center px-2"}`}>
          {extended ? (
            <>
              <button
                onClick={() => createChat()}
                className="gradient-btn flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-semibold text-sm active:scale-[0.98]"
              >
                <PiPlusBold className="w-5 h-5" />
                New chat
              </button>
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-surface-1 border border-border text-sm text-txt-muted hover:text-txt-secondary hover:border-accent/40 focus:border-accent/40 focus:ring-1 focus:ring-accent/30 transition-all"
              >
                <PiMagnifyingGlassBold className="w-4 h-4 shrink-0" />
                Search chats
                {total > 0 && (
                  <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-surface-2 text-txt-muted">
                    {total}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => createChat()}
                className="gradient-btn w-11 h-11 rounded-full flex items-center justify-center text-white active:scale-95"
                title="New chat"
              >
                <PiPlusBold className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSearchModalOpen(true)}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-1 border border-border text-txt-muted hover:text-txt hover:border-accent/40 transition-all"
                title="Search chats"
              >
                <PiMagnifyingGlassBold className="w-5 h-5" />
              </button>
              <button
                ref={chatsBtnRef}
                onClick={() => (chatsPopoverOpen ? setChatsPopoverOpen(false) : openChatsPopover())}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-1 border border-border text-txt-muted hover:text-txt hover:border-accent/40 transition-all"
                title="All chats"
              >
                <PiChatCircleTextBold className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Chat list */}
        {extended ? (
          <div className="flex flex-col flex-1 min-h-0 mt-4">
            <ChatList />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Footer */}
        <div className={`pb-4 ${extended ? "px-3 pt-2 border-t border-border" : "flex justify-center pt-2"}`}>
          {extended ? (
            <UserCard />
          ) : (
            <>
              <button
                ref={userBtnRef}
                onClick={() => (userPopoverOpen ? setUserPopoverOpen(false) : openUserPopover())}
                className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-accent to-purple-500 text-surface-0 text-sm font-bold hover:scale-105 active:scale-95 transition-transform"
                title={`${currentUser?.name || "User"}`}
              >
                {initials(currentUser?.name || "U")}
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Chats popover (collapsed rail) */}
      {chatsPopoverOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setChatsPopoverOpen(false)} />
          <div
            className="fixed z-50 w-80 bg-surface-1 border border-border rounded-2xl shadow-2xl shadow-black/30 animate-scale-in overflow-hidden flex flex-col"
            style={{ top: chatsPopoverPos.top, left: chatsPopoverPos.left, maxHeight: "min(70vh, 600px)" }}
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <PiChatCircleTextBold className="w-4 h-4 text-accent" />
                <p className="text-sm font-semibold text-txt">Chats</p>
              </div>
              <span className="text-[11px] text-txt-muted">{total}</span>
            </div>
            <div className="flex-1 overflow-y-auto pt-3 px-1">
              {groups.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {groups.map((group) => (
                    <div key={group.label} className="flex flex-col gap-0.5">
                      <p className="px-2 text-[11px] font-semibold text-txt-muted uppercase tracking-wider">
                        {group.label}
                      </p>
                      {group.chats.map((chat) => (
                        <ChatRow key={chat.id} chat={chat} showActions />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <p className="text-sm text-txt-muted">No conversations yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* User popover (collapsed rail) */}
      {userPopoverOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setUserPopoverOpen(false)} />
          <div
            className="fixed z-50 w-60 bg-surface-1 border border-border rounded-2xl shadow-2xl shadow-black/30 animate-scale-in p-2"
            style={{ bottom: userPopoverPos.bottom, left: userPopoverPos.left }}
          >
            <div className="px-3 pt-2 pb-3 border-b border-border">
              <p className="text-sm font-semibold text-txt truncate">{currentUser?.name}</p>
              <p className="text-xs text-txt-muted truncate">{currentUser?.email}</p>
            </div>
            <div className="pt-2 flex flex-col gap-1">
              <button
                onClick={() => { setUserPopoverOpen(false); toggleTheme(); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-txt-secondary hover:bg-surface-2 hover:text-txt transition-colors"
              >
                {theme === "dark" ? <PiSunBold className="w-4 h-4" /> : <PiMoonBold className="w-4 h-4" />}
                {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              </button>
              <button
                onClick={() => { setUserPopoverOpen(false); setSettingsOpen(true); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-txt-secondary hover:bg-surface-2 hover:text-txt transition-colors"
              >
                <PiGearSixBold className="w-4 h-4" /> Settings
              </button>
              <button
                onClick={() => { setUserPopoverOpen(false); logout(); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <PiSignOutBold className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Mobile Sidebar ── */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-[300px] flex flex-col bg-surface-0 border-r border-border lg:hidden animate-slide-in shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between px-4 pt-5 pb-3">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Lumina" className="w-9 h-9 rounded-xl object-cover" />
              <div className="leading-tight">
                <p className="text-base font-bold text-txt font-display tracking-tight">Lumina</p>
                <p className="text-[10px] text-txt-muted font-medium">AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-surface-2 transition-colors">
              <PiXBold className="w-5 h-5 text-txt-muted" />
            </button>
          </div>

          <div className="px-3 flex flex-col gap-2">
            <button
              onClick={() => { createChat(); setSidebarOpen(false); }}
              className="gradient-btn flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-semibold text-sm active:scale-[0.98]"
            >
              <PiPlusBold className="w-5 h-5" />
              New chat
            </button>
            <button
              onClick={() => { setSearchModalOpen(true); setSidebarOpen(false); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-surface-1 border border-border text-sm text-txt-muted transition-all"
            >
              <PiMagnifyingGlassBold className="w-4 h-4" />
              Search chats
            </button>
          </div>

          <div className="flex flex-col flex-1 min-h-0 mt-4">
            <ChatList />
          </div>

          <div className="px-3 pb-4 pt-2 border-t border-border">
            <UserCard />
          </div>
        </aside>
      )}
    </>
  );
}

export default Sidebar;