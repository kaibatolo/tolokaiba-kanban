import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
} from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CirclePause,
  Code2,
  Cpu,
  Ellipsis,
  ExternalLink,
  Filter,
  GitBranch,
  Globe,
  GripVertical,
  HardDrive,
  KeyRound,
  LayoutGrid,
  Layers3,
  List,
  LockKeyhole,
  Menu,
  Play,
  Plus,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SquareKanban,
  Trash2,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Agent = {
  id: string
  name: string
  description: string
  type: string
  model: string
  status: string
  tasks: number
  spend: number
  icon: string
  color: string
  team: string
  tools?: string
  instructions?: string
}
type Task = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  agent: string
  team: string
}
type Kit = {
  id: string
  name: string
  description: string
  type: string
  model: string
  tools: string
  code: string
  team: string
}
interface Log {
  title: string
  detail: string
  time: string
  icon: string
}
const initialAgents: Agent[] = [
  {
    id: "agt-001",
    name: "Atlas",
    description:
      "Your research partner. Finds the signal in the noise and turns it into actionable insights.",
    type: "Hermes Cloud",
    model: "Claude Sonnet 4.6",
    status: "Active",
    tasks: 124,
    spend: 18.42,
    icon: "sparkles",
    color: "rose",
    team: "Research",
  },
  {
    id: "agt-002",
    name: "Kepler",
    description:
      "Builds, reviews, and ships code. A second pair of eyes for your entire codebase.",
    type: "Boat VM",
    model: "GPT-5.4",
    status: "Active",
    tasks: 86,
    spend: 24.18,
    icon: "code",
    color: "blue",
    team: "Engineering",
  },
  {
    id: "agt-003",
    name: "Echo",
    description:
      "Keeps a pulse on the web. Monitors your sources and delivers what matters.",
    type: "Grok Bot",
    model: "Grok 4",
    status: "Active",
    tasks: 219,
    spend: 12.65,
    icon: "radio",
    color: "sage",
    team: "Research",
  },
  {
    id: "agt-004",
    name: "Scribe",
    description:
      "Connects your team's knowledge. Organizes, synthesizes, and never forgets.",
    type: "Hermes Cloud",
    model: "Claude Sonnet 4.6",
    status: "Idle",
    tasks: 67,
    spend: 8.36,
    icon: "book",
    color: "sand",
    team: "Knowledge",
  },
  {
    id: "agt-005",
    name: "Orion",
    description:
      "Your infrastructure co-pilot. Watches your VMs and keeps everything running.",
    type: "Boat VM",
    model: "GPT-5.4",
    status: "Needs attention",
    tasks: 43,
    spend: 16.92,
    icon: "cpu",
    color: "lavender",
    team: "Engineering",
  },
  {
    id: "agt-006",
    name: "Muse",
    description:
      "From a spark to a first draft. An imaginative partner for all your creative work.",
    type: "Grok Bot",
    model: "Grok 4",
    status: "Paused",
    tasks: 32,
    spend: 5.21,
    icon: "zap",
    color: "peach",
    team: "Design",
  },
]
const initialTasks: Task[] = [
  {
    id: "AG-104",
    title: "Map competitor pricing",
    description:
      "Collect pricing pages from the top 10 competitors and produce a comparison.",
    status: "Backlog",
    priority: "Medium",
    agent: "Atlas",
    team: "Research",
  },
  {
    id: "AG-105",
    title: "Refresh the knowledge index",
    description: "Re-index new documentation and remove outdated references.",
    status: "Backlog",
    priority: "Low",
    agent: "Scribe",
    team: "Knowledge",
  },
  {
    id: "AG-101",
    title: "Ship authentication middleware",
    description: "Add scoped authentication and rate limiting to API routes.",
    status: "In progress",
    priority: "High",
    agent: "Kepler",
    team: "Engineering",
  },
  {
    id: "AG-102",
    title: "Weekly market intelligence",
    description: "Prepare this week's research digest with source links.",
    status: "In progress",
    priority: "Medium",
    agent: "Echo",
    team: "Research",
  },
  {
    id: "AG-103",
    title: "Review VM memory limits",
    description: "Investigate elevated memory usage on boat-vm-02.",
    status: "Blocked",
    priority: "High",
    agent: "Orion",
    team: "Engineering",
  },
  {
    id: "AG-098",
    title: "Audit scraper output",
    description: "Validate extracted schemas and deduplicate results.",
    status: "Review",
    priority: "Medium",
    agent: "Atlas",
    team: "Research",
  },
  {
    id: "AG-096",
    title: "Connect GitHub workspace",
    description: "Connect the main repository and verify read access.",
    status: "Done",
    priority: "Low",
    agent: "Kepler",
    team: "Engineering",
  },
]
const initialKits: Kit[] = [
  {
    id: "kit-01",
    name: "Deep research",
    description:
      "A curious, thorough research agent with web search and source validation built in.",
    type: "Hermes Cloud",
    model: "Claude Sonnet 4.6",
    tools: "Web search, Browser, Knowledge graph",
    code: "Summarize findings with citations. Verify every source.",
    team: "Research",
  },
  {
    id: "kit-02",
    name: "Code companion",
    description:
      "Ship confidently with repository access, code review, and an isolated execution environment.",
    type: "Boat VM",
    model: "GPT-5.4",
    tools: "GitHub, Terminal, Code execution",
    code: "Review changes, run tests, and request approval before deploying.",
    team: "Engineering",
  },
  {
    id: "kit-03",
    name: "Site scraper",
    description:
      "Turn any website into structured knowledge with scheduled, respectful scraping.",
    type: "Grok Bot",
    model: "Grok 4",
    tools: "Browser, HTML parser, JSON export",
    code: "Extract title, URL, and main content. Respect robots.txt.",
    team: "Research",
  },
]
const defaultLogs: Log[] = [
  {
    title: "Atlas completed a task",
    detail: "Competitor landscape analysis",
    time: "2 min ago",
    icon: "check",
  },
  {
    title: "Kepler deployed a change",
    detail: "main · 3 files updated",
    time: "8 min ago",
    icon: "code",
  },
  {
    title: "Orion needs your attention",
    detail: "Memory usage above 85%",
    time: "12 min ago",
    icon: "cpu",
  },
  {
    title: "Echo found 12 new sources",
    detail: "Added to your knowledge graph",
    time: "24 min ago",
    icon: "radio",
  },
]
const icons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  code: Code2,
  radio: Radio,
  book: BookOpen,
  cpu: Cpu,
  zap: Zap,
  check: CheckCheck,
}
const colors: Record<string, string> = {
  rose: "bg-[#f4dce4] text-[#96506a]",
  blue: "bg-[#dfe8f0] text-[#547790]",
  sage: "bg-[#e0e9df] text-[#647e60]",
  sand: "bg-[#eee6d6] text-[#9a7c45]",
  lavender: "bg-[#e9e1f1] text-[#8a6ba4]",
  peach: "bg-[#f5e0d4] text-[#b17e61]",
}
const models = ["Claude Sonnet 4.6", "GPT-5.4", "Grok 4", "Gemini 3.1 Pro"]
const types = ["Hermes Cloud", "Boat VM", "Grok Bot"]
const navigation = [
  { path: "/", label: "Agents", icon: Bot },
  { path: "/operations", label: "Operations", icon: Activity },
  { path: "/kanban", label: "Kanban", icon: SquareKanban },
  { path: "/kits", label: "Kits & connections", icon: Boxes },
]

function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])
  return [value, setValue] as const
}
function IconButton({
  icon: Icon,
  label,
  onClick,
  className = "",
}: {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-secondary ${className}`}
    >
      <Icon size={17} strokeWidth={1.7} />
    </button>
  )
}
function Button({
  children,
  onClick,
  secondary,
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  secondary?: boolean
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
        secondary
          ? "border border-border bg-card/70 text-secondary-foreground hover:bg-secondary"
          : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
      } ${className}`}
    >
      {children}
    </button>
  )
}
function Badge({ status }: { status: string }) {
  const style =
    status === "Active" || status === "Done" || status === "Connected"
      ? "bg-success/10 text-success"
      : status === "Needs attention" || status === "Blocked"
        ? "bg-warning/10 text-warning"
        : status === "In progress" || status === "Review"
          ? "bg-primary/10 text-primary"
          : "bg-muted/70 text-muted-foreground"
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium ${style}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
      {hint && (
        <span className="text-xs font-normal text-muted-foreground">
          {hint}
        </span>
      )}
    </label>
  )
}
const inputClass =
  "w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm font-normal text-foreground transition focus:border-primary"
function Select({
  value,
  onChange,
  options,
  label,
  className = "",
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  label: string
  className?: string
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} ${className}`}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  )
}
function Modal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="modal-title"
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl"
    >
      <header className="flex items-start justify-between border-b border-border p-6">
        <div>
          <h2 id="modal-title" className="font-display text-xl font-semibold">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <IconButton icon={X} label="Close dialog" onClick={onClose} />
      </header>
      <div className="p-6">{children}</div>
    </dialog>
  )
}
function SectionTitle({
  title,
  children,
  eyebrow,
}: {
  title: string
  children?: ReactNode
  eyebrow?: string
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-base font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  )
}
interface EmptyProps {
  title: string
  description: string
}
function Empty({ title, description }: EmptyProps) {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <Search className="mx-auto mb-3 text-muted-foreground" size={24} />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function Workspace() {
  const location = useLocation()
  const navigate = useNavigate()
  const [agents, setAgents] = usePersistent("agnamo.agents.v1", initialAgents)
  const [tasks, setTasks] = usePersistent("agnamo.tasks.v1", initialTasks)
  const [kits, setKits] = usePersistent("agnamo.kits.v1", initialKits)
  const [statuses, setStatuses] = usePersistent("agnamo.statuses.v1", [
    "Backlog",
    "In progress",
    "Review",
    "Blocked",
    "Done",
    "Cancelled",
  ])
  const [connections, setConnections] = usePersistent<Record<string, boolean>>(
    "agnamo.connections.v1",
    { GitHub: true, Notion: true, Slack: false, "Web browser": true },
  )
  const [preferences, setPreferences] = usePersistent("agnamo.preferences.v1", {
    monthly: 150,
    daily: 15,
    model: "Claude Sonnet 4.6",
    alerts: true,
    approval: true,
  })
  const [profile, setProfile] = usePersistent("agnamo.profile.v1", {
    name: "Alex Morgan",
    email: "alex@studio.co",
    role: "Workspace owner",
  })
  const [mobileNav, setMobileNav] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [toast, setToast] = useState("")
  const [logs, setLogs] = useState(defaultLogs)
  const [agentEdit, setAgentEdit] = useState<Partial<Agent> | null>(null)
  const [taskEdit, setTaskEdit] = useState<Partial<Task> | null>(null)
  const [kitEdit, setKitEdit] = useState<Partial<Kit> | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Agent | null>(null)
  const [newStatus, setNewStatus] = useState<string | null>(null)
  const [agentStatus, setAgentStatus] = useState("All statuses")
  const [agentType, setAgentType] = useState("All types")
  const [agentView, setAgentView] = useState("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [taskPriority, setTaskPriority] = useState("All priorities")
  const [taskAgent, setTaskAgent] = useState("All agents")
  const [taskTeam, setTaskTeam] = useState("All teams")
  const [groupBy, setGroupBy] = useState("Status")
  const [kitTab, setKitTab] = useState("Agent kits")
  const [operationsTab, setOperationsTab] = useState("Overview")
  const [settingsTab, setSettingsTab] = useState("General")
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [newKey, setNewKey] = useState({ provider: "Anthropic", value: "" })
  const page = location.pathname.split("/")[1] || "agents"
  const pageNames: Record<string, string> = {
    agents: "Agents",
    operations: "Operations",
    kanban: "Kanban",
    kits: "Kits & connections",
    settings: "Settings",
    profile: "Your profile",
  }
  const activeCount = agents.filter((agent) => agent.status === "Active").length
  const totalSpend = agents.reduce((total, agent) => total + agent.spend, 0)
  const needsAttention = agents.filter(
    (agent) => agent.status === "Needs attention",
  )
  const notify = (message: string) => {
    setToast(message)
  }
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(""), 4500)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    setGlobalSearch(location.state?.search || "")
    setMobileNav(false)
    document.title = `${pageNames[page] || "Agents"} · Agnamo`
    document.documentElement.lang = "en"
  }, [location.pathname])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        document.getElementById("global-search")?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
  function record(title: string, detail: string, icon = "check") {
    setLogs((previous) =>
      [{ title, detail, time: "Just now", icon }, ...previous].slice(0, 12),
    )
  }
  function saveAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!agentEdit) return
    const name = agentEdit.name?.trim()
    if (!name || !agentEdit.description?.trim()) {
      notify("Add a name and purpose for your agent")
      return
    }
    if (
      agents.some(
        (agent) =>
          agent.id !== agentEdit.id &&
          agent.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      notify("Choose a unique name for this agent")
      return
    }
    const agent: Agent = {
      id: agentEdit.id || crypto.randomUUID(),
      name,
      description: agentEdit.description || "",
      type: agentEdit.type || types[0],
      model: agentEdit.model || preferences.model,
      status: agentEdit.status || "Idle",
      tasks: agentEdit.tasks || 0,
      spend: agentEdit.spend || 0,
      icon: agentEdit.icon || "sparkles",
      color: agentEdit.color || "rose",
      team: agentEdit.team?.trim() || "Research",
      tools: agentEdit.tools || "",
      instructions: agentEdit.instructions || "",
    }
    setAgents((previous) =>
      agentEdit.id
        ? previous.map((existing) =>
            existing.id === agent.id ? agent : existing,
          )
        : [...previous, agent],
    )
    const originalAgent = agents.find(
      (existing) => existing.id === agentEdit.id,
    )
    if (originalAgent && originalAgent.name !== agent.name) {
      setTasks((previous) =>
        previous.map((task) =>
          task.agent === originalAgent.name
            ? { ...task, agent: agent.name }
            : task,
        ),
      )
    }
    record(
      `${agent.name} ${agentEdit.id ? "updated" : "created"}`,
      `${agent.type} · ${agent.model}`,
    )
    notify(`${agent.name} ${agentEdit.id ? "updated" : "added to your fleet"}`)
    setAgentEdit(null)
  }
  function changeAgentStatus(agent: Agent) {
    const status = agent.status === "Active" ? "Paused" : "Active"
    setAgents((previous) =>
      previous.map((existing) =>
        existing.id === agent.id ? { ...existing, status } : existing,
      ),
    )
    record(
      `${agent.name} ${status.toLowerCase()}`,
      "Agent state updated locally",
    )
    notify(`${agent.name} is now ${status.toLowerCase()}`)
  }
  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!taskEdit) return
    if (!taskEdit.title?.trim()) {
      notify("Add a title to your task")
      return
    }
    const task: Task = {
      id: taskEdit.id || `AG-${crypto.randomUUID().slice(0, 5).toUpperCase()}`,
      title: taskEdit.title!.trim(),
      description: taskEdit.description || "",
      status: taskEdit.status || "Backlog",
      priority: taskEdit.priority || "Medium",
      agent: taskEdit.agent || agents[0]?.name || "Unassigned",
      team: taskEdit.team || "Engineering",
    }
    setTasks((previous) =>
      taskEdit.id
        ? previous.map((existing) =>
            existing.id === task.id ? task : existing,
          )
        : [...previous, task],
    )
    record(`Task ${taskEdit.id ? "updated" : "created"}`, task.title)
    notify("Task saved to your board")
    setTaskEdit(null)
  }
  function moveTask(id: string, value: string) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              ...(groupBy === "Status"
                ? { status: value }
                : groupBy === "Agent"
                  ? { agent: value }
                  : { team: value }),
            }
          : task,
      ),
    )
    notify(`Task moved to ${value}`)
  }
  function saveKit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!kitEdit) return
    if (!kitEdit.name?.trim() || !kitEdit.description?.trim()) {
      notify("Add a name and description for your kit")
      return
    }
    const kit: Kit = {
      id: kitEdit.id || crypto.randomUUID(),
      name: kitEdit.name!.trim(),
      description: kitEdit.description || "",
      type: kitEdit.type || types[0],
      model: kitEdit.model || models[0],
      tools: kitEdit.tools || "",
      code: kitEdit.code || "",
      team: kitEdit.team || "Research",
    }
    setKits((previous) =>
      kitEdit.id
        ? previous.map((existing) => (existing.id === kit.id ? kit : existing))
        : [...previous, kit],
    )
    notify("Agent kit saved")
    setKitEdit(null)
  }
  function deployKit(kit: Kit) {
    setAgentEdit({
      name: `${kit.name} agent`,
      description: kit.description,
      type: kit.type,
      model: kit.model,
      team: kit.team,
      status: "Idle",
      icon: kit.type === "Boat VM" ? "code" : "sparkles",
      color: "rose",
      tools: kit.tools,
      instructions: kit.code,
    })
  }

  const query = globalSearch.toLowerCase()
  const visibleAgents = agents.filter(
    (agent) =>
      `${agent.name} ${agent.description} ${agent.model} ${agent.team}`
        .toLowerCase()
        .includes(query) &&
      (agentStatus === "All statuses" || agent.status === agentStatus) &&
      (agentType === "All types" || agent.type === agentType),
  )
  const visibleTasks = tasks.filter(
    (task) =>
      `${task.title} ${task.id} ${task.description}`
        .toLowerCase()
        .includes(query) &&
      (taskPriority === "All priorities" || task.priority === taskPriority) &&
      (taskAgent === "All agents" || task.agent === taskAgent) &&
      (taskTeam === "All teams" || task.team === taskTeam),
  )
  const teamOptions = [
    ...new Set([
      ...agents.map((agent) => agent.team),
      ...tasks.map((task) => task.team),
    ]),
  ]
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")

  return (
    <div className="min-h-dvh">
      <a
        href="#workspace-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-card px-4 py-3 text-sm text-primary focus:translate-y-0"
      >
        Skip to workspace content
      </a>
      {mobileNav && (
        <button
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-rail/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-rail text-[#f5e8ee] transition-transform duration-200 ${
          mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <NavLink to="/" className="flex h-[82px] items-center gap-3 px-6">
          <span className="flex size-8 items-center justify-center rounded-lg border border-[#ae7895]/40 bg-[#70415b]/40">
            <Layers3 size={20} className="text-[#e9afc6]" />
          </span>
          <span className="font-display text-[23px] font-semibold tracking-[-0.04em]">
            agnamo<span className="text-[#c581a2]">.</span>
          </span>
        </NavLink>
        <button
          onClick={() => notify("You're in Studio workspace — local demo")}
          className="mx-4 mb-8 flex items-center gap-3 rounded-lg border border-[#684654]/45 bg-white/[0.035] p-3 text-left"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#f3dce5] text-sm font-semibold text-primary">
            S
          </span>
          <span className="flex-1">
            <span className="block whitespace-nowrap text-[11px] font-semibold">
              Studio
            </span>
            <span className="whitespace-nowrap text-[9px] text-rail-muted">
              Personal workspace
            </span>
          </span>
          <ChevronDown size={14} className="text-rail-muted" />
        </button>
        <p className="px-7 font-mono text-[9px] tracking-[0.16em] text-rail-muted">
          COMMAND CENTER
        </p>
        <nav className="mt-3 space-y-1 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `group flex min-h-11 items-center gap-3 rounded-lg px-4 text-[13px] transition ${
                  isActive
                    ? "bg-[#6a3b53] text-[#fff1f5] shadow-[inset_0_1px_0_#8d5c76]"
                    : "text-rail-muted hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={18} strokeWidth={1.6} />
              <span className="flex-1">{item.label}</span>
              {item.label === "Agents" && (
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
                  {agents.length.toString().padStart(2, "0")}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mx-5 mt-8 border-t border-white/10" />
        <p className="mt-6 px-7 font-mono text-[9px] tracking-[0.16em] text-rail-muted">
          WORKSPACE
        </p>
        <nav className="mt-3 space-y-1 px-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-4 text-[13px] ${
                isActive
                  ? "bg-[#6a3b53] text-white"
                  : "text-rail-muted hover:bg-white/5"
              }`
            }
          >
            <Settings2 size={18} strokeWidth={1.6} />
            Settings
          </NavLink>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-[13px] text-rail-muted hover:bg-white/5"
          >
            <CircleHelp size={18} strokeWidth={1.6} />
            Help & docs
            <ArrowUpRight className="ml-auto" size={13} />
          </button>
        </nav>
        <div className="mt-auto px-5 pb-5 pt-10">
          <div className="rounded-xl border border-[#8c5b70]/40 bg-gradient-to-br from-[#4c2e40] to-[#382631] p-4">
            <div className="flex items-center gap-2 text-[12px] font-medium">
              <Zap size={14} className="text-[#e4b29c]" />
              Good work, in motion.
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-rail-muted">
              A little autonomy.
              <br />A lot of possibility.
            </p>
            <button
              onClick={() => navigate("/operations")}
              className="mt-3 flex items-center gap-2 text-[11px] text-[#ebc5d6]"
            >
              Explore your operations
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="mt-5 flex items-center gap-2 px-1 font-mono text-[9px] text-rail-muted">
            <span className="size-1.5 rounded-full bg-[#97b7a0]" />
            LOCAL DEMO<span className="ml-auto">v.0.9.4</span>
          </div>
        </div>
        <NavLink
          to="/profile"
          className="flex items-center gap-3 border-t border-white/10 px-5 py-4 hover:bg-white/5"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-[#af7085] text-[11px] font-semibold">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold">
              {profile.name}
            </span>
            <span className="text-[10px] text-rail-muted">Workspace owner</span>
          </span>
          <ChevronRight size={15} className="text-rail-muted" />
        </NavLink>
      </aside>

      <div className="lg:pl-[220px]">
        <header className="relative z-30 flex min-h-[70px] items-center justify-between gap-3 border-b border-border bg-card/70 px-4 backdrop-blur-lg sm:px-8">
          <div className="flex items-center gap-2 text-xs">
            <IconButton
              icon={Menu}
              label="Open navigation"
              onClick={() => setMobileNav(true)}
              className="lg:hidden"
            />
            <span className="hidden text-muted-foreground sm:inline">
              Workspace
            </span>
            <ChevronRight
              size={13}
              className="hidden text-muted-foreground/70 sm:inline"
            />
            <span className="max-w-[45px] truncate font-medium sm:max-w-none">
              {pageNames[page] || "Agents"}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-5">
            <div className="flex h-9 max-w-[230px] items-center gap-2 rounded-lg border border-border bg-background/80 px-3">
              <Search size={15} className="shrink-0 text-muted-foreground" />
              <input
                id="global-search"
                aria-label="Search workspace"
                placeholder={
                  page === "kanban" ? "Search tasks..." : "Search anything..."
                }
                value={globalSearch}
                onChange={(event) => {
                  setGlobalSearch(event.target.value)
                  if (!["agents", "kanban", "kits"].includes(page))
                    navigate("/", { state: { search: event.target.value } })
                }}
                className="w-[60px] min-w-0 bg-transparent text-xs placeholder:text-muted-foreground focus-visible:ring-0 sm:w-[140px]"
              />
              <kbd className="hidden rounded border border-border px-1 font-mono text-[9px] text-muted-foreground sm:block">
                ⌘ K
              </kbd>
            </div>
            <div className="relative">
              <IconButton
                icon={Bell}
                label="Notifications"
                onClick={() => setNotificationOpen(!notificationOpen)}
              />
              <span className="pointer-events-none absolute right-2 top-1.5 size-1.5 rounded-full bg-primary" />
            </div>
            <NavLink
              to="/profile"
              aria-label="Your profile"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-card bg-[#eacbd2] text-[10px] font-bold text-primary"
            >
              {initials}
            </NavLink>
          </div>
          {notificationOpen && (
            <div className="absolute right-4 top-16 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-border bg-card p-5 shadow-xl">
              <SectionTitle title="Notifications">
                <IconButton
                  icon={X}
                  label="Close notifications"
                  onClick={() => setNotificationOpen(false)}
                />
              </SectionTitle>
              {logs.slice(0, 3).map((log, index) => (
                <div key={index} className="border-t border-border py-3">
                  <p className="text-sm font-medium">{log.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {log.detail} · {log.time}
                  </p>
                </div>
              ))}
              <button
                onClick={() => {
                  setNotificationOpen(false)
                  navigate("/operations")
                }}
                className="mt-2 text-xs font-semibold text-primary"
              >
                View operations →
              </button>
            </div>
          )}
        </header>

        <main
          id="workspace-content"
          className="canvas-glow min-h-[calc(100dvh-70px)] px-4 pb-6 pt-7 sm:px-8 sm:pt-9 xl:px-10"
        >
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="h-px w-5 bg-primary/50" />
                  {page === "agents"
                    ? "YOUR AUTONOMOUS WORKFORCE"
                    : "STUDIO / COMMAND CENTER"}
                </div>
                <h1 className="font-display text-[30px] font-semibold tracking-[-0.035em] sm:text-[34px]">
                  {page === "agents"
                    ? "A place for your agents."
                    : page === "operations"
                      ? "Every moving part, in view."
                      : page === "kanban"
                        ? "Good work, moving forward."
                        : page === "kits"
                          ? "Built to work together."
                          : page === "settings"
                            ? "Make it your workspace."
                            : "You're in control."}
                </h1>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  {page === "agents"
                    ? "Give them a purpose. Let them do their thing. Stay in control."
                    : page === "operations"
                      ? "Follow the work, understand the spend, and keep your fleet healthy."
                      : page === "kanban"
                        ? "A shared rhythm for your agents, your team, and every next step."
                        : page === "kits"
                          ? "Reusable starting points. Meaningful connections. Endless possibilities."
                          : page === "settings"
                            ? "Your preferences, limits, and connections — all in one place."
                            : "Manage your identity and understand your workspace security."}
                </p>
              </div>
              <div className="pt-3">
                {page === "agents" ? (
                  <Button onClick={() => setAgentEdit({})}>
                    <Plus size={16} />
                    Create agent
                  </Button>
                ) : page === "kanban" ? (
                  <Button onClick={() => setTaskEdit({})}>
                    <Plus size={16} />
                    New task
                  </Button>
                ) : page === "kits" ? (
                  <Button onClick={() => setKitEdit({})}>
                    <Plus size={16} />
                    Build a kit
                  </Button>
                ) : page === "operations" ? (
                  <span className="flex items-center gap-2 rounded-full border border-success/20 bg-card/60 px-3 py-2 text-xs text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    Demo telemetry
                  </span>
                ) : null}
              </div>
            </div>

            {page === "agents" && (
              <>
                <div className="status-glow mb-8 grid grid-cols-2 rounded-xl border border-primary/10 px-3 py-5 sm:px-5 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
                  <div className="flex items-center gap-4 px-3 sm:px-5">
                    <span className="font-display text-[40px] font-semibold leading-none text-primary">
                      {agents.length.toString().padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-xs font-semibold">
                        Agents in your fleet
                      </p>
                      <p className="mt-1.5 text-[10px] text-secondary-foreground">
                        A team that grows with you
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-l border-primary/10 px-4 sm:px-6">
                    <span className="flex size-9 items-center justify-center rounded-full bg-card/50 text-success">
                      <Activity size={17} />
                    </span>
                    <div>
                      <p className="text-[20px] font-semibold leading-none">
                        {activeCount}
                        <span className="ml-2 text-xs font-normal text-secondary-foreground">
                          active now
                        </span>
                      </p>
                      <p className="mt-2 text-[10px] text-secondary-foreground">
                        Ready for what's next
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 px-3 sm:px-5 xl:mt-0 xl:border-l xl:border-primary/10">
                    <span className="flex size-9 items-center justify-center rounded-full bg-card/50 text-primary">
                      <CheckCheck size={17} />
                    </span>
                    <div>
                      <p className="text-[20px] font-semibold leading-none">
                        {agents.reduce((sum, agent) => sum + agent.tasks, 0)}
                        <span className="ml-2 text-xs font-normal text-secondary-foreground">
                          tasks done
                        </span>
                      </p>
                      <p className="mt-2 text-[10px] text-secondary-foreground">
                        Small steps. Real progress.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 border-l border-primary/10 px-4 sm:px-6 xl:mt-0">
                    <span className="flex size-9 items-center justify-center rounded-full bg-card/50 text-warning">
                      <Zap size={17} />
                    </span>
                    <div>
                      <p className="text-[20px] font-semibold leading-none">
                        ${totalSpend.toFixed(2)}
                      </p>
                      <p className="mt-2 text-[10px] text-secondary-foreground">
                        of ${preferences.monthly} monthly limit
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-7 2xl:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_248px]">
                  <section className="min-w-0">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-[15px] font-semibold">
                          Your agents
                        </h2>
                        <span className="rounded-md bg-primary/7 px-2 py-0.5 font-mono text-[10px] text-primary">
                          {visibleAgents.length.toString().padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          label="Filter agents by status"
                          value={agentStatus}
                          onChange={setAgentStatus}
                          options={[
                            "All statuses",
                            "Active",
                            "Idle",
                            "Paused",
                            "Needs attention",
                          ]}
                          className="!w-auto !bg-card/60 !py-2 !text-[11px]"
                        />
                        <IconButton
                          icon={SlidersHorizontal}
                          label="Filter by agent type"
                          onClick={() => setFiltersOpen(!filtersOpen)}
                          className={`border border-border !size-8 ${
                            filtersOpen
                              ? "bg-accent text-primary"
                              : "bg-card/60"
                          }`}
                        />
                        <div className="flex rounded-lg border border-border bg-card/60 p-0.5">
                          <IconButton
                            icon={LayoutGrid}
                            label="Grid view"
                            onClick={() => setAgentView("grid")}
                            className={`!size-7 !rounded-md ${
                              agentView === "grid"
                                ? "bg-secondary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <IconButton
                            icon={List}
                            label="List view"
                            onClick={() => setAgentView("list")}
                            className={`!size-7 !rounded-md ${
                              agentView === "list"
                                ? "bg-secondary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    {filtersOpen && (
                      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3">
                        <Filter size={15} className="text-primary" />
                        <Select
                          label="Agent type"
                          value={agentType}
                          onChange={setAgentType}
                          options={["All types", ...types]}
                          className="!w-auto !py-1.5 !text-xs"
                        />
                        <button
                          onClick={() => {
                            setAgentType("All types")
                            setAgentStatus("All statuses")
                          }}
                          className="text-xs text-primary"
                        >
                          Reset filters
                        </button>
                      </div>
                    )}
                    <div
                      className={
                        agentView === "grid"
                          ? "grid gap-4 md:grid-cols-2 min-[86.25rem]:grid-cols-3"
                          : "grid gap-3"
                      }
                    >
                      {visibleAgents.map((agent) => {
                        const AgentIcon = icons[agent.icon] || Bot
                        return (
                          <article
                            key={agent.id}
                            className={`card-lift group overflow-hidden rounded-xl border border-border bg-card/85 ${
                              agentView === "list"
                                ? "sm:flex sm:items-center"
                                : ""
                            }`}
                          >
                            <div
                              className={`p-5 ${
                                agentView === "list" ? "flex-1" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`flex size-11 items-center justify-center rounded-xl ${colors[agent.color] || colors.rose}`}
                                >
                                  <AgentIcon size={23} strokeWidth={1.5} />
                                </span>
                                <div className="flex items-center gap-1">
                                  <Badge status={agent.status} />
                                  <IconButton
                                    icon={Ellipsis}
                                    label={`Edit ${agent.name}`}
                                    onClick={() => setAgentEdit(agent)}
                                    className="!size-6 text-muted-foreground"
                                  />
                                </div>
                              </div>
                              <div className="mt-4 flex items-center gap-2">
                                <button
                                  onClick={() => setAgentEdit(agent)}
                                  className="font-display text-[18px] font-semibold transition hover:text-primary"
                                >
                                  {agent.name}
                                </button>
                                <span className="rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
                                  {agent.type}
                                </span>
                              </div>
                              <p className="mt-2 min-h-[54px] text-[12px] leading-[1.6] text-muted-foreground">
                                {agent.description}
                              </p>
                              <div className="mt-4 flex items-center gap-1.5 font-mono text-[9px] text-secondary-foreground">
                                <span className="size-1 rounded-full bg-primary/50" />
                                {agent.model}
                                <span className="ml-auto rounded bg-background px-1.5 py-1 font-sans text-[9px] text-muted-foreground">
                                  {agent.team}
                                </span>
                              </div>
                            </div>
                            <div
                              className={`flex items-center justify-between gap-2 border-t border-border/70 bg-background/40 px-5 py-3.5 ${
                                agentView === "list"
                                  ? "sm:w-[220px] sm:flex-wrap sm:border-l sm:border-t-0"
                                  : ""
                              }`}
                            >
                              <div className="flex gap-4 text-[10px] text-muted-foreground">
                                <span>
                                  <span className="font-medium text-foreground">
                                    {agent.tasks}
                                  </span>{" "}
                                  tasks
                                </span>
                                <span>
                                  <span className="font-medium text-foreground">
                                    ${agent.spend.toFixed(2)}
                                  </span>{" "}
                                  spent
                                </span>
                              </div>
                              <button
                                aria-label={`${
                                  agent.status === "Active" ? "Pause" : "Start"
                                } ${agent.name}`}
                                onClick={() => changeAgentStatus(agent)}
                                className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-primary"
                              >
                                {agent.status === "Active" ? (
                                  <CirclePause size={15} />
                                ) : (
                                  <Play size={14} />
                                )}
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                    {visibleAgents.length === 0 && (
                      <Empty
                        title="No agents found"
                        description="Try another search or reset your filters."
                      />
                    )}
                    <button
                      onClick={() => setAgentEdit({})}
                      className="mt-4 flex min-h-[72px] w-full items-center justify-center gap-3 rounded-xl border border-dashed border-primary/25 bg-card/20 text-xs text-secondary-foreground transition hover:border-primary/60 hover:bg-card/60"
                    >
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/7">
                        <Plus size={15} />
                      </span>
                      There's room for your next big idea.
                      <span className="font-semibold text-primary">
                        Create an agent
                        <ArrowUpRight className="ml-1 inline" size={12} />
                      </span>
                    </button>
                    <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      <ShieldCheck size={13} className="text-success" />
                      Your agents work within the limits you set.
                      <button
                        onClick={() => navigate("/settings")}
                        className="ml-auto flex items-center gap-1 text-primary"
                      >
                        Manage permissions
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </section>
                  <aside className="grid content-start gap-5 sm:grid-cols-2 xl:grid-cols-1">
                    <section className="rounded-xl border border-border bg-card/60 p-5">
                      <SectionTitle title="Workspace pulse">
                        <span className="flex items-center gap-1.5 font-mono text-[8px] text-success">
                          <span className="size-1 rounded-full bg-success" />
                          DEMO
                        </span>
                      </SectionTitle>
                      <div className="flex items-center gap-2.5 rounded-lg bg-success/7 px-3 py-3 text-[11px] text-success">
                        <span className="flex size-5 items-center justify-center rounded-full bg-success/15">
                          <Check size={12} />
                        </span>
                        Core services operational
                      </div>
                      <div className="mt-5 space-y-3">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            Monthly budget
                          </span>
                          <span className="font-medium">
                            ${totalSpend.toFixed(2)}{" "}
                            <span className="text-muted-foreground">
                              / ${preferences.monthly}
                            </span>
                          </span>
                        </div>
                        <progress
                          value={totalSpend}
                          max={preferences.monthly}
                          className="h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          {Math.max(
                            0,
                            Math.round(
                              (1 - totalSpend / preferences.monthly) * 100,
                            ),
                          )}
                          % of your budget still available
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/operations")}
                        className="mt-5 flex w-full items-center justify-between border-t border-border pt-4 text-[11px] font-medium text-primary"
                      >
                        Open operations
                        <ArrowUpRight size={13} />
                      </button>
                    </section>
                    {needsAttention.length > 0 && (
                      <section className="rounded-xl border border-warning/20 bg-[#f7ecdf]/80 p-4">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-warning">
                          <Cpu size={15} />A little attention needed
                        </div>
                        <p className="mt-2 text-[11px] leading-relaxed text-secondary-foreground">
                          {needsAttention[0].name}'s VM is running low on
                          memory.
                        </p>
                        <button
                          onClick={() => {
                            navigate("/operations")
                            setOperationsTab("VM states")
                          }}
                          className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-warning"
                        >
                          Take a look
                          <ArrowRight size={11} />
                        </button>
                      </section>
                    )}
                    <section className="px-1 sm:col-span-2 xl:col-span-1">
                      <SectionTitle title="Recent activity">
                        <IconButton
                          icon={Ellipsis}
                          label="View all activity"
                          onClick={() => navigate("/operations")}
                          className="!size-6 text-muted-foreground"
                        />
                      </SectionTitle>
                      <div className="space-y-5">
                        {logs.slice(0, 4).map((log, index) => {
                          const LogIcon = icons[log.icon] || Check
                          return (
                            <div key={index} className="flex gap-3">
                              <div
                                className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                                  index === 2
                                    ? "bg-warning/10 text-warning"
                                    : "bg-primary/7 text-primary/70"
                                }`}
                              >
                                <LogIcon size={13} />
                              </div>
                              <div>
                                <p className="text-[11px] font-medium">
                                  {log.title}
                                </p>
                                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                                  {log.detail}
                                </p>
                                <p className="mt-1.5 font-mono text-[8px] text-muted-foreground/80">
                                  {log.time}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <button
                        onClick={() => navigate("/operations")}
                        className="mt-5 flex items-center gap-1 text-[10px] text-primary"
                      >
                        All activity
                        <ArrowRight size={11} />
                      </button>
                    </section>
                  </aside>
                </div>
              </>
            )}

            {page === "operations" && (
              <>
                <Tabs
                  tabs={[
                    "Overview",
                    "Knowledge graph",
                    "Objectives",
                    "VM states",
                  ]}
                  value={operationsTab}
                  onChange={setOperationsTab}
                />
                {operationsTab === "Overview" && (
                  <>
                    <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                      {[
                        {
                          label: "Spend this month",
                          value: `$${totalSpend.toFixed(2)}`,
                          note: `of $${preferences.monthly} budget`,
                          icon: Zap,
                        },
                        {
                          label: "Active agents",
                          value: `${activeCount} / ${agents.length}`,
                          note: "Across 3 agent types",
                          icon: Bot,
                        },
                        {
                          label: "Tasks completed",
                          value: agents.reduce(
                            (sum, agent) => sum + agent.tasks,
                            0,
                          ),
                          note: "99.2% success rate",
                          icon: CheckCheck,
                        },
                        {
                          label: "Needs attention",
                          value: needsAttention.length,
                          note: "Infrastructure issues",
                          icon: Cpu,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-border bg-card/80 p-5"
                        >
                          <div className="flex justify-between text-xs text-muted-foreground">
                            {stat.label}
                            <stat.icon size={16} className="text-primary/60" />
                          </div>
                          <p className="mt-4 font-display text-3xl font-semibold">
                            {stat.value}
                          </p>
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            {stat.note}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                      <section className="rounded-xl border border-border bg-card/80 p-5 sm:p-6">
                        <SectionTitle title="A month of good work">
                          <span className="rounded-lg bg-background px-3 py-1.5 text-xs text-muted-foreground">
                            September 2026
                          </span>
                        </SectionTitle>
                        <p className="mb-5 text-xs text-muted-foreground">
                          Daily spend · Sample telemetry
                        </p>
                        <div className="h-[250px] w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={Array.from({ length: 15 }, (_, index) => ({
                                day: `${index * 2 + 1}`,
                                spend: [
                                  1.2, 2.1, 1.6, 3.4, 2.9, 4.2, 2.7, 3.2, 4.8,
                                  3.9, 2.4, 3.6, 2.8, 4.2, 3.1,
                                ][index],
                              }))}
                            >
                              <defs>
                                <linearGradient
                                  id="spend-gradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#a05a75"
                                    stopOpacity={0.25}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#a05a75"
                                    stopOpacity={0.01}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                vertical={false}
                                stroke="#e7dedd"
                                strokeDasharray="3 3"
                              />
                              <XAxis
                                dataKey="day"
                                tick={{ fontSize: 10, fill: "#81717a" }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                tick={{ fontSize: 10, fill: "#81717a" }}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                                tickFormatter={(value) => `$${value}`}
                              />
                              <Tooltip
                                formatter={(value) => [
                                  `$${Number(value).toFixed(2)}`,
                                  "Spend",
                                ]}
                                labelFormatter={(value) => `September ${value}`}
                              />
                              <Area
                                type="monotone"
                                dataKey="spend"
                                stroke="#853b56"
                                strokeWidth={2}
                                fill="url(#spend-gradient)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </section>
                      <section className="rounded-xl border border-border bg-card/80 p-6">
                        <SectionTitle title="Spend by agent" />
                        {agents.map((agent) => (
                          <div key={agent.id} className="mb-4">
                            <div className="mb-2 flex justify-between text-xs">
                              <span>{agent.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                ${agent.spend.toFixed(2)}
                              </span>
                            </div>
                            <progress
                              value={agent.spend}
                              max={Math.max(
                                ...agents.map((item) => item.spend),
                                1,
                              )}
                              className="block h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:bg-primary/60 [&::-moz-progress-bar]:bg-primary/60"
                            />
                          </div>
                        ))}
                      </section>
                      <section className="rounded-xl border border-border bg-card/80 p-6">
                        <SectionTitle title="Activity log" />
                        {logs.map((log, index) => (
                          <div
                            key={index}
                            className="flex justify-between gap-4 border-t border-border py-3 text-xs"
                          >
                            <div>
                              <p className="font-medium">{log.title}</p>
                              <p className="mt-1 text-muted-foreground">
                                {log.detail}
                              </p>
                            </div>
                            <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                              {log.time}
                            </span>
                          </div>
                        ))}
                      </section>
                      <section className="rounded-xl border border-border bg-card/80 p-6">
                        <SectionTitle title="Agent issues">
                          <Badge status={`${needsAttention.length} open`} />
                        </SectionTitle>
                        {needsAttention.length ? (
                          needsAttention.map((agent) => (
                            <div
                              key={agent.id}
                              className="rounded-lg border border-warning/20 bg-warning/5 p-4"
                            >
                              <p className="text-sm font-medium">
                                {agent.name} · High memory usage
                              </p>
                              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                boat-vm-02 is using 87% of available memory.
                                Review its workload or restart the demo VM.
                              </p>
                              <Button
                                secondary
                                className="mt-4 !text-xs"
                                onClick={() => setOperationsTab("VM states")}
                              >
                                Inspect VM
                                <ArrowUpRight size={13} />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-success">
                            All issues resolved. Your fleet is healthy.
                          </p>
                        )}
                      </section>
                    </div>
                  </>
                )}
                {operationsTab === "Knowledge graph" && (
                  <section className="rounded-xl border border-border bg-card/80 p-6">
                    <SectionTitle title="Connected knowledge">
                      <span className="text-xs text-muted-foreground">
                        5 sources · 128 relationships · Sample data
                      </span>
                    </SectionTitle>
                    <div className="grid items-center gap-6 lg:grid-cols-[1fr_240px]">
                      <svg
                        viewBox="0 0 700 410"
                        className="w-full"
                        role="img"
                        aria-label="Knowledge graph showing Studio connected to research, code, documentation, market intelligence and agents"
                      >
                        <g stroke="#d1b9c3" strokeWidth="1.5">
                          {[
                            [170, 100],
                            [520, 80],
                            [580, 260],
                            [365, 350],
                            [100, 280],
                          ].map(([horizontal, vertical], index) => (
                            <line
                              key={index}
                              x1="340"
                              y1="195"
                              x2={horizontal}
                              y2={vertical}
                            />
                          ))}
                        </g>
                        {[
                          {
                            horizontal: 340,
                            vertical: 195,
                            label: "Studio",
                            radius: 52,
                            fill: "#853b56",
                            text: "#fff8fa",
                          },
                          {
                            horizontal: 170,
                            vertical: 100,
                            label: "Research",
                            radius: 42,
                            fill: "#f4dce4",
                            text: "#853b56",
                          },
                          {
                            horizontal: 520,
                            vertical: 80,
                            label: "GitHub",
                            radius: 40,
                            fill: "#dfe8f0",
                            text: "#547790",
                          },
                          {
                            horizontal: 580,
                            vertical: 260,
                            label: "Notion",
                            radius: 38,
                            fill: "#eee6d6",
                            text: "#9a7c45",
                          },
                          {
                            horizontal: 365,
                            vertical: 350,
                            label: "Agents",
                            radius: 38,
                            fill: "#e9e1f1",
                            text: "#8a6ba4",
                          },
                          {
                            horizontal: 100,
                            vertical: 280,
                            label: "Market",
                            radius: 40,
                            fill: "#e0e9df",
                            text: "#647e60",
                          },
                        ].map((node) => (
                          <g key={node.label}>
                            <circle
                              cx={node.horizontal}
                              cy={node.vertical}
                              r={node.radius + 8}
                              fill={node.fill}
                              opacity="0.25"
                            />
                            <circle
                              cx={node.horizontal}
                              cy={node.vertical}
                              r={node.radius}
                              fill={node.fill}
                            />
                            <text
                              x={node.horizontal}
                              y={node.vertical + 4}
                              textAnchor="middle"
                              fontSize="13"
                              fill={node.text}
                              fontFamily="Hanken Grotesk"
                            >
                              {node.label}
                            </text>
                          </g>
                        ))}
                      </svg>
                      <div>
                        <p className="font-display text-lg font-semibold">
                          Nothing works in isolation.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          Your agents connect research, repositories, and team
                          knowledge into a shared source of context.
                        </p>
                        <Button
                          secondary
                          className="mt-5"
                          onClick={() => {
                            navigate("/kits")
                            setKitTab("Connections")
                          }}
                        >
                          Manage sources
                          <ArrowRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </section>
                )}
                {operationsTab === "Objectives" && (
                  <section className="rounded-xl border border-border bg-card/80 p-6">
                    <SectionTitle title="Current major objectives" />
                    {[
                      {
                        name: "Launch the Studio agent workspace",
                        detail:
                          "Reliable infrastructure, connected sources, and a team ready to ship.",
                        done: tasks.filter((task) => task.status === "Done")
                          .length,
                        total: tasks.filter(
                          (task) => task.status !== "Cancelled",
                        ).length,
                      },
                      {
                        name: "Build a living knowledge base",
                        detail:
                          "Connect repositories, curate research, and keep the knowledge index fresh.",
                        done: connections.Notion ? 2 : 1,
                        total: 4,
                      },
                    ].map((objective) => (
                      <div
                        key={objective.name}
                        className="mb-5 rounded-lg border border-border p-5"
                      >
                        <div className="flex justify-between gap-4">
                          <h3 className="font-semibold">{objective.name}</h3>
                          <span className="font-mono text-xs text-primary">
                            {objective.done}/{objective.total}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {objective.detail}
                        </p>
                        <progress
                          value={objective.done}
                          max={Math.max(objective.total, 1)}
                          className="mt-5 h-2 w-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary"
                        />
                        <button
                          onClick={() => navigate("/kanban")}
                          className="mt-4 flex items-center gap-2 text-xs text-primary"
                        >
                          View related tasks
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </section>
                )}
                {operationsTab === "VM states" && (
                  <section className="rounded-xl border border-border bg-card/80 p-6">
                    <SectionTitle title="Virtual machines">
                      <span className="text-xs text-muted-foreground">
                        Local simulated infrastructure
                      </span>
                    </SectionTitle>
                    <div className="grid gap-4 md:grid-cols-2">
                      {agents
                        .filter((agent) => agent.type === "Boat VM")
                        .map((agent, index) => (
                          <div
                            key={agent.id}
                            className="rounded-xl border border-border p-5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-2 font-mono text-sm">
                                <HardDrive size={18} className="text-primary" />
                                boat-vm-0{index + 1}
                              </span>
                              <Badge status={agent.status} />
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground">
                              Assigned to {agent.name} · 4 vCPU · 8 GB RAM
                            </p>
                            <div className="my-5 grid grid-cols-2 gap-3">
                              <div className="rounded-lg bg-background p-3">
                                <p className="text-[10px] text-muted-foreground">
                                  CPU utilization
                                </p>
                                <p className="mt-1 font-display text-xl">
                                  {agent.status === "Paused" ? "0" : "24"}%
                                </p>
                              </div>
                              <div className="rounded-lg bg-background p-3">
                                <p className="text-[10px] text-muted-foreground">
                                  Memory usage
                                </p>
                                <p
                                  className={`mt-1 font-display text-xl ${
                                    agent.status === "Needs attention"
                                      ? "text-warning"
                                      : ""
                                  }`}
                                >
                                  {agent.status === "Needs attention"
                                    ? "87"
                                    : "42"}
                                  %
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                secondary
                                className="!text-xs"
                                onClick={() => changeAgentStatus(agent)}
                              >
                                {agent.status === "Paused" ? (
                                  <Play size={13} />
                                ) : (
                                  <CirclePause size={13} />
                                )}
                                {agent.status === "Paused" ? "Start" : "Pause"}
                              </Button>
                              <Button
                                className="!text-xs"
                                onClick={() => {
                                  setAgents((previous) =>
                                    previous.map((existing) =>
                                      existing.id === agent.id
                                        ? { ...existing, status: "Active" }
                                        : existing,
                                    ),
                                  )
                                  record(
                                    `${agent.name}'s VM restarted`,
                                    "Demo VM memory usage restored",
                                    "cpu",
                                  )
                                  notify(
                                    "Demo VM restarted — memory returned to normal",
                                  )
                                }}
                              >
                                Restart VM
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {page === "kanban" && (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      label="Filter by priority"
                      value={taskPriority}
                      onChange={setTaskPriority}
                      options={["All priorities", "High", "Medium", "Low"]}
                      className="!w-auto !bg-card !text-xs"
                    />
                    <Select
                      label="Filter by agent"
                      value={taskAgent}
                      onChange={setTaskAgent}
                      options={[
                        "All agents",
                        ...agents.map((agent) => agent.name),
                        "Unassigned",
                      ]}
                      className="!w-auto !bg-card !text-xs"
                    />
                    <Select
                      label="Filter by team"
                      value={taskTeam}
                      onChange={setTaskTeam}
                      options={["All teams", ...teamOptions]}
                      className="!w-auto !bg-card !text-xs"
                    />
                    <button
                      onClick={() => {
                        setTaskAgent("All agents")
                        setTaskPriority("All priorities")
                        setTaskTeam("All teams")
                        setGlobalSearch("")
                      }}
                      className="px-2 text-xs text-primary"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers3 size={14} />
                    Group by
                    <Select
                      label="Group tasks by"
                      value={groupBy}
                      onChange={setGroupBy}
                      options={["Status", "Agent", "Team"]}
                      className="!w-auto !bg-card !text-xs"
                    />
                  </div>
                </div>
                <div className="scroll-quiet flex gap-4 overflow-x-auto pb-5">
                  {(groupBy === "Status"
                    ? statuses
                    : groupBy === "Agent"
                      ? [...agents.map((agent) => agent.name), "Unassigned"]
                      : teamOptions
                  ).map((column) => {
                    const columnTasks = visibleTasks.filter(
                      (task) =>
                        (groupBy === "Status"
                          ? task.status
                          : groupBy === "Agent"
                            ? task.agent
                            : task.team) === column,
                    )
                    return (
                      <section
                        key={column}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault()
                          const id = event.dataTransfer.getData("text/plain")
                          if (tasks.some((task) => task.id === id))
                            moveTask(id, column)
                        }}
                        className="min-h-[430px] w-[260px] shrink-0 rounded-xl bg-secondary/45 p-3"
                      >
                        <div className="mb-4 flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`size-2 rounded-full ${
                                column === "Done"
                                  ? "bg-success"
                                  : column === "Blocked"
                                    ? "bg-warning"
                                    : "bg-primary/50"
                              }`}
                            />
                            <h2 className="text-xs font-semibold">{column}</h2>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {columnTasks.length}
                            </span>
                          </div>
                          <IconButton
                            icon={Plus}
                            label={`New task in ${column}`}
                            className="!size-6"
                            onClick={() =>
                              setTaskEdit(
                                groupBy === "Status"
                                  ? { status: column }
                                  : groupBy === "Agent"
                                    ? { agent: column }
                                    : { team: column },
                              )
                            }
                          />
                        </div>
                        <div className="space-y-3">
                          {columnTasks.map((task) => (
                            <article
                              key={task.id}
                              draggable
                              onDragStart={(event) =>
                                event.dataTransfer.setData(
                                  "text/plain",
                                  task.id,
                                )
                              }
                              className="card-lift rounded-lg border border-border bg-card p-4"
                            >
                              <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                                <span>{task.id}</span>
                                <GripVertical size={12} />
                              </div>
                              <button
                                onClick={() => setTaskEdit(task)}
                                className="my-3 text-left text-[13px] font-semibold leading-relaxed hover:text-primary"
                              >
                                {task.title}
                              </button>
                              <div className="mb-4 flex gap-2">
                                <span
                                  className={`rounded px-1.5 py-1 text-[9px] ${
                                    task.priority === "High"
                                      ? "bg-primary/10 text-primary"
                                      : task.priority === "Medium"
                                        ? "bg-warning/10 text-warning"
                                        : "bg-success/10 text-success"
                                  }`}
                                >
                                  {task.priority} priority
                                </span>
                                <span className="rounded bg-background px-1.5 py-1 text-[9px] text-muted-foreground">
                                  {task.team}
                                </span>
                              </div>
                              <div className="flex items-center justify-between border-t border-border pt-3">
                                <span className="flex items-center gap-1.5 text-[10px] text-secondary-foreground">
                                  <Bot size={12} />
                                  {task.agent}
                                </span>
                                <button
                                  onClick={() => setTaskEdit(task)}
                                  className="text-[10px] text-primary"
                                >
                                  Edit
                                  <ArrowUpRight
                                    className="ml-1 inline"
                                    size={10}
                                  />
                                </button>
                              </div>
                              {groupBy !== "Status" && (
                                <div className="mt-3">
                                  <Badge status={task.status} />
                                </div>
                              )}
                            </article>
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            setTaskEdit(
                              groupBy === "Status"
                                ? { status: column }
                                : groupBy === "Agent"
                                  ? { agent: column }
                                  : { team: column },
                            )
                          }
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/15 py-3 text-[11px] text-muted-foreground hover:bg-card"
                        >
                          <Plus size={13} />
                          Add task
                        </button>
                      </section>
                    )
                  })}
                  {groupBy === "Status" && (
                    <button
                      onClick={() => setNewStatus("")}
                      className="flex h-12 w-[170px] shrink-0 items-center justify-center gap-2 rounded-lg border border-dashed border-primary/25 text-xs text-primary"
                    >
                      <Plus size={14} />
                      New status
                    </button>
                  )}
                </div>
                <p className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <GripVertical size={13} />
                  Drag tasks between groups, or open a task to change its
                  status.
                </p>
              </>
            )}

            {page === "kits" && (
              <>
                <Tabs
                  tabs={["Agent kits", "Connections", "Deploy teams"]}
                  value={kitTab}
                  onChange={setKitTab}
                />
                {kitTab === "Agent kits" && (
                  <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    {kits
                      .filter((kit) =>
                        `${kit.name} ${kit.description} ${kit.tools}`
                          .toLowerCase()
                          .includes(query),
                      )
                      .map((kit, index) => (
                        <article
                          key={kit.id}
                          className="card-lift rounded-xl border border-border bg-card/80 p-6"
                        >
                          <div className="flex justify-between">
                            <span
                              className={`flex size-12 items-center justify-center rounded-xl ${Object.values(colors)[index % 6]}`}
                            >
                              <Boxes size={24} strokeWidth={1.5} />
                            </span>
                            <IconButton
                              icon={Ellipsis}
                              label={`Edit ${kit.name}`}
                              onClick={() => setKitEdit(kit)}
                            />
                          </div>
                          <h2 className="mt-5 font-display text-lg font-semibold">
                            {kit.name}
                          </h2>
                          <p className="mt-2 min-h-[64px] text-sm leading-relaxed text-muted-foreground">
                            {kit.description}
                          </p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {kit.tools.split(",").map((tool) => (
                              <span
                                key={tool}
                                className="rounded-md border border-border bg-background px-2 py-1 text-[10px] text-secondary-foreground"
                              >
                                {tool.trim()}
                              </span>
                            ))}
                          </div>
                          <div className="mt-5 border-t border-border pt-4">
                            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                              <Cpu size={13} />
                              {kit.model}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 !text-xs"
                                onClick={() => deployKit(kit)}
                              >
                                <Plus size={14} />
                                Create from kit
                              </Button>
                              <Button
                                secondary
                                className="!text-xs"
                                onClick={() => setKitEdit(kit)}
                              >
                                Edit kit
                              </Button>
                            </div>
                          </div>
                        </article>
                      ))}
                    <button
                      onClick={() => setKitEdit({})}
                      className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-card/20 p-8 text-center transition hover:bg-card/60"
                    >
                      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/7 text-primary">
                        <Plus size={24} />
                      </span>
                      <h2 className="font-display text-lg font-semibold">
                        Make it your own.
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        A kit for the way you work.
                      </p>
                    </button>
                  </div>
                )}
                {kitTab === "Connections" && (
                  <>
                    <div className="mb-5 flex items-start gap-3 rounded-lg border border-primary/15 bg-accent/30 p-4">
                      <ShieldCheck
                        size={18}
                        className="shrink-0 text-primary"
                      />
                      <p className="text-xs leading-relaxed text-secondary-foreground">
                        This is a local prototype. Connections below simulate
                        availability; no external accounts are accessed.
                        Credentials entered in Settings remain in this tab's
                        memory only.
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        {
                          name: "GitHub",
                          icon: GitBranch,
                          description:
                            "Repositories, pull requests, and everything you ship.",
                          scope: "Read repositories · Review code",
                        },
                        {
                          name: "Notion",
                          icon: BookOpen,
                          description:
                            "Your team's documents, connected to your agents.",
                          scope: "Read pages · Search workspace",
                        },
                        {
                          name: "Slack",
                          icon: Users,
                          description:
                            "Bring agent updates right into the conversation.",
                          scope: "Post notifications · Read channels",
                        },
                        {
                          name: "Web browser",
                          icon: Globe,
                          description:
                            "Search, browse, and scrape with a little curiosity.",
                          scope: "Search web · Extract public pages",
                        },
                      ].map((connection) => (
                        <article
                          key={connection.name}
                          className="rounded-xl border border-border bg-card/80 p-6"
                        >
                          <div className="flex justify-between">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                              <connection.icon size={22} />
                            </span>
                            <Badge
                              status={
                                connections[connection.name]
                                  ? "Connected"
                                  : "Not connected"
                              }
                            />
                          </div>
                          <h2 className="mt-4 font-display text-lg font-semibold">
                            {connection.name}
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {connection.description}
                          </p>
                          <p className="my-4 text-[10px] text-muted-foreground">
                            {connection.scope}
                          </p>
                          <Button
                            secondary
                            onClick={() => {
                              setConnections((previous) => ({
                                ...previous,
                                [connection.name]: !previous[connection.name],
                              }))
                              notify(
                                `${connection.name} ${
                                  connections[connection.name]
                                    ? "disconnected"
                                    : "connected"
                                } in demo mode`,
                              )
                            }}
                          >
                            {connections[connection.name]
                              ? "Disconnect"
                              : "Connect in demo"}
                            <ExternalLink size={13} />
                          </Button>
                        </article>
                      ))}
                    </div>
                  </>
                )}
                {kitTab === "Deploy teams" && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {teamOptions.map((team) => (
                      <section
                        key={team}
                        className="rounded-xl border border-border bg-card/80 p-6"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                            <Users size={20} />
                          </span>
                          <h2 className="font-display text-lg font-semibold">
                            {team}
                          </h2>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          {agents.filter((agent) => agent.team === team).length}{" "}
                          agents ·{" "}
                          {kits.filter((kit) => kit.team === team).length}{" "}
                          reusable kits
                        </p>
                        <div className="my-5 flex flex-wrap gap-2">
                          {agents
                            .filter((agent) => agent.team === team)
                            .map((agent) => (
                              <span
                                key={agent.id}
                                className="rounded-md bg-background px-3 py-1 text-xs text-secondary-foreground"
                              >
                                {agent.name}
                              </span>
                            ))}
                        </div>
                        <Button
                          secondary
                          onClick={() => {
                            const members = agents.filter(
                              (agent) => agent.team === team,
                            )
                            if (!members.length) {
                              notify("Add an agent to this team first")
                              return
                            }
                            setAgents((previous) =>
                              previous.map((agent) =>
                                agent.team === team
                                  ? { ...agent, status: "Active" }
                                  : agent,
                              ),
                            )
                            record(
                              `${team} team deployed`,
                              `${members.length} agents activated in local demo`,
                            )
                            notify(
                              `${members.length} ${team.toLowerCase()} agents activated`,
                            )
                          }}
                        >
                          <Play size={13} />
                          Deploy team in demo
                        </Button>
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}

            {page === "settings" && (
              <>
                <Tabs
                  tabs={["General", "Models & keys", "Integrations"]}
                  value={settingsTab}
                  onChange={setSettingsTab}
                />
                {settingsTab === "General" && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      notify("Workspace preferences saved")
                      record(
                        "Workspace limits updated",
                        `Monthly $${preferences.monthly} · Daily $${preferences.daily}`,
                      )
                    }}
                    className="max-w-3xl rounded-xl border border-border bg-card/80 p-6 sm:p-8"
                  >
                    <SectionTitle
                      title="Keep your autonomy in balance"
                      eyebrow="COST CONTROLS"
                    />
                    <p className="mb-6 text-sm text-muted-foreground">
                      Set sensible boundaries for your agents. These preferences
                      are stored locally in this prototype.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Monthly budget ($)">
                        <input
                          required
                          type="number"
                          min={1}
                          max={1000000}
                          value={preferences.monthly}
                          onChange={(event) =>
                            setPreferences({
                              ...preferences,
                              monthly: Number(event.target.value),
                            })
                          }
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Daily spending limit ($)">
                        <input
                          required
                          type="number"
                          min={1}
                          max={100000}
                          value={preferences.daily}
                          onChange={(event) =>
                            setPreferences({
                              ...preferences,
                              daily: Number(event.target.value),
                            })
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>
                    <div className="mt-6 border-t border-border">
                      <Toggle
                        title="Budget notifications"
                        description="Get notified when approaching your spending limit."
                        checked={preferences.alerts}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            alerts: !preferences.alerts,
                          })
                        }
                      />
                      <Toggle
                        title="Require approval for deployments"
                        description="Keep a human in the loop for production changes."
                        checked={preferences.approval}
                        onChange={() =>
                          setPreferences({
                            ...preferences,
                            approval: !preferences.approval,
                          })
                        }
                      />
                    </div>
                    <Button type="submit" className="mt-5">
                      <Check size={15} />
                      Save preferences
                    </Button>
                  </form>
                )}
                {settingsTab === "Models & keys" && (
                  <div className="max-w-3xl space-y-5">
                    <section className="rounded-xl border border-border bg-card/80 p-6">
                      <SectionTitle title="Preferred model" />
                      <p className="mb-4 text-sm text-muted-foreground">
                        The default starting point for new agents. You can
                        override it per agent.
                      </p>
                      <Select
                        label="Default model"
                        value={preferences.model}
                        options={models}
                        onChange={(value) => {
                          setPreferences({ ...preferences, model: value })
                          notify("Default model updated")
                        }}
                      />
                    </section>
                    <section className="rounded-xl border border-border bg-card/80 p-6">
                      <SectionTitle title="Provider keys">
                        <KeyRound size={18} className="text-primary" />
                      </SectionTitle>
                      <p className="mb-5 rounded-lg bg-accent/40 p-3 text-xs leading-relaxed text-secondary-foreground">
                        Keys are kept only in memory and cleared on reload. No
                        API requests are made. Production credentials require a
                        secure backend vault.
                      </p>
                      {Object.entries(apiKeys).map(([provider, key]) => (
                        <div
                          key={provider}
                          className="mb-3 flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <span className="text-sm">{provider}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            ••••••••{key.slice(-4)}
                          </span>
                          <IconButton
                            icon={Trash2}
                            label={`Remove ${provider} key`}
                            onClick={() => {
                              setApiKeys((previous) => {
                                const next = { ...previous }
                                delete next[provider]
                                return next
                              })
                              notify("Key removed from memory")
                            }}
                          />
                        </div>
                      ))}
                      <form
                        onSubmit={(event) => {
                          event.preventDefault()
                          setApiKeys((previous) => ({
                            ...previous,
                            [newKey.provider]: newKey.value,
                          }))
                          setNewKey({ ...newKey, value: "" })
                          notify("Key held in this tab's memory only")
                        }}
                        className="grid gap-4"
                      >
                        <Field label="Provider">
                          <Select
                            label="Key provider"
                            value={newKey.provider}
                            options={["Anthropic", "OpenAI", "xAI", "Google"]}
                            onChange={(provider) =>
                              setNewKey({ ...newKey, provider })
                            }
                          />
                        </Field>
                        <Field label="API key">
                          <input
                            required
                            minLength={8}
                            type="password"
                            autoComplete="off"
                            value={newKey.value}
                            onChange={(event) =>
                              setNewKey({
                                ...newKey,
                                value: event.target.value,
                              })
                            }
                            placeholder="Enter a test key"
                            className={inputClass}
                          />
                        </Field>
                        <Button type="submit" className="justify-self-start">
                          <Plus size={14} />
                          Add session key
                        </Button>
                      </form>
                    </section>
                  </div>
                )}
                {settingsTab === "Integrations" && (
                  <section className="max-w-3xl rounded-xl border border-border bg-card/80 p-6">
                    <SectionTitle title="Connected tools" />
                    {Object.entries(connections).map(([name, connected]) => (
                      <div
                        key={name}
                        className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-5"
                      >
                        <span className="font-medium">{name}</span>
                        <Badge
                          status={connected ? "Connected" : "Not connected"}
                        />
                        <Button
                          secondary
                          className="!text-xs"
                          onClick={() => {
                            setConnections((previous) => ({
                              ...previous,
                              [name]: !connected,
                            }))
                            notify(`${name} demo connection updated`)
                          }}
                        >
                          {connected ? "Disconnect" : "Connect in demo"}
                        </Button>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}

            {page === "profile" && (
              <div className="grid max-w-5xl gap-6 xl:grid-cols-[1.2fr_1fr]">
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    notify("Profile saved locally")
                  }}
                  className="rounded-xl border border-border bg-card/80 p-6 sm:p-8"
                >
                  <div className="mb-7 flex items-center gap-4">
                    <span className="flex size-16 items-center justify-center rounded-full bg-accent font-display text-xl text-primary">
                      {initials}
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-semibold">
                        {profile.name}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {profile.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <Field label="Full name">
                      <input
                        required
                        value={profile.name}
                        onChange={(event) =>
                          setProfile({ ...profile, name: event.target.value })
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email address">
                      <input
                        required
                        type="email"
                        value={profile.email}
                        onChange={(event) =>
                          setProfile({ ...profile, email: event.target.value })
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        readOnly
                        value={profile.role}
                        className={`${inputClass} opacity-60`}
                      />
                    </Field>
                  </div>
                  <Button type="submit" className="mt-7">
                    Save profile
                  </Button>
                </form>
                <section className="rounded-xl border border-border bg-card/80 p-6">
                  <SectionTitle title="Security, without guesswork">
                    <ShieldCheck size={20} className="text-success" />
                  </SectionTitle>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    This workspace is a local prototype, not an authenticated
                    service. Your browser stores demo data on this device.
                  </p>
                  <div className="mt-6 space-y-5">
                    {[
                      {
                        title: "Credential handling",
                        detail:
                          "Test keys stay in memory, never in local storage.",
                        icon: KeyRound,
                      },
                      {
                        title: "Human approval",
                        detail: preferences.approval
                          ? "Deployment approval preference is enabled."
                          : "Deployment approval preference is disabled.",
                        icon: ShieldCheck,
                      },
                      {
                        title: "Two-factor authentication",
                        detail:
                          "Requires production authentication. Not connected in this demo.",
                        icon: LockKeyhole,
                      },
                      {
                        title: "Current session",
                        detail: "Local browser · No remote session or account.",
                        icon: Globe,
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex gap-3 border-t border-border pt-4"
                      >
                        <item.icon
                          size={17}
                          className="shrink-0 text-primary"
                        />
                        <div>
                          <p className="text-xs font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setApiKeys({})
                      notify("All session keys cleared from memory")
                    }}
                    className="mt-6 flex items-center gap-2 text-xs font-medium text-primary"
                  >
                    <Trash2 size={13} />
                    Clear session credentials
                  </button>
                </section>
              </div>
            )}

            <footer className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5 font-mono text-[8px] tracking-[0.07em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-success" />
                YOUR WORKSPACE. YOUR RULES.
              </span>
              <span>
                MADE FOR A LITTLE MORE POSSIBILITY
                <span className="ml-3 text-primary">✳</span>
              </span>
            </footer>
          </div>
        </main>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[100] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border border-primary/20 bg-rail px-5 py-4 text-sm text-primary-foreground shadow-xl"
        >
          <Check size={17} className="shrink-0 text-[#b8d8c0]" />
          {toast}
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={14} className="ml-2" />
          </button>
        </div>
      )}

      {agentEdit && (
        <Modal
          title={
            agentEdit.id
              ? `Meet ${agentEdit.name}`
              : "A new member of your team."
          }
          subtitle="Give your agent a purpose and a little direction."
          onClose={() => setAgentEdit(null)}
        >
          <form onSubmit={saveAgent} className="space-y-4">
            <Field label="Agent name">
              <input
                required
                maxLength={50}
                autoFocus
                value={agentEdit.name || ""}
                placeholder="e.g. Atlas"
                onChange={(event) =>
                  setAgentEdit({ ...agentEdit, name: event.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Purpose & description">
              <textarea
                required
                rows={3}
                maxLength={500}
                value={agentEdit.description || ""}
                placeholder="What should this agent help you with?"
                onChange={(event) =>
                  setAgentEdit({
                    ...agentEdit,
                    description: event.target.value,
                  })
                }
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agent type">
                <Select
                  label="Agent type"
                  value={agentEdit.type || types[0]}
                  options={types}
                  onChange={(type) => setAgentEdit({ ...agentEdit, type })}
                />
              </Field>
              <Field label="Status">
                <Select
                  label="Agent status"
                  value={agentEdit.status || "Idle"}
                  options={["Active", "Idle", "Paused", "Needs attention"]}
                  onChange={(status) => setAgentEdit({ ...agentEdit, status })}
                />
              </Field>
            </div>
            <Field label="Model">
              <Select
                label="Agent model"
                value={agentEdit.model || preferences.model}
                options={models}
                onChange={(model) => setAgentEdit({ ...agentEdit, model })}
              />
            </Field>
            <Field label="Team">
              <input
                required
                value={agentEdit.team || "Research"}
                onChange={(event) =>
                  setAgentEdit({ ...agentEdit, team: event.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field
              label="Tools"
              hint="Comma-separated tools inherited from your kit."
            >
              <input
                value={agentEdit.tools || ""}
                onChange={(event) =>
                  setAgentEdit({ ...agentEdit, tools: event.target.value })
                }
                className={inputClass}
                placeholder="Web search, Browser, GitHub"
              />
            </Field>
            <Field label="Agent instructions / code">
              <textarea
                rows={3}
                value={agentEdit.instructions || ""}
                onChange={(event) =>
                  setAgentEdit({
                    ...agentEdit,
                    instructions: event.target.value,
                  })
                }
                className={`${inputClass} !font-mono !text-xs`}
                placeholder="How should this agent approach its work?"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agent icon">
                <Select
                  label="Agent icon"
                  value={agentEdit.icon || "sparkles"}
                  options={Object.keys(icons)}
                  onChange={(icon) => setAgentEdit({ ...agentEdit, icon })}
                />
              </Field>
              <Field label="Accent color">
                <Select
                  label="Accent color"
                  value={agentEdit.color || "rose"}
                  options={Object.keys(colors)}
                  onChange={(color) => setAgentEdit({ ...agentEdit, color })}
                />
              </Field>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-5">
              {agentEdit.id ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(agentEdit as Agent)
                    setAgentEdit(null)
                  }}
                  className="flex items-center gap-1.5 text-xs text-primary"
                >
                  <Trash2 size={13} />
                  Delete agent
                </button>
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  Local demo · No VM provisioned
                </span>
              )}
              <Button type="submit">
                <Check size={15} />
                {agentEdit.id ? "Save changes" : "Create agent"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {confirmDelete && (
        <Modal
          title={`Delete ${confirmDelete.name}?`}
          subtitle="This removes the agent from your local workspace."
          onClose={() => setConfirmDelete(null)}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            Their tasks will be kept and marked as unassigned. This action
            cannot be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button secondary onClick={() => setConfirmDelete(null)}>
              Keep agent
            </Button>
            <Button
              onClick={() => {
                setAgents((previous) =>
                  previous.filter((agent) => agent.id !== confirmDelete.id),
                )
                setTasks((previous) =>
                  previous.map((task) =>
                    task.agent === confirmDelete.name
                      ? { ...task, agent: "Unassigned" }
                      : task,
                  ),
                )
                notify(`${confirmDelete.name} removed`)
                setConfirmDelete(null)
              }}
            >
              Delete agent
            </Button>
          </div>
        </Modal>
      )}
      {taskEdit && (
        <Modal
          title={taskEdit.id ? taskEdit.id : "Make the next move."}
          subtitle="A clear task makes good work possible."
          onClose={() => setTaskEdit(null)}
        >
          <form onSubmit={saveTask} className="space-y-4">
            <Field label="Task title">
              <input
                required
                autoFocus
                maxLength={140}
                value={taskEdit.title || ""}
                onChange={(event) =>
                  setTaskEdit({ ...taskEdit, title: event.target.value })
                }
                className={inputClass}
                placeholder="What needs to happen?"
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                value={taskEdit.description || ""}
                onChange={(event) =>
                  setTaskEdit({ ...taskEdit, description: event.target.value })
                }
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <Select
                  label="Task status"
                  value={taskEdit.status || "Backlog"}
                  options={statuses}
                  onChange={(status) => setTaskEdit({ ...taskEdit, status })}
                />
              </Field>
              <Field label="Priority">
                <Select
                  label="Task priority"
                  value={taskEdit.priority || "Medium"}
                  options={["High", "Medium", "Low"]}
                  onChange={(priority) =>
                    setTaskEdit({ ...taskEdit, priority })
                  }
                />
              </Field>
            </div>
            <Field label="Assigned agent">
              <Select
                label="Assigned agent"
                value={taskEdit.agent || agents[0]?.name || "Unassigned"}
                options={[...agents.map((agent) => agent.name), "Unassigned"]}
                onChange={(agent) => setTaskEdit({ ...taskEdit, agent })}
              />
            </Field>
            <Field label="Team">
              <Select
                label="Task team"
                value={taskEdit.team || "Engineering"}
                options={teamOptions}
                onChange={(team) => setTaskEdit({ ...taskEdit, team })}
              />
            </Field>
            <div className="flex items-center justify-between border-t border-border pt-5">
              {taskEdit.id && taskEdit.status !== "Cancelled" ? (
                <button
                  type="button"
                  onClick={() => {
                    setTasks((previous) =>
                      previous.map((task) =>
                        task.id === taskEdit.id
                          ? { ...task, status: "Cancelled" }
                          : task,
                      ),
                    )
                    notify("Task cancelled — retained in the Cancelled column")
                    setTaskEdit(null)
                  }}
                  className="text-xs text-primary"
                >
                  Cancel task
                </button>
              ) : (
                <span />
              )}
              <Button type="submit">
                Save task
                <Check size={14} />
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {newStatus !== null && (
        <Modal
          title="A new way to move forward."
          subtitle="Add a custom status to your board."
          onClose={() => setNewStatus(null)}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const status = newStatus.trim()
              if (!status) return
              if (
                statuses.some(
                  (existing) => existing.toLowerCase() === status.toLowerCase(),
                )
              ) {
                notify("That status already exists")
                return
              }
              setStatuses([...statuses, status])
              setNewStatus(null)
              notify("Custom status added")
            }}
          >
            <Field label="Status name">
              <input
                required
                autoFocus
                maxLength={30}
                value={newStatus}
                onChange={(event) => setNewStatus(event.target.value)}
                className={inputClass}
                placeholder="e.g. Ready to deploy"
              />
            </Field>
            <Button type="submit" className="mt-5">
              Add status
            </Button>
          </form>
        </Modal>
      )}
      {kitEdit && (
        <Modal
          title={kitEdit.id ? "Fine-tune your kit." : "Build a starting point."}
          subtitle="Reusable tools and instructions for your next agent."
          onClose={() => setKitEdit(null)}
        >
          <form onSubmit={saveKit} className="space-y-4">
            <Field label="Kit name">
              <input
                autoFocus
                required
                value={kitEdit.name || ""}
                onChange={(event) =>
                  setKitEdit({ ...kitEdit, name: event.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                required
                rows={2}
                value={kitEdit.description || ""}
                onChange={(event) =>
                  setKitEdit({ ...kitEdit, description: event.target.value })
                }
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agent type">
                <Select
                  label="Kit agent type"
                  value={kitEdit.type || types[0]}
                  options={types}
                  onChange={(type) => setKitEdit({ ...kitEdit, type })}
                />
              </Field>
              <Field label="Team">
                <input
                  value={kitEdit.team || "Research"}
                  onChange={(event) =>
                    setKitEdit({ ...kitEdit, team: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Model">
              <Select
                label="Kit model"
                value={kitEdit.model || models[0]}
                options={models}
                onChange={(model) => setKitEdit({ ...kitEdit, model })}
              />
            </Field>
            <Field label="Tools" hint="Separate tools with commas.">
              <input
                value={kitEdit.tools || ""}
                placeholder="Web search, Browser, GitHub"
                onChange={(event) =>
                  setKitEdit({ ...kitEdit, tools: event.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Instructions / code snippet">
              <textarea
                rows={4}
                value={kitEdit.code || ""}
                onChange={(event) =>
                  setKitEdit({ ...kitEdit, code: event.target.value })
                }
                className={`${inputClass} !font-mono !text-xs`}
              />
            </Field>
            <div className="flex justify-end border-t border-border pt-5">
              <Button type="submit">
                Save kit
                <Check size={14} />
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {helpOpen && (
        <Modal
          title="A little direction."
          subtitle="Your quick guide to the command center."
          onClose={() => setHelpOpen(false)}
        >
          <div className="space-y-5 text-sm">
            {[
              {
                name: "Agents",
                text: "Create and edit agent cards. Pause or activate agents from each card. Changes stay in your browser.",
              },
              {
                name: "Operations",
                text: "Explore sample costs, infrastructure states, knowledge relationships, and objectives.",
              },
              {
                name: "Kanban",
                text: "Filter by priority, agent, or team. Group and drag tasks, create custom statuses, or cancel a ticket.",
              },
              {
                name: "Kits & connections",
                text: "Build reusable kits, create agents from them, and simulate team deployments and integrations.",
              },
            ].map((item) => (
              <div key={item.name}>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
            <p className="rounded-lg bg-accent/30 p-3 text-xs leading-relaxed text-primary">
              Prototype only: no agents run remotely, no external connections
              are made, and production authentication is not configured.
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div
      className="scroll-quiet mb-7 flex gap-6 overflow-x-auto border-b border-border"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange(tab)}
          className={`shrink-0 border-b-2 px-1 pb-3 pt-1 text-[13px] transition ${
            value === tab
              ? "border-primary font-semibold text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-label={title}
        aria-checked={checked}
        onClick={onChange}
        className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`size-5 rounded-full bg-card shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}
const router = createBrowserRouter([
  { path: "/", Component: Workspace },
  { path: "/operations", Component: Workspace },
  { path: "/kanban", Component: Workspace },
  { path: "/kits", Component: Workspace },
  { path: "/settings", Component: Workspace },
  { path: "/profile", Component: Workspace },
  { path: "*", element: <Navigate to="/" replace /> },
])
export default function App() {
  return <RouterProvider router={router} />
}
