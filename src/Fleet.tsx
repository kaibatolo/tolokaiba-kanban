import { useState } from "react"
import { Play, Square, RotateCcw, Trash2, Copy, Search, Settings, MessageSquare, Image, Video } from "lucide-react"

const ENDPOINT = "https://agency-install.kaibato.workers.dev"
const KEY = "agk_s2fgxiyrlcpzk3t1oz5n"

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
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [vibe, setVibe] = useState("")
  const [venice, setVenice] = useState("")
  const [telegram, setTelegram] = useState("")
  const [discordToken, setDiscordToken] = useState("")
  const [discordUsers, setDiscordUsers] = useState("")
  const [discordHome, setDiscordHome] = useState("")
  const [discordMention, setDiscordMention] = useState(false)
  const [discordRateLimited, setDiscordRateLimited] = useState(false)
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  const filtered = vms.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.id.includes(search))

  async function saveProfile() {
    if (!name.trim()) { setStatus("name required"); return }
    setSaving(true)
    setStatus("saving...")
    try {
      const res = await fetch(`${ENDPOINT}/profile`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), age: age || null, vibe, role: "companion", mode: "companion",
          venice_key: venice, telegram_token: telegram,
          discord: {
            bot_token: discordToken,
            allowed_users: discordUsers.split(",").map(s => s.trim()).filter(Boolean),
            home_channel: discordHome,
            mention_required: discordMention,
            rate_limited: discordRateLimited
          },
          character: { base: { name: name.trim(), age }, backstory: { life: { vibe } } }
        })
      })
      const data = await res.json()
      setStatus(data.ok ? `saved: ${data.id}` : `error: ${data.error || res.status}`)
    } catch (e) { setStatus(`fail: ${e.message}`) }
    setSaving(false)
  }

  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100">
      <div className="w-72 border-r border-zinc-800 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Search size={16} />
          <input className="flex-1 rounded bg-zinc-900 px-2 py-1 text-sm" placeholder="Search VMs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {filtered.map(vm => (
          <button key={vm.id} onClick={() => setSelected(vm)} className={`mb-1 w-full rounded px-3 py-2 text-left text-sm ${selected.id === vm.id ? "bg-zinc-800" : "hover:bg-zinc-900"}`}>
            <div className="font-medium">{vm.name}</div>
            <div className="text-xs text-zinc-400">{vm.state}</div>
          </button>
        ))}
      </div>
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="text-sm text-zinc-400">{selected.id} · {selected.state}</p>
          </div>
        </div>
        <div className="mb-6 rounded border border-zinc-800 p-4">
          <h3 className="mb-3 font-medium">Profile</h3>
          <div className="grid gap-2 text-sm">
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
            <textarea className="rounded bg-zinc-900 px-2 py-1" rows={2} placeholder="Vibe" value={vibe} onChange={e => setVibe(e.target.value)} />
          </div>
        </div>
        <div className="mb-6 rounded border border-zinc-800 p-4">
          <h3 className="mb-3 font-medium">Discord Bot</h3>
          <div className="grid gap-2 text-sm">
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Bot token" value={discordToken} onChange={e => setDiscordToken(e.target.value)} />
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Allowed users (comma)" value={discordUsers} onChange={e => setDiscordUsers(e.target.value)} />
            <input className="rounded bg-zinc-900 px-2 py-1" placeholder="Home channel ID" value={discordHome} onChange={e => setDiscordHome(e.target.value)} />
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={discordMention} onChange={e => setDiscordMention(e.target.checked)} /> Mention required</label>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={discordRateLimited} onChange={e => setDiscordRateLimited(e.target.checked)} /> Rate limited</label>
          </div>
        </div>
        <button onClick={saveProfile} disabled={saving} className="rounded bg-pink-600 px-4 py-1.5 text-sm disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
        {status && <p className="mt-2 text-xs text-zinc-400">{status}</p>}
      </div>
    </div>
  )
}
