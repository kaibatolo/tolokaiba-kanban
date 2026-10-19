import { useState } from "react"
import { Play, Square, RotateCcw, Trash2, Copy, Search, Settings, MessageSquare, Image, Video } from "lucide-react"

export default function Fleet() {
  const [vms] = useState([
    { id: "bx_46hc8czm", name: "boat.milli", state: "idle" },
    { id: "bx_pgxn94jk", name: "suno", state: "stopped" },
    { id: "bx_k3dg5xpg", name: "jinji", state: "stopped" },
    { id: "bx_3b28uasz", name: "kira", state: "stopped" },
  ])
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(vms[0])
  const [profileEnabled, setProfileEnabled] = useState(true)

  const filtered = vms.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.id.includes(search))

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100">
      {/* VM List */}
      <div className="w-72 border-r border-zinc-800 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Search size={16} />
          <input
            className="flex-1 rounded bg-zinc-900 px-2 py-1 text-sm"
            placeholder="Search VMs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {filtered.map(vm => (
          <button
            key={vm.id}
            onClick={() => setSelected(vm)}
            className={`mb-1 w-full rounded px-3 py-2 text-left text-sm ${selected.id === vm.id ? "bg-zinc-800" : "hover:bg-zinc-900"}`}
          >
            <div className="font-medium">{vm.name}</div>
            <div className="text-xs text-zinc-400">{vm.state}</div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="text-sm text-zinc-400">{selected.id} · {selected.state}</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded bg-green-600 px-3 py-1.5 text-sm"><Play size={14} className="inline" /> Start</button>
            <button className="rounded bg-yellow-600 px-3 py-1.5 text-sm"><Square size={14} className="inline" /> Stop</button>
            <button className="rounded bg-blue-600 px-3 py-1.5 text-sm"><RotateCcw size={14} className="inline" /> Restart</button>
            <button className="rounded bg-red-600 px-3 py-1.5 text-sm"><Trash2 size={14} className="inline" /> Delete</button>
            <button className="rounded bg-zinc-700 px-3 py-1.5 text-sm"><Copy size={14} className="inline" /> Clone</button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm">Enable profile config</label>
          <input type="checkbox" checked={profileEnabled} onChange={e => setProfileEnabled(e.target.checked)} />
        </div>

        {/* Profile Settings */}
        <div className="mb-6 rounded border border-zinc-800 p-4">
          <h3 className="mb-3 font-medium">Profile Settings</h3>
          <div className="grid gap-2 text-sm">
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Name" defaultValue="Search Doll" />
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Age" defaultValue="19" />
            <textarea className="rounded bg-zinc-900 px-2 py-1" rows={3} placeholder="Vibe / greeting" defaultValue="Bratty hyper-devoted search engine" />
            <button className="mt-2 w-fit rounded bg-pink-600 px-4 py-1.5 text-sm">Save</button>
          </div>
        </div>

        {/* Keys */}
        <div className="mb-6 rounded border border-zinc-800 p-4">
          <h3 className="mb-3 font-medium">Keys (global / profile / VM)</h3>
          <div className="grid gap-2 text-sm">
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Venice / xAI / OpenRouter key" />
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Discord bot token" />
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Telegram bot token" />
          </div>
        </div>
      </div>

      {/* Chat + Gen */}
      <div className="w-80 border-l border-zinc-800 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <MessageSquare size={16} /> Chat / Skills / Group
        </div>
        <div className="mb-4 h-40 rounded bg-zinc-900 p-2 text-xs text-zinc-400">Chat panel placeholder</div>
        <div className="flex gap-2">
          <button className="flex-1 rounded bg-zinc-800 px-2 py-1.5 text-xs"><Image size={12} className="inline" /> Image</button>
          <button className="flex-1 rounded bg-zinc-800 px-2 py-1.5 text-xs"><Video size={12} className="inline" /> Video</button>
        </div>
        <button className="mt-4 flex items-center gap-1 text-sm text-zinc-400"><Settings size={14} /> Settings</button>
      </div>
    </div>
  )
}
