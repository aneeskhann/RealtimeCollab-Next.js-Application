import { BsChatDotsFill, BsFillFileEarmarkTextFill, BsFillPaletteFill } from "react-icons/bs"
import { ChatPanel } from "@/components/room/chat-panel"
import { FilePanel } from "@/components/room/file-panel"
import { WhiteboardPanel } from "@/components/room/whiteboard-panel"

export const RoomPanelSwitcher = ({
  activePanel,
  isCollapsed,
  togglePanel,
  setCollapsed,
}: {
  activePanel: "chat" | "files" | "whiteboard" | null
  isCollapsed: boolean
  togglePanel: (panel: "chat" | "files" | "whiteboard") => void
  setCollapsed: (val: boolean) => void
}) => (
  <div className={`relative transition-all duration-500 ease-in-out ${activePanel ? "bg-gray-950" : "bg-gray-800/60 hover:bg-gray-700/60"} border-l border-indigo-900 bg-gradient-to-br from-slate-900 to-indigo-800 ${activePanel && !isCollapsed ? "w-1/2" : "w-12"} flex flex-col`}>
    {activePanel && (
      <div onClick={() => setCollapsed(!isCollapsed)} className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-full cursor-pointer z-20 flex items-center justify-center shadow-xl transition-all duration-300">
        <div className="text-xl font-bold rotate-180 transition-transform duration-300">⇌</div>
      </div>
    )}
    {(isCollapsed || !activePanel) && (
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <button onClick={() => togglePanel("chat")} title="Chat">
          <BsChatDotsFill className="text-blue-400 h-7 w-7 hover:scale-110 transition-transform" />
        </button>
        <button onClick={() => togglePanel("files")} title="Files">
          <BsFillFileEarmarkTextFill className="text-yellow-400 h-7 w-7 hover:scale-110 transition-transform" />
        </button>
        <button onClick={() => togglePanel("whiteboard")} title="Whiteboard">
          <BsFillPaletteFill className="text-pink-400 h-7 w-7 hover:scale-110 transition-transform" />
        </button>
      </div>
    )}
    {!isCollapsed && activePanel === "chat" && <div className="flex-1 overflow-y-auto p-4"><ChatPanel /></div>}
    {!isCollapsed && activePanel === "files" && <div className="flex-1 overflow-y-auto p-4"><FilePanel /></div>}
    {!isCollapsed && activePanel === "whiteboard" && <div className="flex-1 overflow-y-auto p-4"><WhiteboardPanel /></div>}
  </div>
)
