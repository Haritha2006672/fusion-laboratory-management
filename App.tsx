
import Login from "./pages/Login";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  FlaskConical,
  Activity,
  Cpu,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Plus,
  X,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Thermometer,
  Gauge,
  Zap,
  ShieldCheck,
  User,
  BellRing,
  SlidersHorizontal,
  LockKeyhole,
  Save,
  Mail,
  Database,
  RefreshCw,
  MapPin,
  Timer,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getExperiments,
  createExperiment,
  getPlasmaLogs,
  createPlasmaLog,
  getDiagnostics,
  createDiagnostic,
  getEquipment,
  createEquipment,
  type Experiment as ApiExperiment,
  type PlasmaLog as ApiPlasmaLog,
  type Diagnostic as ApiDiagnostic,
  type Equipment as ApiEquipment,
} from "./services/api";

import "./App.css";

/* =========================
   TYPES
========================= */

type ExperimentStatus =
  | "Running"
  | "Scheduled"
  | "Completed";

type Experiment = {
  id: string;
  name: string;
  researcher: string;
  location: string;
  date: string;
  time: string;
  status: ExperimentStatus;
};

type PlasmaStatus =
  | "Stable"
  | "Monitoring"
  | "Warning";

type PlasmaLog = {
  id: string;
  experimentId?: string;
  experiment: string;
  researcher: string;
  temperature: string;
  pressure: string;
  density: string;
  magneticField: string;
  status: PlasmaStatus;
  date: string;
};

type DiagnosticSeverity =
  | "Critical"
  | "Warning"
  | "Normal";

type DiagnosticStatus =
  | "Open"
  | "Investigating"
  | "Resolved";

type Diagnostic = {
  id: string;
  equipmentId?: string;
  equipment: string;
  issue: string;
  severity: DiagnosticSeverity;
  status: DiagnosticStatus;
  value: string;
  researcher: string;
  date: string;
};

type EquipmentStatus =
  | "Operational"
  | "Maintenance"
  | "Standby";

type Equipment = {
  id: string;
  name: string;
  category: string;
  location: string;
  status: EquipmentStatus;
  utilization: number;
  lastMaintenance: string;
  nextMaintenance: string;
  condition: string;
};

/* =========================
   INITIAL DATA
========================= */

const initialExperiments: Experiment[] = [
  {
    id: "EXP-001",
    name: "Plasma Stability Test",
    researcher: "Dr. Arun",
    location: "Chamber A",
    date: "Oct 01, 2026",
    time: "10:30 AM",
    status: "Running",
  },
  {
    id: "EXP-002",
    name: "Magnetic Field Analysis",
    researcher: "Dr. Priya",
    location: "Chamber B",
    date: "Oct 01, 2026",
    time: "01:00 PM",
    status: "Scheduled",
  },
  {
    id: "EXP-003",
    name: "Thermal Diagnostics",
    researcher: "Dr. Karthik",
    location: "Lab 03",
    date: "Oct 01, 2026",
    time: "03:30 PM",
    status: "Completed",
  },
  {
    id: "EXP-004",
    name: "Plasma Density Measurement",
    researcher: "Dr. Meena",
    location: "Chamber A",
    date: "Oct 02, 2026",
    time: "09:00 AM",
    status: "Scheduled",
  },
];

const initialEquipment: Equipment[] = [
  {
    id: "EQ-001",
    name: "Fusion Chamber A",
    category: "Fusion System",
    location: "Chamber A",
    status: "Operational",
    utilization: 94,
    lastMaintenance: "Sep 20, 2026",
    nextMaintenance: "Oct 20, 2026",
    condition: "Excellent",
  },
  {
    id: "EQ-002",
    name: "Magnetic Coil B",
    category: "Magnetic System",
    location: "Chamber B",
    status: "Operational",
    utilization: 87,
    lastMaintenance: "Sep 18, 2026",
    nextMaintenance: "Oct 18, 2026",
    condition: "Excellent",
  },
  {
    id: "EQ-003",
    name: "Thermal Sensor 03",
    category: "Sensors",
    location: "Lab 03",
    status: "Maintenance",
    utilization: 68,
    lastMaintenance: "Sep 10, 2026",
    nextMaintenance: "Oct 03, 2026",
    condition: "Needs Attention",
  },
  {
    id: "EQ-004",
    name: "Cooling System 02",
    category: "Cooling System",
    location: "Lab 02",
    status: "Operational",
    utilization: 91,
    lastMaintenance: "Sep 25, 2026",
    nextMaintenance: "Oct 25, 2026",
    condition: "Good",
  },
  {
    id: "EQ-005",
    name: "Plasma Sensor 01",
    category: "Sensors",
    location: "Chamber A",
    status: "Standby",
    utilization: 42,
    lastMaintenance: "Sep 12, 2026",
    nextMaintenance: "Oct 12, 2026",
    condition: "Good",
  },
  {
    id: "EQ-006",
    name: "Vacuum Pump 01",
    category: "Vacuum System",
    location: "Lab 01",
    status: "Operational",
    utilization: 76,
    lastMaintenance: "Sep 28, 2026",
    nextMaintenance: "Oct 28, 2026",
    condition: "Good",
  },
];

const experimentActivity = [
  { month: "May", experiments: 18 },
  { month: "Jun", experiments: 24 },
  { month: "Jul", experiments: 31 },
  { month: "Aug", experiments: 28 },
  { month: "Sep", experiments: 36 },
  { month: "Oct", experiments: 42 },
];

const plasmaPerformance = [
  { time: "08:00", temperature: 4090, stability: 91 },
  { time: "10:00", temperature: 4250, stability: 94 },
  { time: "12:00", temperature: 4680, stability: 82 },
  { time: "14:00", temperature: 4420, stability: 89 },
  { time: "16:00", temperature: 4310, stability: 93 },
  { time: "18:00", temperature: 4260, stability: 95 },
];

const equipmentUtilization = [
  { name: "Fusion Chamber A", utilization: 94 },
  { name: "Cooling System 02", utilization: 91 },
  { name: "Magnetic Coil B", utilization: 87 },
  { name: "Vacuum Pump 01", utilization: 76 },
  { name: "Thermal Sensor 03", utilization: 68 },
];

const statusData = [
  { name: "Operational", value: 4 },
  { name: "Maintenance", value: 1 },
  { name: "Standby", value: 1 },
];

const COLORS = [
  "#4169e1",
  "#f59e0b",
  "#64748b",
];

/* =========================
   API HELPERS
========================= */

function formatExperimentDate(
  date: string
): string {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  const formatted = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return formatted.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
}

function formatExperimentTime(
  time: string
): string {
  if (!time) return "";

  const parts = time.split(":");

  if (parts.length < 2) {
    return time;
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return time;
  }

  const date = new Date();

  date.setHours(
    hour,
    minute,
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function formatPlasmaLogDate(
  date: string
): string {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function formatEquipmentDate(
  date?: string | null
): string {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
}

function convertExperiment(
  item: ApiExperiment
): Experiment {
  return {
    id: item.id,
    name: item.name,
    researcher: item.researcher,
    location: item.location,
    date: formatExperimentDate(
      item.experiment_date
    ),
    time: formatExperimentTime(
      item.experiment_time
    ),
    status:
      item.status as ExperimentStatus,
  };
}

function convertPlasmaLog(
  item: ApiPlasmaLog
): PlasmaLog {
  return {
    id: item.id,
    experimentId:
      item.experiment_id ?? undefined,
    experiment: item.experiment,
    researcher: item.researcher,
    temperature: item.temperature || "-",
    pressure: item.pressure || "-",
    density: item.density || "-",
    magneticField:
      item.magnetic_field || "-",
    status:
      item.status as PlasmaStatus,
    date: formatPlasmaLogDate(
      item.logged_at || ""
    ),
  };
}

function convertApiDiagnostic(
  item: ApiDiagnostic
): Diagnostic {
  return {
    id: item.id,
    equipmentId:
      item.equipment_id ?? undefined,
    equipment: item.equipment,
    issue: item.issue,
    severity:
      item.severity as DiagnosticSeverity,
    status:
      item.status as DiagnosticStatus,
    value: item.value,
    researcher: item.researcher,
    date: formatPlasmaLogDate(
      item.created_at || ""
    ),
  };
}

function convertEquipment(
  item: ApiEquipment
): Equipment {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    location: item.location,
    status:
      item.status as EquipmentStatus,
    utilization:
      Number(item.utilization) || 0,
    lastMaintenance:
      formatEquipmentDate(
        item.last_maintenance
      ),
    nextMaintenance:
      formatEquipmentDate(
        item.next_maintenance
      ),
    condition:
      item.condition || "-",
  };
}

/* =========================
   SMALL COMPONENTS
========================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`status-badge ${status.toLowerCase()}`}
    >
      {status}
    </span>
  );
}

function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {action}
    </div>
  );
}

/* =========================
   SIDEBAR
========================= */

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Experiments",
      path: "/experiments",
      icon: CalendarDays,
    },
    {
      name: "Plasma Logs",
      path: "/plasma-logs",
      icon: FlaskConical,
    },
    {
      name: "Diagnostics",
      path: "/diagnostics",
      icon: Activity,
    },
    {
      name: "Equipment",
      path: "/equipment",
      icon: Cpu,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <FlaskConical size={22} />
        </div>

        <div>
          <strong>Fusion</strong>
          <span>Laboratories</span>
        </div>
      </div>

      <div className="sidebar-label">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({
                isActive,
              }) =>
                `nav-item ${
                  isActive
                    ? "active"
                    : ""
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-card">
          <div className="system-dot" />

          <div>
            <strong>
              System Online
            </strong>

            <span>
              All services operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================
   TOPBAR
========================= */

function Topbar() {
  const [search, setSearch] =
    useState("");

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={17} />

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search experiments, equipment..."
        />

        {search && (
          <button
            onClick={() =>
              setSearch("")
            }
            className="clear-search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="topbar-right">
        <button className="icon-button notification-button">
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="top-profile">
          <div className="top-avatar">
            DA
          </div>

          <div className="top-profile-info">
            <strong>Dr. Arun</strong>
            <span>
              Research Scientist
            </span>
          </div>

          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}

/* =========================
   LAYOUT
========================= */

function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your laboratory operations"
        action={
          <button
            className="primary-button"
            onClick={() =>
              navigate(
                "/experiments"
              )
            }
          >
            <Plus size={17} />
            Schedule Experiment
          </button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FlaskConical size={20} />
          </div>

          <div>
            <span>
              Total Experiments
            </span>
            <strong>42</strong>
            <small className="positive">
              +12% this month
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={20} />
          </div>

          <div>
            <span>
              Active Experiments
            </span>
            <strong>8</strong>
            <small className="positive">
              +2 today
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Cpu size={20} />
          </div>

          <div>
            <span>
              Equipment Utilization
            </span>
            <strong>86%</strong>
            <small className="positive">
              +5.2% this week
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>
              Diagnostics Resolved
            </span>
            <strong>96%</strong>
            <small className="positive">
              +3.1% this month
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Recent Experiments
              </h2>

              <p>
                Latest laboratory activities
              </p>
            </div>

            <button
              className="text-button"
              onClick={() =>
                navigate(
                  "/experiments"
                )
              }
            >
              View All
            </button>
          </div>

          <div className="experiment-list">
            {initialExperiments.map(
              (item) => (
                <div
                  className="experiment-row"
                  key={item.id}
                >
                  <div className="experiment-main-icon">
                    <FlaskConical
                      size={17}
                    />
                  </div>

                  <div className="experiment-info">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.id} ·{" "}
                      {item.researcher}
                    </span>
                  </div>

                  <div className="experiment-location">
                    <MapPin size={14} />
                    {item.location}
                  </div>

                  <StatusBadge
                    status={
                      item.status
                    }
                  />
                </div>
              )
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>System Status</h2>

              <p>
                Live laboratory status
              </p>
            </div>

            <span className="live-badge">
              <span />
              LIVE
            </span>
          </div>

          <div className="system-status-list">
            <div className="system-status-row">
              <div className="status-symbol green-bg">
                <CheckCircle2
                  size={18}
                />
              </div>

              <div>
                <strong>
                  Fusion Chamber A
                </strong>
                <span>
                  Operational
                </span>
              </div>

              <b>94%</b>
            </div>

            <div className="system-status-row">
              <div className="status-symbol green-bg">
                <Zap size={18} />
              </div>

              <div>
                <strong>
                  Magnetic Coil B
                </strong>
                <span>
                  Operational
                </span>
              </div>

              <b>87%</b>
            </div>

            <div className="system-status-row">
              <div className="status-symbol orange-bg">
                <AlertTriangle
                  size={18}
                />
              </div>

              <div>
                <strong>
                  Thermal Sensor 03
                </strong>

                <span>
                  Maintenance required
                </span>
              </div>

              <b>68%</b>
            </div>

            <div className="system-status-row">
              <div className="status-symbol green-bg">
                <Activity size={18} />
              </div>

              <div>
                <strong>
                  Cooling System 02
                </strong>

                <span>
                  Operational
                </span>
              </div>

              <b>91%</b>
            </div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid lower-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Plasma Performance
              </h2>

              <p>
                Temperature trend today
              </p>
            </div>

            <Thermometer
              size={20}
              className="panel-icon"
            />
          </div>

          <div className="dashboard-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={
                  plasmaPerformance
                }
              >
                <defs>
                  <linearGradient
                    id="tempGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#4169e1"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#4169e1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#edf0f5"
                />

                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#4169e1"
                  fill="url(#tempGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Quick Metrics</h2>

              <p>
                Current laboratory values
              </p>
            </div>

            <Gauge
              size={20}
              className="panel-icon"
            />
          </div>

          <div className="quick-metrics">
            <div>
              <span>
                Plasma Temperature
              </span>

              <strong>
                4,250 K
              </strong>

              <small>
                Normal range
              </small>
            </div>

            <div>
              <span>Pressure</span>
              <strong>1.24 Pa</strong>
              <small>Stable</small>
            </div>

            <div>
              <span>
                Magnetic Field
              </span>

              <strong>2.4 T</strong>

              <small>Optimal</small>
            </div>

            <div>
              <span>
                Plasma Density
              </span>

              <strong>
                2.8 × 10¹⁹
              </strong>

              <small>
                Within target
              </small>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================
   EXPERIMENT MODAL
========================= */

function ScheduleModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (
    experiment: Experiment
  ) => void;
}) {
  const [name, setName] =
    useState("");

  const [researcher, setResearcher] =
    useState("Dr. Arun");

  const [location, setLocation] =
    useState("Chamber A");

  const [date, setDate] =
    useState("2026-10-03");

  const [time, setTime] =
    useState("10:00");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(
        "Please enter an experiment name."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newExperiment =
        await createExperiment({
          id: `EXP-${Date.now()}`,
          name: name.trim(),
          researcher,
          location,
          experiment_date: date,
          experiment_time: time,
          status: "Scheduled",
        });

      onAdd(
        convertExperiment(
          newExperiment
        )
      );

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create experiment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              Schedule Experiment
            </h2>

            <p>
              Create a new laboratory
              experiment
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="full">
              Experiment Name

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter experiment name"
              />
            </label>

            <label>
              Researcher

              <select
                value={researcher}
                onChange={(e) =>
                  setResearcher(
                    e.target.value
                  )
                }
              >
                <option>
                  Dr. Arun
                </option>

                <option>
                  Dr. Priya
                </option>

                <option>
                  Dr. Karthik
                </option>

                <option>
                  Dr. Meena
                </option>
              </select>
            </label>

            <label>
              Location

              <select
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
              >
                <option>
                  Chamber A
                </option>

                <option>
                  Chamber B
                </option>

                <option>
                  Lab 01
                </option>

                <option>
                  Lab 02
                </option>

                <option>
                  Lab 03
                </option>
              </select>
            </label>

            <label>
              Date

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              Time

              <input
                type="time"
                value={time}
                onChange={(e) =>
                  setTime(
                    e.target.value
                  )
                }
              />
            </label>
          </div>

          {error && (
            <div
              style={{
                marginTop: "12px",
                padding:
                  "10px 12px",
                borderRadius: "8px",
                background:
                  "#fff1f2",
                color: "#be123c",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              <CalendarDays
                size={16}
              />

              {loading
                ? "Saving..."
                : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   EXPERIMENTS PAGE
========================= */

function ExperimentsPage() {
  const [experiments, setExperiments] =
    useState<Experiment[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadExperiments =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getExperiments();

          setExperiments(
            data.map(
              convertExperiment
            )
          );
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load experiments"
          );
        } finally {
          setLoading(false);
        }
      };

    loadExperiments();
  }, []);

  const filtered =
    experiments.filter((item) => {
      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.researcher
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "All" ||
        item.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  return (
    <>
      <PageHeader
        title="Experiments"
        subtitle="Schedule and manage laboratory experiments"
        action={
          <button
            className="primary-button"
            onClick={() =>
              setShowModal(true)
            }
          >
            <Plus size={17} />
            Schedule Experiment
          </button>
        }
      />

      <div className="stats-grid compact-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FlaskConical
              size={19}
            />
          </div>

          <div>
            <span>Total</span>

            <strong>
              {experiments.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={19} />
          </div>

          <div>
            <span>Running</span>

            <strong>
              {
                experiments.filter(
                  (x) =>
                    x.status ===
                    "Running"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock3 size={19} />
          </div>

          <div>
            <span>Scheduled</span>

            <strong>
              {
                experiments.filter(
                  (x) =>
                    x.status ===
                    "Scheduled"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CheckCircle2
              size={19}
            />
          </div>

          <div>
            <span>Completed</span>

            <strong>
              {
                experiments.filter(
                  (x) =>
                    x.status ===
                    "Completed"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="table-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search experiments..."
            />
          </div>

          <select
            className="filter-select"
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
          >
            <option>All</option>
            <option>Running</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
        </div>

        {loading && (
          <div
            style={{
              padding: "40px",
              textAlign:
                "center",
              color: "#64748b",
            }}
          >
            Loading experiments...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              margin: "20px",
              padding: "14px",
              borderRadius:
                "10px",
              background:
                "#fff1f2",
              color: "#be123c",
            }}
          >
            <strong>
              Unable to load
              experiments
            </strong>

            <p
              style={{
                margin:
                  "5px 0 0",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    Experiment
                  </th>
                  <th>
                    Researcher
                  </th>
                  <th>
                    Location
                  </th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "40px",
                        color:
                          "#64748b",
                      }}
                    >
                      No experiments
                      found
                    </td>
                  </tr>
                ) : (
                  filtered.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          <strong className="table-id">
                            {
                              item.id
                            }
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {
                              item.name
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            item.researcher
                          }
                        </td>

                        <td>
                          {
                            item.location
                          }
                        </td>

                        <td>
                          {
                            item.date
                          }
                        </td>

                        <td>
                          {
                            item.time
                          }
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <ScheduleModal
          onClose={() =>
            setShowModal(false)
          }
          onAdd={(experiment) =>
            setExperiments(
              (current) => [
                experiment,
                ...current,
              ]
            )
          }
        />
      )}
    </>
  );
}

/* =========================
   PLASMA LOG MODAL
========================= */

function PlasmaLogModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (log: PlasmaLog) => void;
}) {
  const [experiment, setExperiment] =
    useState(
      "Plasma Stability Test"
    );

  const [temperature, setTemperature] =
    useState("");

  const [pressure, setPressure] =
    useState("");

  const [density, setDensity] =
    useState("");

  const [magneticField, setMagneticField] =
    useState("");

  const [researcher, setResearcher] =
    useState("Dr. Arun");

  const [status, setStatus] =
    useState<PlasmaStatus>(
      "Stable"
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const experimentItem =
        initialExperiments.find(
          (item) =>
            item.name === experiment
        );

      const created =
        await createPlasmaLog({
          id: `PL-${Date.now()}`,
          experiment_id:
            experimentItem?.id,
          experiment,
          researcher,
          temperature:
            temperature.trim() ||
            "4,250 K",
          pressure:
            pressure.trim() ||
            "1.24 Pa",
          density:
            density.trim() ||
            "2.8 × 10¹⁹",
          magnetic_field:
            magneticField.trim() ||
            "2.4 T",
          status,
        });

      onAdd(
        convertPlasmaLog(
          created
        )
      );

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create plasma log"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              Add Plasma Log
            </h2>

            <p>
              Record plasma measurement
              data
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
            disabled={loading}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="full">
              Experiment

              <select
                value={experiment}
                onChange={(e) => {
                  const selected =
                    initialExperiments.find(
                      (item) =>
                        item.name ===
                        e.target.value
                    );

                  setExperiment(
                    e.target.value
                  );

                  if (
                    selected
                  ) {
                    setResearcher(
                      selected.researcher
                    );
                  }
                }}
                disabled={loading}
              >
                {initialExperiments.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={
                        item.name
                      }
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              Researcher

              <select
                value={researcher}
                onChange={(e) =>
                  setResearcher(
                    e.target.value
                  )
                }
                disabled={loading}
              >
                <option>
                  Dr. Arun
                </option>

                <option>
                  Dr. Priya
                </option>

                <option>
                  Dr. Karthik
                </option>

                <option>
                  Dr. Meena
                </option>
              </select>
            </label>

            <label>
              Status

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as PlasmaStatus
                  )
                }
                disabled={loading}
              >
                <option value="Stable">
                  Stable
                </option>

                <option value="Monitoring">
                  Monitoring
                </option>

                <option value="Warning">
                  Warning
                </option>
              </select>
            </label>

            <label>
              Temperature

              <input
                value={temperature}
                onChange={(e) =>
                  setTemperature(
                    e.target.value
                  )
                }
                placeholder="e.g. 4,250 K"
                disabled={loading}
              />
            </label>

            <label>
              Pressure

              <input
                value={pressure}
                onChange={(e) =>
                  setPressure(
                    e.target.value
                  )
                }
                placeholder="e.g. 1.24 Pa"
                disabled={loading}
              />
            </label>

            <label>
              Plasma Density

              <input
                value={density}
                onChange={(e) =>
                  setDensity(
                    e.target.value
                  )
                }
                placeholder="e.g. 2.8 × 10¹⁹"
                disabled={loading}
              />
            </label>

            <label>
              Magnetic Field

              <input
                value={magneticField}
                onChange={(e) =>
                  setMagneticField(
                    e.target.value
                  )
                }
                placeholder="e.g. 2.4 T"
                disabled={loading}
              />
            </label>
          </div>

          {error && (
            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "10px 12px",
                borderRadius:
                  "8px",
                background:
                  "#fff1f2",
                color:
                  "#be123c",
                fontSize:
                  "13px",
              }}
            >
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              <Save size={16} />

              {loading
                ? "Saving..."
                : "Add Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   PLASMA LOGS
========================= */

function PlasmaLogsPage() {
  const [logs, setLogs] =
    useState<PlasmaLog[]>([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPlasmaLogs =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getPlasmaLogs();

          setLogs(
            data.map(
              convertPlasmaLog
            )
          );
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load plasma logs"
          );
        } finally {
          setLoading(false);
        }
      };

    loadPlasmaLogs();
  }, []);

  const filtered = logs.filter(
    (item) =>
      item.experiment
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      item.id
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      item.researcher
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <>
      <PageHeader
        title="Plasma Logs"
        subtitle="Monitor and record plasma measurements"
        action={
          <button
            className="primary-button"
            onClick={() =>
              setShowModal(true)
            }
          >
            <Plus size={17} />
            Add Plasma Log
          </button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FlaskConical
              size={20}
            />
          </div>

          <div>
            <span>
              Total Logs
            </span>

            <strong>
              {logs.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2
              size={20}
            />
          </div>

          <div>
            <span>Stable</span>

            <strong>
              {
                logs.filter(
                  (x) =>
                    x.status ===
                    "Stable"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Activity size={20} />
          </div>

          <div>
            <span>
              Monitoring
            </span>

            <strong>
              {
                logs.filter(
                  (x) =>
                    x.status ===
                    "Monitoring"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle
              size={20}
            />
          </div>

          <div>
            <span>Warnings</span>

            <strong>
              {
                logs.filter(
                  (x) =>
                    x.status ===
                    "Warning"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="table-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search plasma logs..."
            />
          </div>
        </div>

        {loading && (
          <div
            style={{
              padding: "40px",
              textAlign:
                "center",
              color: "#64748b",
            }}
          >
            Loading plasma logs...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              margin: "20px",
              padding: "14px",
              borderRadius:
                "10px",
              background:
                "#fff1f2",
              color:
                "#be123c",
            }}
          >
            <strong>
              Unable to load plasma
              logs
            </strong>

            <p
              style={{
                margin:
                  "5px 0 0",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    Experiment
                  </th>
                  <th>
                    Researcher
                  </th>
                  <th>
                    Temperature
                  </th>
                  <th>
                    Pressure
                  </th>
                  <th>
                    Density
                  </th>
                  <th>
                    Magnetic Field
                  </th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "40px",
                        color:
                          "#64748b",
                      }}
                    >
                      No plasma logs
                      found
                    </td>
                  </tr>
                ) : (
                  filtered.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          <strong className="table-id">
                            {
                              item.id
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            item.experiment
                          }
                        </td>

                        <td>
                          {
                            item.researcher
                          }
                        </td>

                        <td>
                          {
                            item.temperature
                          }
                        </td>

                        <td>
                          {
                            item.pressure
                          }
                        </td>

                        <td>
                          {
                            item.density
                          }
                        </td>

                        <td>
                          {
                            item.magneticField
                          }
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td>
                          {
                            item.date
                          }
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <PlasmaLogModal
          onClose={() =>
            setShowModal(false)
          }
          onAdd={(log) =>
            setLogs(
              (current) => [
                log,
                ...current,
              ]
            )
          }
        />
      )}
    </>
  );
}

/* =========================
   DIAGNOSTIC MODAL
========================= */

function DiagnosticModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (
    diagnostic: Diagnostic
  ) => void;
}) {
  const [equipment, setEquipment] =
    useState(
      "Thermal Sensor 03"
    );

  const [issue, setIssue] =
    useState("");

  const [severity, setSeverity] =
    useState<DiagnosticSeverity>(
      "Warning"
    );

  const [status, setStatus] =
    useState<DiagnosticStatus>(
      "Open"
    );

  const [value, setValue] =
    useState("Monitoring");

  const [researcher, setResearcher] =
    useState("Dr. Arun");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!issue.trim()) {
      setError(
        "Please enter an issue description."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const equipmentItem =
        initialEquipment.find(
          (item) =>
            item.name === equipment
        );

      const created =
        await createDiagnostic({
          id: `DGN-${Date.now()}`,
          equipment_id:
            equipmentItem?.id || null,
          equipment,
          issue: issue.trim(),
          severity,
          status,
          value:
            value.trim() ||
            "Monitoring",
          researcher,
        });

      onAdd(
        convertApiDiagnostic(
          created
        )
      );

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create diagnostic"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              Add Diagnostic
            </h2>

            <p>
              Record a new equipment
              diagnostic
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
            disabled={loading}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="full">
              Equipment

              <select
                value={equipment}
                onChange={(e) =>
                  setEquipment(
                    e.target.value
                  )
                }
                disabled={loading}
              >
                {initialEquipment.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={
                        item.name
                      }
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="full">
              Issue Description

              <textarea
                value={issue}
                onChange={(e) =>
                  setIssue(
                    e.target.value
                  )
                }
                placeholder="Describe the diagnostic issue..."
                rows={4}
                disabled={loading}
              />
            </label>

            <label>
              Severity

              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(
                    e.target
                      .value as DiagnosticSeverity
                  )
                }
                disabled={loading}
              >
                <option value="Critical">
                  Critical
                </option>

                <option value="Warning">
                  Warning
                </option>

                <option value="Normal">
                  Normal
                </option>
              </select>
            </label>

            <label>
              Status

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as DiagnosticStatus
                  )
                }
                disabled={loading}
              >
                <option value="Open">
                  Open
                </option>

                <option value="Investigating">
                  Investigating
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </label>

            <label>
              Value

              <input
                value={value}
                onChange={(e) =>
                  setValue(
                    e.target.value
                  )
                }
                placeholder="e.g. 4,680 K"
                disabled={loading}
              />
            </label>

            <label>
              Researcher

              <select
                value={researcher}
                onChange={(e) =>
                  setResearcher(
                    e.target.value
                  )
                }
                disabled={loading}
              >
                <option>
                  Dr. Arun
                </option>

                <option>
                  Dr. Priya
                </option>

                <option>
                  Dr. Karthik
                </option>

                <option>
                  Dr. Meena
                </option>
              </select>
            </label>
          </div>

          {error && (
            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "10px 12px",
                borderRadius:
                  "8px",
                background:
                  "#fff1f2",
                color:
                  "#be123c",
                fontSize:
                  "13px",
              }}
            >
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              <Activity size={16} />

              {loading
                ? "Saving..."
                : "Add Diagnostic"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   DIAGNOSTICS
========================= */

function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] =
    useState<Diagnostic[]>([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDiagnostics =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getDiagnostics();

          setDiagnostics(
            data.map(
              convertApiDiagnostic
            )
          );
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load diagnostics"
          );
        } finally {
          setLoading(false);
        }
      };

    loadDiagnostics();
  }, []);

  const filtered =
    diagnostics.filter(
      (item) =>
        item.equipment
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.issue
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.id
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.researcher
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const criticalCount =
    diagnostics.filter(
      (x) =>
        x.severity ===
        "Critical"
    ).length;

  const warningCount =
    diagnostics.filter(
      (x) =>
        x.severity ===
        "Warning"
    ).length;

  const investigatingCount =
    diagnostics.filter(
      (x) =>
        x.status ===
        "Investigating"
    ).length;

  const resolvedCount =
    diagnostics.filter(
      (x) =>
        x.status ===
        "Resolved"
    ).length;

  return (
    <>
      <PageHeader
        title="Diagnostics"
        subtitle="Monitor equipment health and diagnostic events"
        action={
          <button
            className="primary-button"
            onClick={() =>
              setShowModal(true)
            }
          >
            <Plus size={17} />
            Add Diagnostic
          </button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle
              size={20}
            />
          </div>

          <div>
            <span>Critical</span>

            <strong>
              {criticalCount}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Activity size={20} />
          </div>

          <div>
            <span>Warnings</span>

            <strong>
              {warningCount}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Timer size={20} />
          </div>

          <div>
            <span>
              Investigating
            </span>

            <strong>
              {investigatingCount}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2
              size={20}
            />
          </div>

          <div>
            <span>Resolved</span>

            <strong>
              {resolvedCount}
            </strong>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="table-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search diagnostics..."
            />
          </div>
        </div>

        {loading && (
          <div
            style={{
              padding: "40px",
              textAlign:
                "center",
              color: "#64748b",
            }}
          >
            Loading diagnostics...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              margin: "20px",
              padding: "14px",
              borderRadius:
                "10px",
              background:
                "#fff1f2",
              color:
                "#be123c",
            }}
          >
            <strong>
              Unable to load
              diagnostics
            </strong>

            <p
              style={{
                margin:
                  "5px 0 0",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipment</th>
                  <th>Issue</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Researcher</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "40px",
                        color:
                          "#64748b",
                      }}
                    >
                      No diagnostics
                      found
                    </td>
                  </tr>
                ) : (
                  filtered.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          <strong className="table-id">
                            {
                              item.id
                            }
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {
                              item.equipment
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            item.issue
                          }
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              item.severity
                            }
                          />
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td>
                          {
                            item.value
                          }
                        </td>

                        <td>
                          {
                            item.researcher
                          }
                        </td>

                        <td>
                          {
                            item.date
                          }
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <DiagnosticModal
          onClose={() =>
            setShowModal(false)
          }
          onAdd={(diagnostic) =>
            setDiagnostics(
              (current) => [
                diagnostic,
                ...current,
              ]
            )
          }
        />
      )}
    </>
  );
}

/* =========================
   EQUIPMENT MODAL
========================= */

function EquipmentModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (
    equipment: Equipment
  ) => void;
}) {
  const [id, setId] =
    useState("");

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("Fusion System");

  const [location, setLocation] =
    useState("Chamber A");

  const [status, setStatus] =
    useState<EquipmentStatus>(
      "Operational"
    );

  const [utilization, setUtilization] =
    useState("0");

  const [condition, setCondition] =
    useState("Good");

  const [lastMaintenance, setLastMaintenance] =
    useState("");

  const [nextMaintenance, setNextMaintenance] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(
        "Please enter an equipment name."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const equipmentId =
        id.trim() ||
        `EQ-${Date.now()}`;

      const created =
        await createEquipment({
          id: equipmentId,
          name: name.trim(),
          category,
          location,
          status,
          utilization:
            Number(utilization) || 0,
          condition,
          last_maintenance:
            lastMaintenance ||
            null,
          next_maintenance:
            nextMaintenance ||
            null,
        });

      onAdd(
        convertEquipment(
          created
        )
      );

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create equipment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>
              Add Equipment
            </h2>

            <p>
              Add new laboratory equipment
            </p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
            disabled={loading}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Equipment ID

              <input
                value={id}
                onChange={(e) =>
                  setId(
                    e.target.value
                  )
                }
                placeholder="EQ-007"
                disabled={loading}
              />
            </label>

            <label>
              Equipment Name

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter equipment name"
                disabled={loading}
              />
            </label>

            <label>
              Category

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                disabled={loading}
              >
                <option>
                  Fusion System
                </option>

                <option>
                  Magnetic System
                </option>

                <option>
                  Sensors
                </option>

                <option>
                  Cooling System
                </option>

                <option>
                  Vacuum System
                </option>
              </select>
            </label>

            <label>
              Location

              <select
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                disabled={loading}
              >
                <option>
                  Chamber A
                </option>

                <option>
                  Chamber B
                </option>

                <option>
                  Lab 01
                </option>

                <option>
                  Lab 02
                </option>

                <option>
                  Lab 03
                </option>
              </select>
            </label>

            <label>
              Status

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value as EquipmentStatus
                  )
                }
                disabled={loading}
              >
                <option value="Operational">
                  Operational
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Standby">
                  Standby
                </option>
              </select>
            </label>

            <label>
              Utilization %

              <input
                type="number"
                min="0"
                max="100"
                value={utilization}
                onChange={(e) =>
                  setUtilization(
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </label>

            <label>
              Condition

              <select
                value={condition}
                onChange={(e) =>
                  setCondition(
                    e.target.value
                  )
                }
                disabled={loading}
              >
                <option>
                  Excellent
                </option>

                <option>
                  Good
                </option>

                <option>
                  Needs Attention
                </option>

                <option>
                  Poor
                </option>
              </select>
            </label>

            <label>
              Last Maintenance

              <input
                type="date"
                value={lastMaintenance}
                onChange={(e) =>
                  setLastMaintenance(
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </label>

            <label>
              Next Maintenance

              <input
                type="date"
                value={nextMaintenance}
                onChange={(e) =>
                  setNextMaintenance(
                    e.target.value
                  )
                }
                disabled={loading}
              />
            </label>
          </div>

          {error && (
            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "10px 12px",
                borderRadius:
                  "8px",
                background:
                  "#fff1f2",
                color:
                  "#be123c",
                fontSize:
                  "13px",
              }}
            >
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              <Cpu size={16} />

              {loading
                ? "Saving..."
                : "Add Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   EQUIPMENT
========================= */

function EquipmentPage() {
  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadEquipment =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getEquipment();

          setEquipment(
            data.map(
              convertEquipment
            )
          );
        } catch (err) {
          console.error(err);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load equipment"
          );
        } finally {
          setLoading(false);
        }
      };

    loadEquipment();
  }, []);

  const filtered =
    equipment.filter(
      (item) => {
        const matchesSearch =
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.category
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.id
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesFilter =
          filter === "All" ||
          item.status === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const operationalCount =
    equipment.filter(
      (x) =>
        x.status ===
        "Operational"
    ).length;

  const maintenanceCount =
    equipment.filter(
      (x) =>
        x.status ===
        "Maintenance"
    ).length;

  const averageUtilization =
    equipment.length === 0
      ? 0
      : Math.round(
          equipment.reduce(
            (total, item) =>
              total +
              item.utilization,
            0
          ) /
            equipment.length
        );

  return (
    <>
      <PageHeader
        title="Equipment"
        subtitle="Manage laboratory equipment and utilization"
        action={
          <button
            className="primary-button"
            onClick={() =>
              setShowModal(true)
            }
          >
            <Plus size={17} />
            Add Equipment
          </button>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Cpu size={20} />
          </div>

          <div>
            <span>
              Total Equipment
            </span>

            <strong>
              {equipment.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2
              size={20}
            />
          </div>

          <div>
            <span>Operational</span>

            <strong>
              {operationalCount}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <RefreshCw size={20} />
          </div>

          <div>
            <span>Maintenance</span>

            <strong>
              {maintenanceCount}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp
              size={20}
            />
          </div>

          <div>
            <span>
              Avg. Utilization
            </span>

            <strong>
              {averageUtilization}%
            </strong>
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="table-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search equipment..."
            />
          </div>

          <select
            className="filter-select"
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
          >
            <option>All</option>

            <option>
              Operational
            </option>

            <option>
              Maintenance
            </option>

            <option>
              Standby
            </option>
          </select>
        </div>

        {loading && (
          <div
            style={{
              padding: "40px",
              textAlign:
                "center",
              color: "#64748b",
            }}
          >
            Loading equipment...
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              margin: "20px",
              padding: "14px",
              borderRadius:
                "10px",
              background:
                "#fff1f2",
              color:
                "#be123c",
            }}
          >
            <strong>
              Unable to load
              equipment
            </strong>

            <p
              style={{
                margin:
                  "5px 0 0",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Utilization</th>
                  <th>Condition</th>
                  <th>
                    Next Maintenance
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "40px",
                        color:
                          "#64748b",
                      }}
                    >
                      No equipment
                      found
                    </td>
                  </tr>
                ) : (
                  filtered.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          <strong className="table-id">
                            {item.id}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            {item.name}
                          </strong>
                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>
                          {item.location}
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td>
                          <div className="table-utilization">
                            <span>
                              {
                                item.utilization
                              }
                              %
                            </span>

                            <div>
                              <span
                                style={{
                                  width: `${item.utilization}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          {item.condition}
                        </td>

                        <td>
                          {
                            item.nextMaintenance
                          }
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <EquipmentModal
          onClose={() =>
            setShowModal(false)
          }
          onAdd={(newEquipment) =>
            setEquipment(
              (current) => [
                newEquipment,
                ...current,
              ]
            )
          }
        />
      )}
    </>
  );
}

/* =========================
   ANALYTICS
========================= */

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Laboratory performance and operational insights"
        action={
          <div className="analytics-badge">
            <span />
            Live Data
          </div>
        }
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FlaskConical
              size={20}
            />
          </div>

          <div>
            <span>
              Total Experiments
            </span>

            <strong>42</strong>

            <small className="positive">
              +16.7%
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Cpu size={20} />
          </div>

          <div>
            <span>
              Avg. Equipment Usage
            </span>

            <strong>86%</strong>

            <small className="positive">
              +5.2%
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Activity size={20} />
          </div>

          <div>
            <span>
              Plasma Stability
            </span>

            <strong>92%</strong>

            <small className="positive">
              +3.8%
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <CheckCircle2
              size={20}
            />
          </div>

          <div>
            <span>
              Diagnostics Resolved
            </span>

            <strong>96%</strong>

            <small className="positive">
              +3.1%
            </small>
          </div>
        </div>
      </div>

      <div className="analytics-chart-grid">
        <section className="panel analytics-large">
          <div className="panel-header">
            <div>
              <h2>
                Experiment Activity
              </h2>

              <p>
                Monthly experiment volume
              </p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={
                  experimentActivity
                }
              >
                <defs>
                  <linearGradient
                    id="experimentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#4169e1"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="100%"
                      stopColor="#4169e1"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#edf0f5"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="experiments"
                  stroke="#4169e1"
                  strokeWidth={2.5}
                  fill="url(#experimentGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Equipment Status
              </h2>

              <p>
                Current distribution
              </p>
            </div>
          </div>

          <div className="pie-chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {statusData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="analytics-chart-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Equipment Utilization
              </h2>

              <p>
                Highest utilized equipment
              </p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  equipmentUtilization
                }
                layout="vertical"
                margin={{
                  left: 20,
                  right: 20,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#edf0f5"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{
                    fontSize: 10,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="utilization"
                  fill="#4169e1"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>
                Plasma Performance
              </h2>

              <p>
                Temperature monitoring
              </p>
            </div>
          </div>

          <div className="mini-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={
                  plasmaPerformance
                }
              >
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#20c997"
                  fill="#20c997"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="analytics-insight-grid">
        <div className="analytics-insight blue-insight">
          <div className="insight-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <strong>
              Experiment Growth
            </strong>

            <p>
              Experiment activity has
              increased steadily over
              the last six months.
            </p>
          </div>
        </div>

        <div className="analytics-insight green-insight">
          <div className="insight-icon">
            <CheckCircle2
              size={20}
            />
          </div>

          <div>
            <strong>
              High Stability
            </strong>

            <p>
              Current plasma measurements
              remain within the expected
              operating range.
            </p>
          </div>
        </div>

        <div className="analytics-insight orange-insight">
          <div className="insight-icon">
            <AlertTriangle
              size={20}
            />
          </div>

          <div>
            <strong>
              Maintenance Attention
            </strong>

            <p>
              Thermal Sensor 03 requires
              maintenance before the next
              major experiment.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   SETTINGS TOGGLE
========================= */

function SettingToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="setting-toggle-row">
      <div className="setting-toggle-icon">
        {icon}
      </div>

      <div className="setting-toggle-info">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        className={`toggle-switch ${
          checked
            ? "checked"
            : ""
        }`}
        onClick={onChange}
        type="button"
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}

/* =========================
   SETTINGS
========================= */

function SettingsPage() {
  const [tab, setTab] =
    useState("Profile");

  const [
    emailNotifications,
    setEmailNotifications,
  ] = useState(true);

  const [
    diagnosticAlerts,
    setDiagnosticAlerts,
  ] = useState(true);

  const [
    experimentReminders,
    setExperimentReminders,
  ] = useState(false);

  const [
    liveMonitoring,
    setLiveMonitoring,
  ] = useState(true);

  const [saved, setSaved] =
    useState(false);

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your laboratory preferences and account"
      />

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-profile">
            <div className="settings-avatar">
              DA
            </div>

            <div>
              <strong>
                Dr. Arun
              </strong>

              <span>
                Research Scientist
              </span>
            </div>
          </div>

          <div className="settings-tabs">
            {[
              {
                name: "Profile",
                icon: User,
              },
              {
                name: "Notifications",
                icon: BellRing,
              },
              {
                name: "Laboratory",
                icon: SlidersHorizontal,
              },
              {
                name: "Security",
                icon: LockKeyhole,
              },
            ].map((item) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={item.name}
                  className={`settings-tab ${
                    tab === item.name
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setTab(
                      item.name
                    )
                  }
                >
                  <Icon size={17} />

                  <span>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="settings-content">
          {tab === "Profile" && (
            <div className="settings-panel">
              <div className="settings-section-header">
                <div>
                  <h2>
                    Profile Information
                  </h2>

                  <p>
                    Update your personal
                    laboratory account
                    details.
                  </p>
                </div>

                <User size={21} />
              </div>

              <div className="profile-banner">
                <div className="large-avatar">
                  DA
                </div>

                <div>
                  <h3>
                    Dr. Arun
                  </h3>

                  <p>
                    Research Scientist ·
                    Fusion Laboratories
                  </p>
                </div>

                <button className="secondary-button">
                  Change Photo
                </button>
              </div>

              <div className="settings-form-grid">
                <label>
                  First Name
                  <input defaultValue="Arun" />
                </label>

                <label>
                  Last Name
                  <input defaultValue="Kumar" />
                </label>

                <label>
                  Email
                  <input defaultValue="arun@fusionlabs.com" />
                </label>

                <label>
                  Role
                  <input defaultValue="Research Scientist" />
                </label>

                <label className="full">
                  Department
                  <input defaultValue="Fusion Research & Development" />
                </label>
              </div>

              <div className="settings-save-bar">
                {saved && (
                  <span className="save-message">
                    <CheckCircle2
                      size={15}
                    />
                    Changes saved
                  </span>
                )}

                <button
                  className="primary-button"
                  onClick={
                    saveSettings
                  }
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {tab ===
            "Notifications" && (
            <div className="settings-panel">
              <div className="settings-section-header">
                <div>
                  <h2>
                    Notifications
                  </h2>

                  <p>
                    Choose which laboratory
                    events you want to
                    receive.
                  </p>
                </div>

                <BellRing size={21} />
              </div>

              <div className="settings-option-list">
                <SettingToggle
                  icon={
                    <Mail size={18} />
                  }
                  title="Email Notifications"
                  description="Receive important laboratory updates by email."
                  checked={
                    emailNotifications
                  }
                  onChange={() =>
                    setEmailNotifications(
                      !emailNotifications
                    )
                  }
                />

                <SettingToggle
                  icon={
                    <AlertTriangle
                      size={18}
                    />
                  }
                  title="Diagnostic Alerts"
                  description="Get notified when equipment requires attention."
                  checked={
                    diagnosticAlerts
                  }
                  onChange={() =>
                    setDiagnosticAlerts(
                      !diagnosticAlerts
                    )
                  }
                />

                <SettingToggle
                  icon={
                    <CalendarDays
                      size={18}
                    />
                  }
                  title="Experiment Reminders"
                  description="Receive reminders before scheduled experiments."
                  checked={
                    experimentReminders
                  }
                  onChange={() =>
                    setExperimentReminders(
                      !experimentReminders
                    )
                  }
                />

                <SettingToggle
                  icon={
                    <Activity size={18} />
                  }
                  title="Live Monitoring Alerts"
                  description="Receive real-time monitoring notifications."
                  checked={
                    liveMonitoring
                  }
                  onChange={() =>
                    setLiveMonitoring(
                      !liveMonitoring
                    )
                  }
                />
              </div>

              <div className="settings-save-bar">
                {saved && (
                  <span className="save-message">
                    <CheckCircle2
                      size={15}
                    />
                    Changes saved
                  </span>
                )}

                <button
                  className="primary-button"
                  onClick={
                    saveSettings
                  }
                >
                  <Save size={16} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {tab === "Laboratory" && (
            <div className="settings-panel">
              <div className="settings-section-header">
                <div>
                  <h2>
                    Laboratory Settings
                  </h2>

                  <p>
                    Configure your laboratory
                    environment.
                  </p>
                </div>

                <SlidersHorizontal
                  size={21}
                />
              </div>

              <div className="settings-form-grid">
                <label>
                  Laboratory Name

                  <input defaultValue="Fusion Laboratories" />
                </label>

                <label>
                  Time Zone

                  <select defaultValue="Asia/Kolkata">
                    <option value="Asia/Kolkata">
                      Asia/Kolkata
                    </option>

                    <option value="UTC">
                      UTC
                    </option>

                    <option value="America/New_York">
                      America/New_York
                    </option>
                  </select>
                </label>

                <label>
                  Data Refresh Interval

                  <select defaultValue="5">
                    <option value="5">
                      5 seconds
                    </option>

                    <option value="10">
                      10 seconds
                    </option>

                    <option value="30">
                      30 seconds
                    </option>

                    <option value="60">
                      60 seconds
                    </option>
                  </select>
                </label>

                <label>
                  Default Chamber

                  <select defaultValue="Chamber A">
                    <option>
                      Chamber A
                    </option>

                    <option>
                      Chamber B
                    </option>

                    <option>
                      Lab 01
                    </option>

                    <option>
                      Lab 02
                    </option>

                    <option>
                      Lab 03
                    </option>
                  </select>
                </label>
              </div>

              <div className="settings-info-card">
                <Database size={20} />

                <div>
                  <strong>
                    Database Connection
                  </strong>

                  <p>
                    PostgreSQL connection
                    is now configured
                    through the backend API.
                  </p>
                </div>

                <span className="security-enabled">
                  Connected
                </span>
              </div>

              <div className="settings-save-bar">
                <button
                  className="primary-button"
                  onClick={
                    saveSettings
                  }
                >
                  <Save size={16} />
                  Save Laboratory
                  Settings
                </button>
              </div>
            </div>
          )}

          {tab === "Security" && (
            <div className="settings-panel">
              <div className="settings-section-header">
                <div>
                  <h2>Security</h2>

                  <p>
                    Manage account security
                    and access.
                  </p>
                </div>

                <LockKeyhole
                  size={21}
                />
              </div>

              <div className="security-card">
                <div className="security-icon">
                  <LockKeyhole
                    size={19}
                  />
                </div>

                <div>
                  <strong>
                    Password
                  </strong>

                  <p>
                    Your password was last
                    updated 30 days ago.
                  </p>
                </div>

                <button className="secondary-button">
                  Change
                </button>
              </div>

              <div className="security-card">
                <div className="security-icon">
                  <ShieldCheck
                    size={19}
                  />
                </div>

                <div>
                  <strong>
                    Two-Factor Authentication
                  </strong>

                  <p>
                    Extra security for your
                    laboratory account.
                  </p>
                </div>

                <span className="security-enabled">
                  Enabled
                </span>
              </div>

              <div className="security-card">
                <div className="security-icon">
                  <Database
                    size={19}
                  />
                </div>

                <div>
                  <strong>
                    Session Security
                  </strong>

                  <p>
                    Active session is protected
                    and monitored.
                  </p>
                </div>

                <span className="security-enabled">
                  Protected
                </span>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* =========================
   APP
========================= */

function App() {
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("fusion_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  if (!user) {
    return (
      <Login
  onLogin={(loggedInUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) => {
    setUser(loggedInUser);
  }}
/>
    );
  }
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/experiments"
            element={
              <ExperimentsPage />
            }
          />

          <Route
            path="/plasma-logs"
            element={
              <PlasmaLogsPage />
            }
          />

          <Route
            path="/diagnostics"
            element={
              <DiagnosticsPage />
            }
          />

          <Route
            path="/equipment"
            element={
              <EquipmentPage />
            }
          />

          <Route
            path="/analytics"
            element={
              <AnalyticsPage />
            }
          />

          <Route
            path="/settings"
            element={
              <SettingsPage />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;