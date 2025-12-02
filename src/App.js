import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  CheckSquare,
  Lock,
  LogOut,
  Smile,
  ChevronRight,
  ChevronLeft,
  Palette,
  Mic,
  Trash2,
  Globe,
  Plus,
  MapPin,
  User,
  CheckCircle,
  LayoutDashboard,
  Clipboard,
  RefreshCw,
  Wifi,
  WifiOff,
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  AlertOctagon,
  ArrowLeft,
  Clock,
  Home,
  ShoppingCart,
  Settings,
  KeyRound,
  Baby,
  Repeat,
  Save,
  PieChart,
  BookOpen,
  Menu,
  X as CloseIcon,
  Edit2,
  XCircle,
  AlertCircle,
  UserPlus,
  UserMinus,
  ArrowUp,
  ArrowDown,
  ListChecks,
  Shield,
  Unlock,
  CalendarDays,
  UserCog,
  Send,
  Eraser,
  Phone,
  Bell,
  Cake,
  Info,
  Search,
  Sparkles,
  Music,
  PartyPopper,
  Flag,
  FileText,
  Calculator,
  Copy,
  PlusCircle,
  Clock3,
  Power,
  Moon,
  Megaphone,
  Eye,
  Map,
  Euro,
  MonitorCheck,
  Briefcase,
  Columns,
  Grid,
  Gift,
  Check,
} from "lucide-react";

// Firebase Imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// --- CONFIGURATIE & FIREBASE ---
let firebaseConfig;

if (typeof __firebase_config !== "undefined") {
  firebaseConfig = JSON.parse(__firebase_config);
} else {
  firebaseConfig = {
    apiKey: "AIzaSyASpWTp5gsym3S0OXsbj8DVLX5hATABuBg",
    authDomain: "cp-app-final.firebaseapp.com",
    projectId: "cp-app-final",
    storageBucket: "cp-app-final.firebasestorage.app",
    messagingSenderId: "543451160778",
    appId: "1:543451160778:web:b7667edb254daf72e21433",
  };
}

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase config error:", error);
}

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// --- KLEURENPALET ---
const C = {
  Pine: "#045E51",
  Bark: "#7A5226",
  Lagoon: "#00192F",
  Sunset: "#700606",
  Grass: "#B1EDA6",
  Honey: "#FFCA55",
  Sky: "#9DB4F6",
  Blossom: "#FF699B",
  White: "#FFFFFF",
  Bg: "#F0FDF4",
};

const PRIORITIES = {
  high: { label: "Hoog", color: C.Sunset, icon: AlertCircle, bg: "#FFE5E5" },
  medium: { label: "Middel", color: C.Honey, icon: Info, bg: "#FFFBEB" },
  low: { label: "Laag", color: C.Pine, icon: CheckCircle, bg: "#F0FDF4" },
};

const TASK_CATS = {
  startup: {
    id: "startup",
    label: "Opstart",
    icon: Power,
    color: C.Grass,
    sortOrder: 1,
  },
  during: {
    id: "during",
    label: "Tijdens Dienst",
    icon: Clock3,
    color: C.Sky,
    sortOrder: 2,
  },
  closing: {
    id: "closing",
    label: "Afsluit",
    icon: Moon,
    color: C.Lagoon,
    sortOrder: 3,
  },
  general: {
    id: "general",
    label: "Algemeen",
    icon: Clipboard,
    color: "#E5E7EB",
    sortOrder: 4,
  },
};

const COLOR_OPTIONS = [
  { value: C.Pine, label: "Pine" },
  { value: C.Grass, label: "Grass" },
  { value: C.Sunset, label: "Sunset" },
  { value: C.Sky, label: "Sky" },
  { value: C.Lagoon, label: "Lagoon" },
  { value: C.Honey, label: "Honey" },
];

// --- CONSTANTEN ---
const DEFAULT_STAFF_NAMES = [
  "Maik",
  "Quincy",
  "Rens",
  "Mieke",
  "Daan",
  "Bo",
  "Eline",
  "Daphne",
  "Noor",
  "Louka",
  "Milou",
  "Kim",
  "Jeanine",
  "Amée",
  "Amara",
];
const LOCATIONS = ["Crea Atelier", "Podium Market Dome", "Overig"];
const ACTIVITY_OPTIONS = [
  "Kids Disco",
  "Voorleesverhaaltjes",
  "Op Avontuur...",
  "Natuurbingo",
  "Meet & Greet",
  "Show: de Muziekmachine",
  "Live Muziek",
  "Crazy Bingo Game",
  "Family Quiz Night",
  "DJ Night",
  "Walk-In Workshops",
  "Schminken",
  "Glittertattoo & Hairbeads",
  "Workshop: Nachtlampje",
  "Workshop: Maak je eigen Knuffel",
  "Wannabe",
  "Knutselen",
  "Wax Hands",
];
const ACTIVITY_TYPES = [
  {
    id: "crea",
    label: "Crea Atelier",
    bg: C.Sky,
    text: C.Lagoon,
    icon: Palette,
  },
  {
    id: "orry",
    label: "Orry & Friends",
    bg: C.Blossom,
    text: C.Sunset,
    icon: Baby,
  },
  { id: "ent", label: "Entertainment", bg: C.Honey, text: C.Bark, icon: Mic },
];
const BASE_ROLES = ["Orry", "Bing", "Woops", "Rep"];
const DAYS_OF_WEEK = [
  { id: 1, label: "Maandag", short: "Ma" },
  { id: 2, label: "Dinsdag", short: "Di" },
  { id: 3, label: "Woensdag", short: "Wo" },
  { id: 4, label: "Donderdag", short: "Do" },
  { id: 5, label: "Vrijdag", short: "Vr" },
  { id: 6, label: "Zaterdag", short: "Za" },
  { id: 0, label: "Zondag", short: "Zo" },
];
const NATIONALITIES = [
  { k: "nl", l: "Nederland", i: "🇳🇱", color: C.Honey },
  { k: "be_nl", l: "België (VL)", i: "🇧🇪", color: C.Sky },
  { k: "be_fr", l: "België (WA)", i: "🇧🇪", color: C.Lagoon },
  { k: "de", l: "Duitsland", i: "🇩🇪", color: C.Grass },
  { k: "en", l: "Engeland", i: "🇬🇧", color: C.Pine },
  { k: "fr", l: "Frankrijk", i: "🇫🇷", color: C.Blossom },
  { k: "ch", l: "Zwitserland", i: "🇨🇭", color: C.Sunset },
  { k: "other", l: "Overig", i: "🌍", color: C.Bark },
];

// --- DATA HELPERS ---
const sanitizeData = (data) => {
  const safe = data || {};
  let safeStaffList = Array.isArray(safe.staffList)
    ? safe.staffList.map((item) => {
        const base =
          typeof item === "string"
            ? { name: item, pin: "0000", phone: "", dob: "", lastLogin: null }
            : {
                name: item.name || "Onbekend",
                pin: item.pin || "0000",
                phone: item.phone || "",
                dob: item.dob || "",
                lastLogin: item.lastLogin || null,
                forcePinChange: item.forcePinChange, // preserve if exists
              };

        // Logic: Force change if pin is default '0000' or explicitly set
        if (base.pin === "0000" && base.forcePinChange === undefined) {
          base.forcePinChange = true;
        }
        return base;
      })
    : DEFAULT_STAFF_NAMES.map((name) => ({
        name,
        pin: "0000",
        phone: "",
        dob: "",
        lastLogin: null,
        forcePinChange: true,
      }));
  return {
    settings: safe.settings || { pin: "2412", coPin: "1234" },
    dailyStats: safe.dailyStats || {},
    schedule: Array.isArray(safe.schedule) ? safe.schedule : [],
    planningStatus: safe.planningStatus || {},
    characters: Array.isArray(safe.characters) ? safe.characters : [],
    checklists: Array.isArray(safe.checklists) ? safe.checklists : [],
    checklistTemplates: safe.checklistTemplates || {},
    activityTemplates: Array.isArray(safe.activityTemplates)
      ? safe.activityTemplates
      : [],
    handover: safe.handover || {},
    hourCorrections: Array.isArray(safe.hourCorrections)
      ? safe.hourCorrections
      : [],
    orders: Array.isArray(safe.orders) ? safe.orders : [],
    staffList: safeStaffList,
    notifications: Array.isArray(safe.notifications) ? safe.notifications : [],
    phoneDirectory: Array.isArray(safe.phoneDirectory)
      ? safe.phoneDirectory
      : [],
    lastUpdate: safe.lastUpdate || new Date().toISOString(),
  };
};
const INITIAL_DATA = sanitizeData({});
const toIsoDate = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};
const toDutchDate = (dateObj) => {
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};
const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
const getGreeting = () => {
  const h = new Date().getHours();
  return h < 6
    ? "Goedenacht"
    : h < 12
    ? "Goedemorgen"
    : h < 18
    ? "Goedemiddag"
    : "Goedenavond";
};
const getWeatherIcon = (code) => {
  if (code === 0) return { icon: Sun, desc: "Zon" };
  if (code >= 1 && code <= 3) return { icon: CloudSun, desc: "Bewolkt" };
  if (code >= 45 && code <= 48) return { icon: Cloud, desc: "Mist" };
  if (code >= 51 && code <= 67) return { icon: CloudRain, desc: "Regen" };
  if (code >= 71 && code <= 77) return { icon: CloudSnow, desc: "Sneeuw" };
  if (code >= 80 && code <= 82) return { icon: CloudRain, desc: "Buien" };
  if (code >= 95) return { icon: CloudLightning, desc: "Onweer" };
  return { icon: CloudSun, desc: "Wisselvallig" };
};
const getCharColorInfo = (role) => {
  const r = role.toLowerCase();
  if (r.includes("orry")) return { bg: C.Sunset, text: C.White };
  if (r.includes("bing")) return { bg: C.Grass, text: C.Pine };
  if (r.includes("woops")) return { bg: C.Sky, text: C.Lagoon };
  if (r.includes("rep")) return { bg: C.Honey, text: C.Bark };
  return { bg: C.Bg, text: C.Bark };
};
const safeRenderText = (item) => {
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null) return item.text || "";
  return "";
};
const formatStaffList = (staff) => {
  if (!staff) return [];
  if (Array.isArray(staff))
    return staff.map((s) =>
      typeof s === "object" ? s.name || "Error" : String(s)
    );
  if (typeof staff === "object") return [staff.name || "Error"];
  return [String(staff)];
};

// Nieuwe helper voor weekprogramma (Start op Vrijdag)
const getFridayOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, 5=Fri

  let daysToSubtract = 0;
  if (day === 5) daysToSubtract = 0;
  else if (day === 6) daysToSubtract = 1;
  else if (day === 0) daysToSubtract = 2;
  else if (day === 1) daysToSubtract = 3;
  else if (day === 2) daysToSubtract = 4;
  else if (day === 3) daysToSubtract = 5;
  else if (day === 4) daysToSubtract = 6;

  d.setDate(d.getDate() - daysToSubtract);
  return d;
};

const useWeather = (date) => {
  const [weather, setWeather] = useState({
    temp: "--",
    desc: "...",
    icon: Cloud,
  });
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const isoDate = toIsoDate(date);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=51.4358&longitude=5.9706&daily=weather_code,temperature_2m_max&timezone=Europe%2FAmsterdam&start_date=${isoDate}&end_date=${isoDate}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.daily?.time?.length > 0) {
          const code = data.daily.weather_code[0];
          const temp = Math.round(data.daily.temperature_2m_max[0]);
          setWeather({ temp, ...getWeatherIcon(code) });
        } else {
          setWeather({ temp: 15, desc: "Geen data", icon: Cloud });
        }
      } catch (error) {
        setWeather({ temp: "--", desc: "Offline", icon: WifiOff });
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 3600000);
    return () => clearInterval(interval);
  }, [date]);
  return weather;
};

// --- UPDATED LOGIC FOR ACTIVITY TIME ---
const isActivityPast = (timeStr, date) => {
  if (!timeStr) return false;
  const todayStr = toIsoDate(new Date());
  const checkDateStr = toIsoDate(date);

  if (checkDateStr < todayStr) return true; // Date is in the past
  if (checkDateStr > todayStr) return false; // Date is in the future

  // Date is today, check time
  const now = new Date();
  const parts = timeStr.split("-");
  // Use end time if available, otherwise start time
  const timeToParse = parts.length > 1 ? parts[1] : parts[0];
  const [hours, minutes] = timeToParse.trim().split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return false;

  const activityTime = new Date(now);
  activityTime.setHours(hours, minutes, 0, 0);

  // Returns true if NOW is later than activity time
  return now > activityTime;
};

const sortActivities = (a, b, currentDay) => {
  const pastA = isActivityPast(a.time, currentDay);
  const pastB = isActivityPast(b.time, currentDay);

  // Past activities go to bottom
  if (pastA && !pastB) return 1;
  if (!pastA && pastB) return -1;

  // If both are same status, sort by time ascending
  const getStartTime = (t) => {
    const parts = t.split("-")[0].trim().split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  return getStartTime(a.time) - getStartTime(b.time);
};

// Helper for task grouping
const groupTasksByCategory = (tasks) => {
  const groups = {
    startup: [],
    during: [],
    closing: [],
    general: [],
  };
  tasks.forEach((t) => {
    const cat = t.category || "general";
    if (groups[cat]) {
      groups[cat].push(t);
    } else {
      groups.general.push(t);
    }
  });
  return groups;
};

// --- BASE UI COMPONENTS ---
const Card = ({
  children,
  className = "",
  borderColor = "transparent",
  style = {},
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border ${className}`}
    style={{ borderColor: borderColor, ...style }}
  >
    {children}
  </div>
);

const SidebarItem = ({ id, icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 rounded-xl mb-1 transition-all`}
    style={{
      backgroundColor: active ? C.Grass : "transparent",
      color: active ? C.Pine : C.Grass,
      fontWeight: active ? "bold" : "normal",
    }}
  >
    <Icon size={20} className="mr-3" /> {label}
  </button>
);

const AlertModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <Card
        className="w-full max-w-xs p-6 text-center shadow-2xl"
        borderColor={C.Pine}
      >
        <Info size={40} className="mx-auto mb-4" style={{ color: C.Pine }} />
        <p className="mb-6 font-medium" style={{ color: C.Bark }}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg font-bold text-white"
          style={{ backgroundColor: C.Pine }}
        >
          OK
        </button>
      </Card>
    </div>
  );
};

const NotificationPopup = ({ notification, onClose }) => {
  if (!notification) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-300">
        <div
          className="p-6 text-white flex justify-center"
          style={{ backgroundColor: C.Pine }}
        >
          <Megaphone size={48} className="animate-bounce" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.Pine }}>
            {notification.title}
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {notification.message}
          </p>
          <button
            onClick={onClose}
            className="w-full text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: C.Pine }}
          >
            Gelezen
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <Card
        className="w-full max-w-xs p-6 text-center shadow-2xl"
        borderColor={C.Sunset}
      >
        <AlertOctagon
          size={40}
          className="mx-auto mb-4"
          style={{ color: C.Sunset }}
        />
        <p className="mb-6 font-medium" style={{ color: C.Bark }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg font-bold border"
            style={{ color: C.Bark, borderColor: C.Bark }}
          >
            Annuleer
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg font-bold text-white"
            style={{ backgroundColor: C.Sunset }}
          >
            Bevestig
          </button>
        </div>
      </Card>
    </div>
  );
};

const Confetti = () => {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 w-3 h-3 rounded-full animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: [C.Pine, C.Grass, C.Sunset, C.Sky, C.Blossom][
              Math.floor(Math.random() * 5)
            ],
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
      <style>{`@keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } } .animate-fall { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }`}</style>
    </div>
  );
};

const AdminContainer = ({
  title,
  children,
  backAction,
  currentDay,
  onPrev,
  onNext,
  onCalendar,
  hideDateControls,
}) => (
  <div
    className="rounded-2xl shadow-sm border overflow-hidden max-w-4xl mx-auto animate-in slide-in-from-bottom-4 h-full flex flex-col"
    style={{ backgroundColor: C.White, borderColor: C.Grass }}
  >
    <div
      className="p-4 border-b flex items-center gap-3 sticky top-0 z-20"
      style={{ backgroundColor: C.White, borderColor: C.Grass }}
    >
      <button
        onClick={backAction}
        className="p-2 border rounded-lg shadow-sm transition-colors flex items-center gap-1"
        style={{ borderColor: C.Pine, color: C.Pine }}
      >
        <ArrowLeft size={16} />{" "}
        <span className="text-xs font-bold uppercase">Dashboard</span>
      </button>
      <h2 className="font-bold text-lg" style={{ color: C.Pine }}>
        {title}
      </h2>
      {!hideDateControls && (
        <div
          className="ml-auto flex items-center rounded-lg p-1"
          style={{ backgroundColor: C.Bg }}
        >
          <button
            onClick={onPrev}
            className="p-1 rounded hover:bg-white/50"
            style={{ color: C.Pine }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onCalendar}
            className="px-2 text-xs font-bold min-w-[100px] text-center"
            style={{ color: C.Pine }}
          >
            {toDutchDate(currentDay)}
          </button>
          <button
            onClick={onNext}
            className="p-1 rounded hover:bg-white/50"
            style={{ color: C.Pine }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
    <div className="p-4 overflow-y-auto flex-1 pb-24">{children}</div>
  </div>
);

const NotificationBadge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <span
      className="absolute -top-1 -right-1 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 shadow-sm"
      style={{
        backgroundColor: C.Sunset,
        color: C.Blossom,
        borderColor: C.White,
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
};

const NotificationManager = ({
  appData,
  updateData,
  showAlert,
  showConfirm,
}) => {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [start, setStart] = useState(new Date().toISOString().split("T")[0]);
  const [end, setEnd] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm mt-4">
      <h3 className="font-bold mb-2" style={{ color: C.Pine }}>
        Mededelingen
      </h3>
      <input
        className="border p-2 w-full rounded mb-2"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full rounded mb-2"
        placeholder="Bericht"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Start</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Eind</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (title && msg) {
            updateData({
              notifications: [
                ...appData.notifications,
                { id: Date.now(), title, message: msg, start, end, readBy: [] },
              ],
            });
            setTitle("");
            setMsg("");
          }
        }}
        className="text-white px-4 py-2 rounded w-full font-bold"
        style={{ backgroundColor: C.Sky, color: C.Lagoon }}
      >
        Plaatsen
      </button>
      <div className="mt-4 space-y-2">
        {appData.notifications.map((n) => (
          <div
            key={n.id}
            className="border p-2 rounded flex justify-between flex-col"
          >
            <div className="flex justify-between">
              <div>
                <b style={{ color: C.Pine }}>{n.title}</b>
                <p className="text-xs">{n.message}</p>
                <p className="text-[10px] text-gray-400">
                  {n.start} - {n.end}
                </p>
              </div>
              <button
                onClick={() =>
                  updateData({
                    notifications: appData.notifications.filter(
                      (x) => x.id !== n.id
                    ),
                  })
                }
                style={{ color: C.Sunset }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            {n.readBy && n.readBy.length > 0 && (
              <div className="mt-2 pt-2 border-t text-[10px] text-gray-500">
                <b>Gelezen door:</b> {n.readBy.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- OPTIMIZED WIDGETS ---

const TaskProgressWidget = ({ checklists, onViewTasks }) => {
  const getStats = (list) => {
    const total = list.length;
    const done = list.filter((t) => t.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  };
  const ent = getStats(checklists.entertainment);
  const crea = getStats(checklists.crea);
  const extra = getStats(checklists.extra);

  return (
    <Card
      className="p-0 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
      borderColor={C.Pine}
      onClick={onViewTasks}
    >
      <div
        className="px-4 py-3 font-bold text-white flex justify-between items-center rounded-t-xl"
        style={{ backgroundColor: C.Pine }}
      >
        <span className="flex items-center gap-2">
          <ListChecks size={20} /> Taken Voortgang
        </span>
        <span className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1">
          Ga naar Taken <ChevronRight size={12} />
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg text-white"
            style={{ backgroundColor: C.Honey }}
          >
            <Mic size={16} color={C.Bark} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-0.5 font-bold text-gray-700">
              <span>Ent</span>
              <span>{ent.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ backgroundColor: C.Honey, width: `${ent.pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg text-white"
            style={{ backgroundColor: C.Sky }}
          >
            <Palette size={16} color={C.Lagoon} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-0.5 font-bold text-gray-700">
              <span>Crea</span>
              <span>{crea.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ backgroundColor: C.Sky, width: `${crea.pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg text-white"
            style={{ backgroundColor: C.Sunset }}
          >
            <Clipboard size={16} color={C.White} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-0.5 font-bold text-gray-700">
              <span>Extra</span>
              <span>{extra.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{ backgroundColor: C.Sunset, width: `${extra.pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StatsWidget = ({ dailyStats, currentDay, onViewDetails }) => {
  const dateKey = toIsoDate(currentDay);
  const stats = dailyStats?.[dateKey] || {
    total: 0,
    adults: 0,
    kids: 0,
    babies: 0,
  };
  const displayTotal =
    stats.total > 0
      ? stats.total
      : (stats.adults || 0) + (stats.kids || 0) + (stats.babies || 0);

  return (
    <Card
      className="p-0 h-full flex flex-col animate-in fade-in cursor-pointer hover:shadow-md overflow-hidden relative"
      borderColor={C.Pine}
      onClick={onViewDetails}
    >
      <div
        className="px-4 py-3 font-bold text-white flex justify-between items-center rounded-t-xl"
        style={{ backgroundColor: C.Pine }}
      >
        <span className="flex items-center gap-2">
          <Users size={20} /> Gasten Vandaag
        </span>
        <span className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1">
          Ga naar Bezetting <ChevronRight size={12} />
        </span>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-center items-center text-center z-10">
        <span className="text-4xl font-extrabold text-teal-900 leading-tight">
          {displayTotal || "--"}
        </span>
        <div className="flex gap-3 mt-3 text-xs font-medium text-gray-500">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-800 text-sm">
              {stats.adults || 0}
            </span>
            <span>Volw</span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-800 text-sm">
              {stats.kids || 0}
            </span>
            <span>Kind</span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-800 text-sm">
              {stats.babies || 0}
            </span>
            <span>Baby</span>
          </div>
        </div>
      </div>
      <div className="bg-teal-50 p-1.5 text-center text-[10px] font-bold text-teal-700 border-t border-teal-100 rounded-b-xl">
        Bekijk Details
      </div>
    </Card>
  );
};

const CharactersWidget = ({ todaysCharacters, onViewCharacters }) => {
  return (
    <Card
      className="p-0 h-full flex flex-col cursor-pointer hover:shadow-md"
      borderColor={C.Pine}
      onClick={onViewCharacters}
    >
      <div
        className="px-4 py-3 font-bold text-white flex justify-between items-center rounded-t-xl"
        style={{ backgroundColor: C.Pine }}
      >
        <span className="flex items-center gap-2">
          <Smile size={20} /> Karakters Vandaag
        </span>
        <span className="text-xs bg-white/20 px-2 py-1 rounded flex items-center gap-1">
          Ga naar Karakters <ChevronRight size={12} />
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar p-3">
        {todaysCharacters.length > 0 ? (
          todaysCharacters.map((c) => (
            <div
              key={c.role + c.id}
              className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: getCharColorInfo(c.role).bg }}
                >
                  {c.role[0]}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">
                    {c.role}
                  </div>
                  <div className="text-[10px] text-gray-500">{c.actor}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 italic text-xs">
            <Smile size={24} className="mb-2 opacity-20" />
            Geen karakters
          </div>
        )}
      </div>
    </Card>
  );
};

const BirthdayWidget = ({ staffList, currentDay }) => {
  const getBirthdays = () => {
    return staffList.filter((s) => {
      if (!s.dob) return false;
      const d = new Date(s.dob);
      return (
        d.getDate() === currentDay.getDate() &&
        d.getMonth() === currentDay.getMonth()
      );
    });
  };
  const birthdays = getBirthdays();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (birthdays.length > 0) {
      setShowConfetti(true);
    }
  }, [birthdays.length]);

  if (birthdays.length === 0) return null;

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="bg-white p-3 rounded-xl border-l-4 border-pink-400 shadow-sm flex items-center gap-3 animate-in fade-in mb-4">
        <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
          <Gift size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-pink-700">
            Hieperdepiep Hoera!
          </h4>
          {birthdays.map((b) => (
            <p key={b.name} className="text-xs text-gray-600 font-medium">
              {b.name} is {calculateAge(b.dob)} jaar geworden! 🎉
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

// --- VIEWS ---

const OccupancyView = ({ dailyStats, currentDay }) => {
  const dateKey = toIsoDate(currentDay);
  const stats = dailyStats?.[dateKey] || {
    total: 0,
    breakdown: {},
    adults: 0,
    kids: 0,
    babies: 0,
    villas: 0,
  };
  const total =
    stats.total > 0
      ? stats.total
      : (stats.adults || 0) + (stats.kids || 0) + (stats.babies || 0);
  const StatCard = ({ icon: Icon, label, value, sub, bg, text }) => (
    <Card className="p-4 flex items-center shadow-sm">
      <div
        className="p-3 rounded-xl mr-4 shadow-sm"
        style={{ backgroundColor: bg, color: text }}
      >
        <Icon size={24} />
      </div>
      <div>
        <p
          className="text-xs font-bold uppercase opacity-70"
          style={{ color: C.Bark }}
        >
          {label}
        </p>
        <p className="text-2xl font-extrabold" style={{ color: C.Bark }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs opacity-60" style={{ color: C.Bark }}>
            {sub}
          </p>
        )}
      </div>
    </Card>
  );
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2
        className="text-xl font-bold mb-4 flex items-center"
        style={{ color: C.Pine }}
      >
        <PieChart className="mr-2" /> Bezetting Details:{" "}
        {toDutchDate(currentDay)}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Users}
          label="Totaal"
          value={total}
          bg={C.Pine}
          text={C.Grass}
        />
        <StatCard
          icon={Home}
          label="Huisjes"
          value={stats.villas || "?"}
          sub="bezet"
          bg={C.Lagoon}
          text={C.Sky}
        />
        <StatCard
          icon={User}
          label="Volwassenen"
          value={stats.adults || 0}
          bg={C.Bark}
          text={C.Honey}
        />
        <StatCard
          icon={Smile}
          label="Kinderen"
          value={stats.kids || 0}
          bg={C.Sunset}
          text={C.Blossom}
        />
        <StatCard
          icon={Baby}
          label="Baby's"
          value={stats.babies || 0}
          bg={C.Blossom}
          text={C.Sunset}
        />
      </div>
      <Card className="overflow-hidden">
        <div className="px-4 py-3 border-b font-bold text-sm bg-gray-50 text-gray-700 flex justify-between items-center">
          <span>Nationaliteiten</span>
          <Globe size={16} />
        </div>
        <div className="divide-y" style={{ borderColor: "#f0f0f0" }}>
          {NATIONALITIES.map((nat) => {
            const count = stats.breakdown?.[nat.k] || 0;
            const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            return (
              <div
                key={nat.k}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl filter drop-shadow-sm">
                    {nat.i}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {nat.l}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-teal-900">
                    {count}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      ({percent}%)
                    </span>
                  </span>
                  <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-teal-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

const HandoverSection = ({
  title,
  icon: Icon,
  colorBg,
  colorText,
  logs,
  setLogs,
  loggedInUserName,
  legacyText,
  userRole,
  onUpdate,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      text: newMessage.trim(),
      author: loggedInUserName || "Onbekend",
      time: new Date().toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updatedLogs = [...logs, msg];
    setLogs(updatedLogs);
    onUpdate(updatedLogs);
    setNewMessage("");
  };
  const handleDelete = (id) => {
    const updatedLogs = logs.filter((msg) => msg.id !== id);
    setLogs(updatedLogs);
    onUpdate(updatedLogs);
    setConfirmDeleteId(null);
  };
  return (
    <Card
      className="overflow-hidden border-t-4 flex flex-col h-[500px]"
      borderColor={colorText}
      style={{ borderTopColor: colorText }}
    >
      <div
        className="p-3 border-b flex items-center gap-2 font-bold"
        style={{
          backgroundColor: colorBg,
          color: colorText,
          borderColor: colorText,
        }}
      >
        <Icon size={18} /> {title} Logboek
      </div>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{ backgroundColor: C.Bg }}
        ref={scrollRef}
      >
        {legacyText && (
          <div className="p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm italic border border-gray-300 bg-white text-gray-600">
            <strong>Oude notitie:</strong>
            <br />
            {legacyText}
          </div>
        )}
        {logs.length === 0 && !legacyText && (
          <div className="text-center text-xs italic mt-10 opacity-50">
            Nog geen bijzonderheden gemeld vandaag.
          </div>
        )}
        {logs.map((msg) => {
          const isMine = msg.author === loggedInUserName;
          const canDelete = userRole === "fm" || isMine;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isMine ? "items-end" : "items-start"
              } group`}
            >
              <div className="flex items-end gap-2">
                {canDelete && (
                  <button
                    onClick={() => setConfirmDeleteId(msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mb-2"
                    style={{ color: C.Sunset }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                    isMine ? "rounded-tr-none" : "rounded-tl-none border"
                  }`}
                  style={{
                    backgroundColor: isMine ? C.Grass : C.White,
                    color: isMine ? C.Pine : C.Lagoon,
                    borderColor: isMine ? "transparent" : C.Grass,
                  }}
                >
                  {msg.text}
                </div>
              </div>
              <div
                className="text-[10px] mt-1 px-1"
                style={{ color: C.Bark, opacity: 0.7 }}
              >
                {msg.author} • {msg.time}
              </div>
              {confirmDeleteId === msg.id && (
                <div
                  className="p-2 rounded border flex items-center gap-2 mt-1"
                  style={{ backgroundColor: C.White, borderColor: C.Sunset }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: C.Sunset }}
                  >
                    Wissen?
                  </span>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-xs text-white px-2 py-1 rounded"
                    style={{ backgroundColor: C.Sunset }}
                  >
                    Ja
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: C.Bg, color: C.Bark }}
                  >
                    Nee
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:border-teal-500"
          placeholder="Typ bericht..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-2 rounded-full text-white transition-colors"
          style={{ backgroundColor: C.Pine }}
        >
          <Send size={18} />
        </button>
      </div>
    </Card>
  );
};

const HandoverView = ({
  currentDay,
  appData,
  updateData,
  loggedInUserName,
  userRole,
}) => {
  const dateKey = toIsoDate(currentDay);
  const dayData = appData.handover?.[dateKey] || {};
  const [entLogs, setEntLogs] = useState(
    Array.isArray(dayData.ent?.logs) ? dayData.ent.logs : []
  );
  const [creaLogs, setCreaLogs] = useState(
    Array.isArray(dayData.crea?.logs) ? dayData.crea.logs : []
  );
  const entLegacy =
    typeof dayData.ent?.text === "string" ? dayData.ent.text : null;
  const creaLegacy =
    typeof dayData.crea?.text === "string" ? dayData.crea.text : null;
  useEffect(() => {
    const d = appData.handover?.[dateKey] || {};
    setEntLogs(Array.isArray(d.ent?.logs) ? d.ent.logs : []);
    setCreaLogs(Array.isArray(d.crea?.logs) ? d.crea.logs : []);
  }, [dateKey, appData.handover]);
  const saveHandover = async (type, updatedLogs) => {
    const current = appData.handover?.[dateKey] || {};
    const newHandover = {
      ...appData.handover,
      [dateKey]: {
        ...current,
        ent:
          type === "ent"
            ? { logs: updatedLogs, text: entLegacy }
            : current.ent || { logs: entLogs, text: entLegacy },
        crea:
          type === "crea"
            ? { logs: updatedLogs, text: creaLegacy }
            : current.crea || { logs: creaLogs, text: creaLegacy },
        lastModifiedBy: loggedInUserName,
        lastModifiedAt: new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    };
    await updateData({ handover: newHandover });
  };
  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-bold flex items-center"
          style={{ color: C.Pine }}
        >
          <BookOpen className="mr-2" /> Overdracht
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <HandoverSection
          title="Entertainment"
          icon={Mic}
          colorBg={C.Honey}
          colorText={C.Bark}
          logs={entLogs}
          setLogs={setEntLogs}
          loggedInUserName={loggedInUserName}
          userRole={userRole}
          legacyText={entLegacy}
          onUpdate={(logs) => saveHandover("ent", logs)}
        />
        <HandoverSection
          title="Crea Atelier"
          icon={Palette}
          colorBg={C.Sky}
          colorText={C.Lagoon}
          logs={creaLogs}
          setLogs={setCreaLogs}
          loggedInUserName={loggedInUserName}
          userRole={userRole}
          legacyText={creaLegacy}
          onUpdate={(logs) => saveHandover("crea", logs)}
        />
      </div>
    </div>
  );
};

// --- ADMIN VIEWS ---

const EditStats = ({
  appData,
  updateData,
  setAdminSubView,
  currentDay,
  onPrev,
  onNext,
  onCalendar,
}) => {
  const startFriday = getFridayOfWeek(currentDay);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startFriday);
    d.setDate(startFriday.getDate() + i);
    weekDates.push(d);
  }

  const updateWeekStat = (dateObj, field, val, subField = null) => {
    const dateKey = toIsoDate(dateObj);
    const currentStats = appData.dailyStats?.[dateKey] || {
      total: 0,
      adults: 0,
      kids: 0,
      babies: 0,
      villas: 0,
      breakdown: {},
    };

    let newStats = { ...currentStats };
    const intVal = parseInt(val) || 0;

    if (subField) {
      newStats.breakdown = { ...newStats.breakdown, [subField]: intVal };
    } else {
      newStats[field] = intVal;
      if (["adults", "kids", "babies"].includes(field)) {
        newStats.total =
          (newStats.adults || 0) +
          (newStats.kids || 0) +
          (newStats.babies || 0);
      }
    }

    updateData({ dailyStats: { ...appData.dailyStats, [dateKey]: newStats } });
  };

  return (
    <AdminContainer
      title={`Bezetting Week (${toDutchDate(startFriday)})`}
      backAction={() => setAdminSubView("menu")}
      currentDay={currentDay}
      onPrev={onPrev}
      onNext={onNext}
      onCalendar={onCalendar}
    >
      <Card className="p-0 overflow-hidden" borderColor={C.Grass}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="p-2 border min-w-[80px] sticky left-0 bg-teal-700 z-10">
                  Dag
                </th>
                <th className="p-2 border min-w-[60px]">Cottages</th>
                <th className="p-2 border min-w-[50px]">Volw</th>
                <th className="p-2 border min-w-[50px]">Kind</th>
                <th className="p-2 border min-w-[50px]">Baby</th>
                <th className="p-2 border min-w-[60px] bg-teal-800 font-bold">
                  Totaal
                </th>
                {NATIONALITIES.map((nat) => (
                  <th
                    key={nat.k}
                    className="p-2 border min-w-[50px] text-center"
                    style={{
                      backgroundColor: nat.color,
                      color: "#fff",
                      textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                    }}
                  >
                    {nat.i} {nat.k.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map((dateObj) => {
                const dateKey = toIsoDate(dateObj);
                const stats = appData.dailyStats?.[dateKey] || {
                  total: 0,
                  adults: 0,
                  kids: 0,
                  babies: 0,
                  villas: 0,
                  breakdown: {},
                };
                const autoTotal =
                  (stats.adults || 0) + (stats.kids || 0) + (stats.babies || 0);

                return (
                  <tr key={dateKey} className="hover:bg-gray-50 border-b">
                    <td className="p-2 border font-bold sticky left-0 bg-white z-10">
                      {toDutchDate(dateObj).split(" ")[0]} {dateObj.getDate()}
                    </td>
                    <td className="p-1 border">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={stats.villas || ""}
                        onChange={(e) =>
                          updateWeekStat(dateObj, "villas", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-1 border">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={stats.adults || ""}
                        onChange={(e) =>
                          updateWeekStat(dateObj, "adults", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-1 border">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={stats.kids || ""}
                        onChange={(e) =>
                          updateWeekStat(dateObj, "kids", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-1 border">
                      <input
                        type="number"
                        className="w-full p-1 border rounded"
                        value={stats.babies || ""}
                        onChange={(e) =>
                          updateWeekStat(dateObj, "babies", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2 border font-bold text-center bg-gray-50">
                      {autoTotal}
                    </td>
                    {NATIONALITIES.map((nat) => (
                      <td key={nat.k} className="p-1 border">
                        <input
                          type="number"
                          className="w-full p-1 border rounded text-center"
                          value={stats.breakdown?.[nat.k] || ""}
                          onChange={(e) =>
                            updateWeekStat(
                              dateObj,
                              "breakdown",
                              e.target.value,
                              nat.k
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminContainer>
  );
};

const EditChars = ({
  currentDay,
  appData,
  updateData,
  setAdminSubView,
  onPrev,
  onNext,
  onCalendar,
}) => {
  const dateKey = toIsoDate(currentDay);
  const chars = appData.characters.filter((c) => c.date === dateKey);
  const [customRole, setCustomRole] = useState("");
  const updateChar = (role, actor) => {
    const existing = appData.characters.filter(
      (c) => !(c.date === dateKey && c.role === role)
    );
    updateData({
      characters: [...existing, { id: Date.now(), date: dateKey, role, actor }],
    });
  };
  const addCustom = () => {
    if (!customRole) return;
    updateData({
      characters: [
        ...appData.characters,
        { id: Date.now(), date: dateKey, role: customRole, actor: "" },
      ],
    });
    setCustomRole("");
  };
  return (
    <AdminContainer
      title="Karakters"
      backAction={() => setAdminSubView("menu")}
      currentDay={currentDay}
      onPrev={onPrev}
      onNext={onNext}
      onCalendar={onCalendar}
    >
      <div className="space-y-2">
        {BASE_ROLES.map((role) => {
          const current = chars.find((c) => c.role === role);
          return (
            <Card
              key={role}
              className="p-3 flex justify-between items-center"
              borderColor={C.Grass}
            >
              <div className="font-bold" style={{ color: C.Pine }}>
                {role}
              </div>
              <select
                className="border p-2 rounded"
                value={current?.actor || ""}
                onChange={(e) => updateChar(role, e.target.value)}
              >
                <option value="">Kies...</option>
                {appData.staffList.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Card>
          );
        })}
        {chars
          .filter((c) => !BASE_ROLES.includes(c.role))
          .map((c) => (
            <Card
              key={c.id}
              className="p-3 flex justify-between items-center"
              borderColor={C.Grass}
            >
              <div className="font-bold" style={{ color: C.Pine }}>
                {c.role}
              </div>
              <select
                className="border p-2 rounded"
                value={c.actor || ""}
                onChange={(e) => updateChar(c.role, e.target.value)}
              >
                <option value="">Kies...</option>
                {appData.staffList.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Card>
          ))}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Extra karakter..."
            className="border p-2 rounded flex-1"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
          />
          <button
            onClick={addCustom}
            className="text-white px-4 rounded font-bold"
            style={{ backgroundColor: C.Pine }}
          >
            Toevoegen
          </button>
        </div>
      </div>
    </AdminContainer>
  );
};

const EditHours = ({
  setAdminSubView,
  appData,
  updateData,
  showConfirm,
  onPrev,
  onNext,
  onCalendar,
  currentDay,
}) => {
  const [tab, setTab] = useState("open");
  const allCorrections = appData.hourCorrections || [];
  const corrections =
    tab === "open"
      ? allCorrections.filter((c) => !c.processed)
      : allCorrections.filter((c) => c.processed);

  // Auto-delete logic: Remove processed items older than 2 weeks
  useEffect(() => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const filtered = allCorrections.filter((c) => {
      // Keep open ones
      if (!c.processed) return true;
      // Filter processed based on timestamp (c.id is used as creation timestamp here)
      return c.id > twoWeeksAgo.getTime();
    });

    if (filtered.length !== allCorrections.length) {
      updateData({ hourCorrections: filtered });
    }
  }, []);

  return (
    <AdminContainer
      title="Uren"
      backAction={() => setAdminSubView("menu")}
      currentDay={currentDay}
      onPrev={onPrev}
      onNext={onNext}
      onCalendar={onCalendar}
    >
      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setTab("open")}
          className={`flex-1 py-2 rounded-md text-xs font-bold ${
            tab === "open" ? "bg-white shadow text-teal-800" : "text-gray-500"
          }`}
        >
          Openstaand
        </button>
        <button
          onClick={() => setTab("processed")}
          className={`flex-1 py-2 rounded-md text-xs font-bold ${
            tab === "processed"
              ? "bg-white shadow text-teal-800"
              : "text-gray-500"
          }`}
        >
          Verwerkt
        </button>
      </div>

      <div className="space-y-2">
        {corrections.map((c) => (
          <div
            key={c.id}
            className="p-3 border rounded bg-white flex justify-between items-center"
          >
            <div>
              <div className="font-bold" style={{ color: C.Pine }}>
                {c.name}
              </div>
              <div className="text-xs text-gray-500">
                {c.date} | {c.start}-{c.end} ({c.code})
              </div>
              <div className="text-xs italic text-gray-500">{c.reason}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateData({
                    hourCorrections: allCorrections.map((x) =>
                      x.id === c.id ? { ...x, processed: !x.processed } : x
                    ),
                  })
                }
                className={`p-2 rounded`}
                style={{
                  backgroundColor: c.processed ? C.Bg : C.Grass,
                  color: C.Pine,
                }}
              >
                {c.processed ? (
                  <ArrowLeft size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}
              </button>
              <button
                onClick={() =>
                  showConfirm("Wissen?", () =>
                    updateData({
                      hourCorrections: allCorrections.filter(
                        (x) => x.id !== c.id
                      ),
                    })
                  )
                }
                className="p-2 rounded"
                style={{
                  backgroundColor: C.White,
                  borderColor: C.Sunset,
                  borderWidth: 1,
                  color: C.Sunset,
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {corrections.length === 0 && (
          <p className="text-center text-gray-400">
            Geen correcties in deze lijst.
          </p>
        )}
      </div>
    </AdminContainer>
  );
};

const EditOrders = ({
  setAdminSubView,
  appData,
  updateData,
  showConfirm,
  onPrev,
  onNext,
  onCalendar,
  currentDay,
}) => {
  const orders = appData.orders || [];
  return (
    <AdminContainer
      title="Bestellingen"
      backAction={() => setAdminSubView("menu")}
      currentDay={currentDay}
      onPrev={onPrev}
      onNext={onNext}
      onCalendar={onCalendar}
    >
      <div className="space-y-2">
        {orders.map((o) => (
          <div
            key={o.id}
            className="p-3 border rounded bg-white flex justify-between items-center"
          >
            <div>
              <div className="font-bold" style={{ color: C.Pine }}>
                {o.item}
              </div>
              <div className="text-xs text-gray-500">
                {o.who} - {o.date}
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="text-xs border rounded p-1"
                value={o.status}
                onChange={(e) =>
                  updateData({
                    orders: orders.map((x) =>
                      x.id === o.id ? { ...x, status: e.target.value } : x
                    ),
                  })
                }
              >
                <option value="open">Open</option>
                <option value="ordered">Besteld</option>
                <option value="received">Binnen</option>
              </select>
              <button
                onClick={() =>
                  showConfirm("Wissen?", () =>
                    updateData({ orders: orders.filter((x) => x.id !== o.id) })
                  )
                }
                style={{ color: C.Sunset }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-400">Geen bestellingen.</p>
        )}
      </div>
    </AdminContainer>
  );
};

const EditSettings = ({
  setAdminSubView,
  appData,
  updateData,
  resetAllData,
  showAlert,
  showConfirm,
}) => {
  const [pin, setPin] = useState(appData.settings.pin);
  const [coPin, setCoPin] = useState(appData.settings.coPin);
  const [newName, setNewName] = useState("");

  const updateStaff = (name, field, val) => {
    const newList = appData.staffList.map((s) =>
      s.name === name ? { ...s, [field]: val } : s
    );
    updateData({ staffList: newList });
  };

  const resetPin = (name) => {
    showConfirm(
      `Weet je zeker dat je de pincode van ${name} wilt resetten naar 0000?`,
      () => {
        const newList = appData.staffList.map((s) =>
          s.name === name ? { ...s, pin: "0000", forcePinChange: true } : s
        );
        updateData({ staffList: newList });
        showAlert("Pincode gereset naar 0000");
      }
    );
  };

  const resetAllPins = () => {
    showConfirm(
      "Weet je zeker dat je ALLE medewerkerspincodes wilt resetten naar 0000?",
      () => {
        const newList = appData.staffList.map((s) => ({
          ...s,
          pin: "0000",
          forcePinChange: true,
        }));
        updateData({ staffList: newList });
        showAlert("Alle pincodes gereset.");
      }
    );
  };

  return (
    <AdminContainer
      title="Instellingen"
      backAction={() => setAdminSubView("menu")}
      hideDateControls={true}
    >
      <Card className="p-4 mb-4" borderColor={C.Pine}>
        <h3 className="font-bold mb-2" style={{ color: C.Pine }}>
          Pincodes
        </h3>
        <div className="flex gap-2 mb-2 items-center">
          <label className="text-xs w-16">FM Pin:</label>
          <input
            type="number"
            className="border p-2 rounded flex-1"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mb-2 items-center">
          <label className="text-xs w-16">CO Pin:</label>
          <input
            type="number"
            className="border p-2 rounded flex-1"
            value={coPin}
            onChange={(e) => setCoPin(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            updateData({ settings: { ...appData.settings, pin, coPin } });
            showAlert("Opgeslagen");
          }}
          className="text-white px-4 rounded font-bold w-full py-2"
          style={{ backgroundColor: C.Pine }}
        >
          Opslaan
        </button>
      </Card>
      <Card className="p-4 mb-4" borderColor={C.Grass}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold" style={{ color: C.Pine }}>
            Medewerkers
          </h3>
          <button
            onClick={resetAllPins}
            className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold border border-red-200"
          >
            Reset Alle Pincodes
          </button>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Naam"
            className="border p-2 rounded flex-1"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={() => {
              if (newName) {
                updateData({
                  staffList: [
                    ...appData.staffList,
                    { name: newName, pin: "0000", forcePinChange: true },
                  ],
                });
                setNewName("");
              }
            }}
            className="text-white px-4 rounded font-bold"
            style={{ backgroundColor: C.Pine }}
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {appData.staffList.map((s) => (
            <div
              key={s.name}
              className="p-2 rounded border"
              style={{ backgroundColor: C.Bg, borderColor: C.Grass }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold" style={{ color: C.Pine }}>
                  {s.name}
                </span>
                <div className="flex items-center gap-2">
                  {s.lastLogin && (
                    <span className="text-[10px] text-gray-400">
                      Laatst:{" "}
                      {new Date(s.lastLogin).toLocaleDateString("nl-NL", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  <button
                    onClick={() => resetPin(s.name)}
                    className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold border border-orange-200"
                  >
                    Reset Pin
                  </button>
                  <button
                    onClick={() =>
                      showConfirm("Wissen?", () =>
                        updateData({
                          staffList: appData.staffList.filter(
                            (x) => x.name !== s.name
                          ),
                        })
                      )
                    }
                    style={{ color: C.Sunset }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  className="text-xs p-1 border rounded"
                  placeholder="Pin"
                  value={s.pin}
                  onChange={(e) => updateStaff(s.name, "pin", e.target.value)}
                />
                <input
                  type="text"
                  className="text-xs p-1 border rounded"
                  placeholder="Tel"
                  value={s.phone || ""}
                  onChange={(e) => updateStaff(s.name, "phone", e.target.value)}
                />
                <input
                  type="date"
                  className="text-xs p-1 border rounded"
                  value={s.dob || ""}
                  onChange={(e) => updateStaff(s.name, "dob", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <button
        onClick={resetAllData}
        className="w-full p-4 font-bold rounded-xl border"
        style={{
          backgroundColor: C.White,
          color: C.Sunset,
          borderColor: C.Sunset,
        }}
      >
        Reset Alle Data
      </button>
    </AdminContainer>
  );
};

const EditPhoneDirectory = ({
  appData,
  updateData,
  showAlert,
  showConfirm,
  backAction,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState(C.Pine);
  const moveEntry = (id, direction) => {
    const index = appData.phoneDirectory.findIndex((p) => p.id === id);
    if (index < 0) return;
    const newDir = [...appData.phoneDirectory];
    if (index + direction < 0 || index + direction >= newDir.length) return;
    const temp = newDir[index];
    newDir[index] = newDir[index + direction];
    newDir[index + direction] = temp;
    updateData({ phoneDirectory: newDir });
  };

  const updatePhoneColor = (id, newColor) => {
    const newDir = appData.phoneDirectory.map((p) =>
      p.id === id ? { ...p, color: newColor } : p
    );
    updateData({ phoneDirectory: newDir });
  };

  return (
    <AdminContainer
      title="Telefoonlijst"
      backAction={backAction}
      hideDateControls={true}
    >
      <Card className="p-4 mb-4" borderColor={C.Grass}>
        <h4
          className="text-xs font-bold uppercase mb-2"
          style={{ color: C.Pine }}
        >
          Nieuwe Toevoegen
        </h4>
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Naam"
            className="border p-2 rounded flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Tel"
            className="border p-2 rounded w-24"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setColor(opt.value)}
              className={`w-6 h-6 rounded-full border-2 ${
                color === opt.value ? "ring-2 ring-offset-1 ring-gray-400" : ""
              }`}
              style={{ backgroundColor: opt.value, borderColor: C.Pine }}
            />
          ))}
        </div>
        <button
          onClick={() => {
            if (name && phone) {
              updateData({
                phoneDirectory: [
                  ...appData.phoneDirectory,
                  { id: Date.now(), name, phone, color },
                ],
              });
              setName("");
              setPhone("");
            }
          }}
          className="text-white px-4 py-2 rounded w-full font-bold"
          style={{ backgroundColor: C.Pine }}
        >
          Toevoegen
        </button>
      </Card>
      <div className="space-y-2">
        {appData.phoneDirectory.map((p, index) => (
          <div
            key={p.id}
            className="p-3 bg-white border rounded flex justify-between items-center"
            style={{
              borderLeftWidth: 6,
              borderLeftColor: p.color || C.Pine,
            }}
          >
            <div>
              <b style={{ color: C.Pine }}>{p.name}</b>
              <br />
              <span className="text-xs text-gray-500">{p.phone}</span>
              {/* Color editing for existing items */}
              <div className="flex gap-1 mt-2">
                {COLOR_OPTIONS.map((c) => (
                  <div
                    key={c.value}
                    onClick={() => updatePhoneColor(p.id, c.value)}
                    className={`w-3 h-3 rounded-full cursor-pointer ${
                      p.color === c.value
                        ? "ring-1 ring-offset-1 ring-black"
                        : ""
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => moveEntry(p.id, -1)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-teal-600 disabled:opacity-20"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => moveEntry(p.id, 1)}
                disabled={index === appData.phoneDirectory.length - 1}
                className="p-1 text-gray-400 hover:text-teal-600 disabled:opacity-20"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() =>
                  showConfirm("Wissen?", () =>
                    updateData({
                      phoneDirectory: appData.phoneDirectory.filter(
                        (x) => x.id !== p.id
                      ),
                    })
                  )
                }
              >
                <Trash2 size={16} style={{ color: C.Sunset }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminContainer>
  );
};

// --- NIEUWE TAKEN PLANNER MET DAGLIJST WEERGAVE EN DATUM OPTIE ---

const AdminTasksView = ({
  currentDay,
  backAction,
  updateData,
  appData,
  showConfirm,
  onPrev,
  onNext,
  onCalendar,
}) => {
  const [activeTab, setActiveTab] = useState("planner");
  const [plannerTask, setPlannerTask] = useState("");
  const [targetType, setTargetType] = useState("entertainment"); // ent, crea, both, extra
  const [plannerPrio, setPlannerPrio] = useState("low");
  const [plannerCat, setPlannerCat] = useState("general");
  const [isRecurring, setIsRecurring] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const [singleDate, setSingleDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewDayId, setViewDayId] = useState(1);
  const [viewExtra, setViewExtra] = useState(false);

  // If type is extra, force recurring off and clear days, as it's global
  useEffect(() => {
    if (targetType === "extra") {
      setIsRecurring(false);
      setSelectedDays([]);
    }
  }, [targetType]);

  const handlePlannerSubmit = () => {
    if (!plannerTask) return;

    if (isRecurring && selectedDays.length === 0 && targetType !== "extra") {
      alert("Selecteer minimaal één dag.");
      return;
    }

    const typesToAdd =
      targetType === "both" ? ["entertainment", "crea"] : [targetType];

    if (targetType === "extra") {
      // Global Extra Task
      const newChecklists = [...appData.checklists];
      newChecklists.push({
        id: Date.now(),
        text: plannerTask,
        type: "extra",
        priority: plannerPrio,
        category: plannerCat,
        date: "global",
        done: false,
      });
      updateData({ checklists: newChecklists });
    } else if (isRecurring) {
      // Add to templates
      const newTemplates = { ...appData.checklistTemplates };
      selectedDays.forEach((dayId) => {
        if (!newTemplates[dayId])
          newTemplates[dayId] = { entertainment: [], crea: [], extra: [] };

        typesToAdd.forEach((type) => {
          if (!newTemplates[dayId][type]) newTemplates[dayId][type] = [];
          newTemplates[dayId][type].push({
            id: Date.now() + Math.random(),
            text: plannerTask,
            priority: plannerPrio,
            type: type,
            category: plannerCat,
          });
        });
      });
      updateData({ checklistTemplates: newTemplates });
    } else {
      // Single Date
      const newChecklists = [...appData.checklists];
      const dateKey = singleDate;

      typesToAdd.forEach((type) => {
        newChecklists.push({
          id: Date.now() + Math.random(),
          text: plannerTask,
          type: type,
          priority: plannerPrio,
          category: plannerCat,
          date: dateKey,
          done: false,
        });
      });
      updateData({ checklists: newChecklists });
    }

    setPlannerTask("");
    if (!isRecurring && targetType !== "extra")
      setSingleDate(new Date().toISOString().split("T")[0]);
  };

  const toggleDay = (id) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const deleteTemplateTask = (dayId, type, taskId) => {
    const newTemplates = { ...appData.checklistTemplates };
    if (newTemplates[dayId] && newTemplates[dayId][type]) {
      newTemplates[dayId][type] = newTemplates[dayId][type].filter(
        (t) => t.id !== taskId
      );
      updateData({ checklistTemplates: newTemplates });
    }
  };

  const deleteExtraTask = (taskId) => {
    const newChecklists = appData.checklists.filter((t) => t.id !== taskId);
    updateData({ checklists: newChecklists });
  };

  const deleteSpecificTask = (taskId) => {
    const newChecklists = appData.checklists.filter((t) => t.id !== taskId);
    updateData({ checklists: newChecklists });
  };

  const moveTemplateTask = (dayId, type, index, direction) => {
    const newTemplates = { ...appData.checklistTemplates };
    if (!newTemplates[dayId] || !newTemplates[dayId][type]) return;

    const list = newTemplates[dayId][type];
    if (index + direction < 0 || index + direction >= list.length) return;

    const temp = list[index];
    list[index] = list[index + direction];
    list[index + direction] = temp;

    updateData({ checklistTemplates: newTemplates });
  };

  const moveExtraTask = (index, direction) => {
    const extraList = appData.checklists.filter(
      (t) => t.type === "extra" && t.date === "global"
    );
    const otherTasks = appData.checklists.filter(
      (t) => !(t.type === "extra" && t.date === "global")
    );

    if (index + direction < 0 || index + direction >= extraList.length) return;

    // Swap in local array
    const temp = extraList[index];
    extraList[index] = extraList[index + direction];
    extraList[index + direction] = temp;

    // Recombine. Note: Order matters for extra list visualization if we rely on array order.
    updateData({ checklists: [...otherTasks, ...extraList] });
  };

  const renderTemplateList = (dayId) => {
    const dayTemplates = appData.checklistTemplates?.[dayId] || {
      entertainment: [],
      crea: [],
      extra: [],
    };
    return (
      <div className="space-y-4">
        {["entertainment", "crea"].map((type) => {
          const tasks = dayTemplates[type] || [];
          if (tasks.length === 0) return null;
          return (
            <div key={type} className="bg-white p-3 rounded border">
              <h4
                className="font-bold text-sm uppercase mb-2"
                style={{ color: type === "entertainment" ? C.Honey : C.Sky }}
              >
                {type}
              </h4>
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center text-sm py-1 border-b last:border-0"
                >
                  <span className="flex-1">
                    {safeRenderText(task.text)}{" "}
                    <span className="text-[10px] text-gray-400">
                      ({TASK_CATS[task.category]?.label})
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col mr-2">
                      <button
                        onClick={() => moveTemplateTask(dayId, type, idx, -1)}
                        disabled={idx === 0}
                      >
                        <ArrowUp
                          size={12}
                          className="text-gray-400 hover:text-teal-600"
                        />
                      </button>
                      <button
                        onClick={() => moveTemplateTask(dayId, type, idx, 1)}
                        disabled={idx === tasks.length - 1}
                      >
                        <ArrowDown
                          size={12}
                          className="text-gray-400 hover:text-teal-600"
                        />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        showConfirm("Verwijder sjabloon taak?", () =>
                          deleteTemplateTask(dayId, type, task.id)
                        )
                      }
                      className="text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        {!dayTemplates.entertainment?.length && !dayTemplates.crea?.length && (
          <p className="text-gray-400 text-sm italic">
            Geen sjablonen voor deze dag.
          </p>
        )}
      </div>
    );
  };

  const renderExtraList = () => {
    // Filter the global extra tasks
    const extraTasks = appData.checklists.filter(
      (t) => t.type === "extra" && t.date === "global"
    );

    return (
      <div className="bg-white p-3 rounded border">
        <h4
          className="font-bold text-sm uppercase mb-2"
          style={{ color: C.Sunset }}
        >
          Extra (Altijd zichtbaar)
        </h4>
        {extraTasks.map((task, idx) => (
          <div
            key={task.id}
            className="flex justify-between items-center text-sm py-1 border-b last:border-0"
          >
            <span className="flex-1">
              {safeRenderText(task.text)}{" "}
              <span className="text-[10px] text-gray-400">
                ({TASK_CATS[task.category]?.label})
              </span>
            </span>
            <div className="flex items-center gap-1">
              <div className="flex flex-col mr-2">
                <button
                  onClick={() => moveExtraTask(idx, -1)}
                  disabled={idx === 0}
                >
                  <ArrowUp
                    size={12}
                    className="text-gray-400 hover:text-teal-600"
                  />
                </button>
                <button
                  onClick={() => moveExtraTask(idx, 1)}
                  disabled={idx === extraTasks.length - 1}
                >
                  <ArrowDown
                    size={12}
                    className="text-gray-400 hover:text-teal-600"
                  />
                </button>
              </div>
              <button
                onClick={() =>
                  showConfirm("Verwijder extra taak?", () =>
                    deleteExtraTask(task.id)
                  )
                }
                className="text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {extraTasks.length === 0 && (
          <p className="text-gray-400 text-sm italic">Geen extra taken.</p>
        )}
      </div>
    );
  };

  const renderSpecificDayList = () => {
    const dayKey = toIsoDate(currentDay);
    // This mimics getDailyTasks but includes all types for management view
    const specific = appData.checklists.filter((c) => c.date === dayKey);

    // We also want to show active templates so FM knows they exist
    // But template management is separate. Here we show ACTUAL active items.
    // Templates are 'virtual' until checked.
    // To properly manage, we should show the combined view.

    const currentWeekdayId = currentDay.getDay();
    const templates = [];
    ["entertainment", "crea"].forEach((type) => {
      const tpls = appData.checklistTemplates?.[currentWeekdayId]?.[type] || [];
      tpls.forEach((t) => templates.push({ ...t, isTemplate: true, type }));
    });

    // Merge logic similar to main app
    // We can't easily delete a template instance from here without "hiding" it for the day
    // For now, let's allow managing the specific tasks (one-offs)
    // and list templates as read-only with a link to template editor

    return (
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded">
          Hier beheer je de <strong>specifieke taken</strong> voor{" "}
          {toDutchDate(currentDay)}. Sjablonen beheer je in het tabblad 'Bekijk
          Sjablonen'.
        </div>

        {["entertainment", "crea", "extra"].map((type) => {
          const tasks = specific.filter((t) => t.type === type);
          if (tasks.length === 0 && type !== "extra") return null;
          if (type === "extra") {
            // Don't show global extras here to avoid confusion, only day-specific extras
            if (tasks.length === 0) return null;
          }

          return (
            <div key={type} className="bg-white p-3 rounded border">
              <h4
                className="font-bold text-sm uppercase mb-2"
                style={{ color: C.Pine }}
              >
                {type} (Losse taken)
              </h4>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center text-sm py-1 border-b last:border-0"
                >
                  <span className="flex-1">{safeRenderText(task.text)}</span>
                  <button
                    onClick={() =>
                      showConfirm("Verwijder deze dagtaak?", () =>
                        deleteSpecificTask(task.id)
                      )
                    }
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}

        {specific.length === 0 && (
          <p className="text-gray-400 text-sm italic">
            Geen losse dagtaken voor deze datum.
          </p>
        )}

        <div className="mt-4 border-t pt-4">
          <h4 className="font-bold text-sm text-gray-500 mb-2">
            Actieve Sjablonen (Alleen-lezen)
          </h4>
          {templates.map((t, i) => (
            <div key={i} className="text-xs text-gray-400 py-0.5 flex gap-2">
              <span className="uppercase font-bold w-10">
                {t.type.substring(0, 3)}
              </span>
              <span>{safeRenderText(t.text)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AdminContainer
      title="Takenbeheer"
      backAction={backAction}
      currentDay={currentDay}
      onPrev={onPrev}
      onNext={onNext}
      onCalendar={onCalendar}
    >
      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab("planner")}
          className={`flex-1 py-2 px-2 rounded-md text-xs font-bold whitespace-nowrap ${
            activeTab === "planner"
              ? "bg-white shadow text-teal-800"
              : "text-gray-500"
          }`}
        >
          Nieuwe Taak
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 px-2 rounded-md text-xs font-bold whitespace-nowrap ${
            activeTab === "list"
              ? "bg-white shadow text-teal-800"
              : "text-gray-500"
          }`}
        >
          Bekijk Sjablonen
        </button>
        <button
          onClick={() => setActiveTab("daylist")}
          className={`flex-1 py-2 px-2 rounded-md text-xs font-bold whitespace-nowrap ${
            activeTab === "daylist"
              ? "bg-white shadow text-teal-800"
              : "text-gray-500"
          }`}
        >
          Daglijst ({toDutchDate(currentDay)})
        </button>
      </div>

      {activeTab === "planner" && (
        <div className="space-y-4">
          <Card className="p-4" borderColor={C.Pine}>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
                Wat moet er gebeuren?
              </label>
              <input
                value={plannerTask}
                onChange={(e) => setPlannerTask(e.target.value)}
                placeholder="Taakomschrijving..."
                className="w-full border p-3 rounded-lg outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
                  Voor wie?
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full border p-2 rounded bg-white"
                >
                  <option value="entertainment">Entertainment</option>
                  <option value="crea">Crea Atelier</option>
                  <option value="both">Allebei</option>
                  <option value="extra">Extra (Algemeen)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
                  Categorie
                </label>
                <select
                  value={plannerCat}
                  onChange={(e) => setPlannerCat(e.target.value)}
                  className="w-full border p-2 rounded bg-white"
                >
                  {Object.values(TASK_CATS).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* COLORED BUTTONS FOR TYPE SELECTION */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTargetType("entertainment")}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  targetType === "entertainment"
                    ? "bg-yellow-400 text-white border-yellow-400"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
                style={{
                  backgroundColor:
                    targetType === "entertainment" ? C.Honey : undefined,
                  borderColor:
                    targetType === "entertainment" ? C.Honey : undefined,
                }}
              >
                Ent
              </button>
              <button
                onClick={() => setTargetType("crea")}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  targetType === "crea"
                    ? "bg-blue-400 text-white border-blue-400"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
                style={{
                  backgroundColor: targetType === "crea" ? C.Sky : undefined,
                  borderColor: targetType === "crea" ? C.Sky : undefined,
                }}
              >
                Crea
              </button>
              <button
                onClick={() => setTargetType("both")}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  targetType === "both"
                    ? "bg-purple-500 text-white border-purple-500"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                Beide
              </button>
              <button
                onClick={() => setTargetType("extra")}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  targetType === "extra"
                    ? "bg-red-700 text-white border-red-700"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
                style={{
                  backgroundColor:
                    targetType === "extra" ? C.Sunset : undefined,
                  borderColor: targetType === "extra" ? C.Sunset : undefined,
                }}
              >
                Extra
              </button>
            </div>

            {targetType !== "extra" && (
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase mb-2 text-gray-500">
                  Wanneer?
                </label>
                <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
                  <button
                    onClick={() => setIsRecurring(true)}
                    className={`flex-1 py-1 rounded text-xs font-bold ${
                      isRecurring
                        ? "bg-white shadow text-teal-800"
                        : "text-gray-500"
                    }`}
                  >
                    Terugkerend (Wekelijks)
                  </button>
                  <button
                    onClick={() => setIsRecurring(false)}
                    className={`flex-1 py-1 rounded text-xs font-bold ${
                      !isRecurring
                        ? "bg-white shadow text-teal-800"
                        : "text-gray-500"
                    }`}
                  >
                    Eenmalig (Datum)
                  </button>
                </div>

                {isRecurring ? (
                  <div className="flex justify-between gap-1">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                          selectedDays.includes(day.id)
                            ? "bg-teal-600 text-white shadow-lg transform scale-110"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                )}
              </div>
            )}

            {targetType === "extra" && (
              <div className="mb-4 p-2 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                <strong>Let op:</strong> Extra taken blijven in de lijst staan
                tot ze worden verwijderd en zijn niet gebonden aan een datum.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
                Prioriteit
              </label>
              <div className="flex gap-2">
                {Object.entries(PRIORITIES).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setPlannerPrio(key)}
                    className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                      plannerPrio === key
                        ? "ring-2 ring-offset-1 ring-teal-500"
                        : "opacity-60"
                    }`}
                    style={{
                      backgroundColor: p.bg,
                      borderColor: p.color,
                      color: p.color,
                    }}
                  >
                    <p.icon size={16} /> {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePlannerSubmit}
              className="w-full py-3 rounded-xl font-bold text-white shadow-lg mt-2"
              style={{ backgroundColor: C.Pine }}
            >
              Inplannen
            </button>
          </Card>
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b">
            <button
              onClick={() => setViewExtra(false)}
              className={`px-4 py-1 text-xs font-bold rounded-full ${
                !viewExtra
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Weekdagen
            </button>
            <button
              onClick={() => setViewExtra(true)}
              className={`px-4 py-1 text-xs font-bold rounded-full ${
                viewExtra
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Extra Lijst
            </button>
          </div>

          {!viewExtra ? (
            <>
              <div className="flex overflow-x-auto gap-2 pb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setViewDayId(day.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${
                      viewDayId === day.id
                        ? "bg-teal-600 text-white"
                        : "bg-white border text-gray-600"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <Card className="p-4" borderColor={C.Grass}>
                <h3 className="font-bold text-lg mb-4 text-teal-800">
                  Sjablonen voor{" "}
                  {DAYS_OF_WEEK.find((d) => d.id === viewDayId)?.label}
                </h3>
                {renderTemplateList(viewDayId)}
              </Card>
            </>
          ) : (
            <Card className="p-4" borderColor={C.Honey}>
              <h3 className="font-bold text-lg mb-4 text-orange-800">
                Extra Taken Beheer
              </h3>
              {renderExtraList()}
            </Card>
          )}
        </div>
      )}

      {activeTab === "daylist" && (
        <div className="space-y-4">
          <Card className="p-4" borderColor={C.Pine}>
            {renderSpecificDayList()}
          </Card>
        </div>
      )}
    </AdminContainer>
  );
};

// --- UPDATED SCHEDULE EDITOR WITH END TIME ---

const EditSchedule = ({
  currentDay,
  todaysSchedule,
  updateData,
  appData,
  setAdminSubView,
  onPrev,
  onNext,
  onCalendar,
}) => {
  const [viewMode, setViewMode] = useState("day");
  const [newItem, setNewItem] = useState({
    startTime: "",
    endTime: "",
    title: "",
    loc: "",
    locCustom: "",
    staff: [],
    type: "crea",
    maxPax: "",
    price: "",
    refhd: "",
    paris: false,
    villageMap: false,
    remarks: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleStaffChange = (e) => {
    const selected = e.target.value;
    if (selected && !newItem.staff.includes(selected))
      setNewItem({ ...newItem, staff: [...newItem.staff, selected] });
    e.target.value = "";
  };
  const removeStaff = (name) =>
    setNewItem({ ...newItem, staff: newItem.staff.filter((s) => s !== name) });

  const applyTemplate = (tplId) => {
    const tpl = (appData.activityTemplates || []).find(
      (t) => String(t.id) === String(tplId)
    );
    if (!tpl) return;
    const [start, end] = tpl.time.split(" - ");
    setNewItem({
      ...newItem,
      startTime: start || "",
      endTime: end || "",
      title: tpl.title,
      loc: LOCATIONS.includes(tpl.loc) ? tpl.loc : "Overig",
      locCustom: LOCATIONS.includes(tpl.loc) ? "" : tpl.loc,
      type: tpl.type,
      maxPax: tpl.maxPax || "",
      price: tpl.price || "",
      refhd: tpl.refhd || "",
      paris: tpl.paris || false,
      villageMap: tpl.villageMap || false,
      remarks: tpl.remarks || "",
    });
  };

  const addItem = () => {
    if (!newItem.startTime || !newItem.title) return;
    const timeStr = newItem.endTime
      ? `${newItem.startTime} - ${newItem.endTime}`
      : newItem.startTime;
    const finalLoc = newItem.loc === "Overig" ? newItem.locCustom : newItem.loc;

    const itemPayload = {
      id: Date.now(),
      time: timeStr,
      title: newItem.title,
      loc: finalLoc,
      staff: newItem.staff,
      type: newItem.type,
      maxPax: newItem.maxPax,
      price: newItem.price,
      refhd: newItem.refhd,
      paris: newItem.paris,
      villageMap: newItem.villageMap,
      remarks: newItem.remarks,
    };

    if (viewMode === "day") {
      let updatedSchedule;
      if (editingId) {
        updatedSchedule = appData.schedule.map((item) =>
          item.id === editingId
            ? { ...itemPayload, id: editingId, date: toIsoDate(currentDay) }
            : item
        );
      } else {
        updatedSchedule = [
          ...appData.schedule,
          { ...itemPayload, id: Date.now(), date: toIsoDate(currentDay) },
        ];
      }
      updateData({ schedule: updatedSchedule });
    } else {
      let updatedTemplates = appData.activityTemplates || [];
      if (editingId) {
        updatedTemplates = updatedTemplates.map((t) =>
          t.id === editingId ? { ...itemPayload, id: editingId } : t
        );
      } else {
        updatedTemplates = [
          ...updatedTemplates,
          { ...itemPayload, id: Date.now() },
        ];
      }
      updateData({ activityTemplates: updatedTemplates });
    }
    setNewItem({
      startTime: "",
      endTime: "",
      title: "",
      loc: "",
      locCustom: "",
      staff: [],
      type: "crea",
      maxPax: "",
      price: "",
      refhd: "",
      paris: false,
      villageMap: false,
      remarks: "",
    });
    setEditingId(null);
  };

  const editItem = (item) => {
    const [start, end] = item.time.split(" - ");
    setNewItem({
      startTime: start,
      endTime: end || "",
      title: item.title,
      loc: LOCATIONS.includes(item.loc) ? item.loc : "Overig",
      locCustom: LOCATIONS.includes(item.loc) ? "" : item.loc,
      type: item.type,
      staff: Array.isArray(item.staff)
        ? item.staff
        : item.staff
        ? [item.staff]
        : [],
      maxPax: item.maxPax || "",
      price: item.price || "",
      refhd: item.refhd || "",
      paris: item.paris || false,
      villageMap: item.villageMap || false,
      remarks: item.remarks || "",
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = (id) => {
    if (viewMode === "day") {
      updateData({ schedule: appData.schedule.filter((i) => i.id !== id) });
    } else {
      updateData({
        activityTemplates: (appData.activityTemplates || []).filter(
          (t) => t.id !== id
        ),
      });
    }
  };

  const listToRender =
    viewMode === "day" ? todaysSchedule : appData.activityTemplates || [];

  return (
    <AdminContainer
      title="Programma Beheer"
      backAction={() => setAdminSubView("menu")}
      currentDay={currentDay}
      onPrev={onPrev}
      onNext={onNext}
      onCalendar={onCalendar}
      hideDateControls={viewMode === "templates"}
    >
      <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => {
            setViewMode("day");
            setEditingId(null);
          }}
          className={`flex-1 py-2 rounded-md text-xs font-bold ${
            viewMode === "day"
              ? "bg-white shadow text-teal-800"
              : "text-gray-500"
          }`}
        >
          Dagplanning
        </button>
        <button
          onClick={() => {
            setViewMode("templates");
            setEditingId(null);
          }}
          className={`flex-1 py-2 rounded-md text-xs font-bold ${
            viewMode === "templates"
              ? "bg-white shadow text-teal-800"
              : "text-gray-500"
          }`}
        >
          Sjablonen
        </button>
      </div>

      <Card className="p-4 mb-6 relative bg-gray-50 border-teal-100">
        <h3 className="font-bold text-sm mb-3 text-teal-800">
          {editingId ? "Activiteit Bewerken" : "Nieuwe Activiteit Toevoegen"}
        </h3>

        {viewMode === "day" && !editingId && (
          <div className="mb-4 bg-blue-50 p-2 rounded border border-blue-100">
            <label className="text-xs text-blue-700 block mb-1 font-bold">
              Snel toevoegen uit sjabloon:
            </label>
            <select
              className="w-full text-xs p-2 rounded border border-blue-200 bg-white"
              onChange={(e) => applyTemplate(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Kies een sjabloon...
              </option>
              {(appData.activityTemplates || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.time} - {t.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-1">
            <label className="text-xs text-gray-500 block mb-1">
              Starttijd
            </label>
            <input
              type="time"
              className="border p-2 rounded bg-white w-full"
              value={newItem.startTime}
              onChange={(e) =>
                setNewItem({ ...newItem, startTime: e.target.value })
              }
            />
          </div>
          <div className="col-span-1">
            <label className="text-xs text-gray-500 block mb-1">
              Eindtijd (Optioneel)
            </label>
            <input
              type="time"
              className="border p-2 rounded bg-white w-full"
              value={newItem.endTime}
              onChange={(e) =>
                setNewItem({ ...newItem, endTime: e.target.value })
              }
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 block mb-1">
              Activiteit
            </label>
            <input
              type="text"
              list="act-list"
              placeholder="Naam..."
              className="w-full border p-2 rounded bg-white"
              value={newItem.title}
              onChange={(e) =>
                setNewItem({ ...newItem, title: e.target.value })
              }
            />
            <datalist id="act-list">
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 block mb-1">Locatie</label>
            <div className="flex gap-2">
              <select
                className="border p-2 rounded bg-white flex-1"
                value={newItem.loc}
                onChange={(e) =>
                  setNewItem({ ...newItem, loc: e.target.value })
                }
              >
                <option value="">Kies...</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {newItem.loc === "Overig" && (
                <input
                  type="text"
                  placeholder="Specifiek..."
                  className="border p-2 rounded bg-white flex-1"
                  value={newItem.locCustom}
                  onChange={(e) =>
                    setNewItem({ ...newItem, locCustom: e.target.value })
                  }
                />
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 block mb-1">Type</label>
            <select
              className="border p-2 rounded bg-white w-full"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Extra Options Block */}
          <div className="col-span-2 bg-white p-2 rounded border border-gray-200 mt-2">
            <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">
              Details & Admin
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Max Pax"
                className="border p-2 rounded text-xs"
                value={newItem.maxPax}
                onChange={(e) =>
                  setNewItem({ ...newItem, maxPax: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Prijs (bijv. 5,00)"
                className="border p-2 rounded text-xs"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="REFHD"
                className="border p-2 rounded text-xs"
                value={newItem.refhd}
                onChange={(e) =>
                  setNewItem({ ...newItem, refhd: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Opmerkingen (Intern)"
                className="border p-2 rounded text-xs"
                value={newItem.remarks}
                onChange={(e) =>
                  setNewItem({ ...newItem, remarks: e.target.value })
                }
              />
            </div>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center text-xs gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.paris}
                  onChange={(e) =>
                    setNewItem({ ...newItem, paris: e.target.checked })
                  }
                />
                <span className="font-bold text-blue-600">PARIS</span>
              </label>
              <label className="flex items-center text-xs gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.villageMap}
                  onChange={(e) =>
                    setNewItem({ ...newItem, villageMap: e.target.checked })
                  }
                />
                <span className="font-bold text-green-600">VillageMap</span>
              </label>
            </div>
          </div>

          {viewMode === "day" && (
            <div className="col-span-2 border-t pt-2 mt-1">
              <label className="text-xs text-gray-500 block mb-1">
                Personeel
              </label>
              <select
                className="w-full border p-2 rounded bg-white mb-2"
                onChange={handleStaffChange}
                value=""
              >
                <option value="">+ Toevoegen</option>
                {appData.staffList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
              </select>
              <div className="flex flex-wrap gap-2">
                {newItem.staff.map((staffName) => (
                  <span
                    key={staffName}
                    className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-800 flex items-center gap-1"
                  >
                    {staffName}{" "}
                    <button onClick={() => removeStaff(staffName)}>
                      <CloseIcon size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={addItem}
          className="w-full py-2 rounded font-bold text-white shadow-sm"
          style={{ backgroundColor: C.Pine }}
        >
          {editingId ? "Opslaan" : "Toevoegen"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setNewItem({
                startTime: "",
                endTime: "",
                title: "",
                loc: "",
                locCustom: "",
                staff: [],
                type: "crea",
                maxPax: "",
                price: "",
                refhd: "",
                paris: false,
                villageMap: false,
                remarks: "",
              });
            }}
            className="w-full mt-2 py-2 rounded text-gray-600 bg-gray-200 text-xs font-bold"
          >
            Annuleren
          </button>
        )}
      </Card>

      <div className="space-y-2">
        {listToRender
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((item) => (
            <div
              key={item.id}
              className={`bg-white p-3 rounded border flex justify-between items-center ${
                editingId === item.id
                  ? "border-teal-500 ring-1 ring-teal-500"
                  : "border-gray-200"
              }`}
            >
              <div>
                <div className="font-bold text-teal-900 text-sm">
                  {item.time} - {item.title}
                </div>
                <div className="text-xs text-gray-500">{item.loc}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editItem(item)}
                  className="p-2 bg-blue-50 text-blue-600 rounded"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 bg-red-50 text-red-600 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        {listToRender.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic">
            Nog niets gepland.
          </p>
        )}
      </div>
    </AdminContainer>
  );
};

const AdminMenu = ({
  setAdminSubView,
  resetAllData,
  setView,
  handleLogout,
  appData,
  handleLockApp,
  updateData,
  showAlert,
  showConfirm,
}) => {
  const openHoursCount = (appData.hourCorrections || []).filter(
    (h) => !h.processed
  ).length;
  const openOrdersCount = (appData.orders || []).filter(
    (o) => o.status === "open"
  ).length;
  const MenuButton = ({
    onClick,
    icon: Icon,
    label,
    iconBg,
    iconColor,
    badge,
  }) => (
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between transition-all group"
      style={{ borderColor: C.Grass }}
    >
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg relative"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={20} />
          {badge}
        </div>
        <span className="font-bold" style={{ color: C.Bark }}>
          {label}
        </span>
      </div>
      <ChevronRight size={18} style={{ color: C.Grass }} />
    </button>
  );
  return (
    <div className="max-w-2xl mx-auto space-y-4 pt-4">
      <div
        className="border rounded-xl p-4 mb-6 flex items-center"
        style={{ backgroundColor: C.Grass, borderColor: C.Pine }}
      >
        <Lock className="mr-3" size={24} style={{ color: C.Pine }} />
        <div>
          <h3 className="font-bold" style={{ color: C.Pine }}>
            Floormanager
          </h3>
          <p className="text-xs" style={{ color: C.Pine }}>
            Kids & Entertainment
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <MenuButton
          onClick={() => setAdminSubView("edit_stats")}
          icon={Globe}
          label="Gasten & Bezetting"
          iconBg={C.Sky}
          iconColor={C.Lagoon}
        />
        <MenuButton
          onClick={() => setAdminSubView("edit_schedule")}
          icon={CalendarIcon}
          label="Programma"
          iconBg={C.Grass}
          iconColor={C.Pine}
        />
        <MenuButton
          onClick={() => setAdminSubView("edit_chars")}
          icon={Smile}
          label="Karakters"
          iconBg={C.Honey}
          iconColor={C.Bark}
        />
        <MenuButton
          onClick={() => setAdminSubView("manage_tasks")}
          icon={ListChecks}
          label="Takenbeheer"
          iconBg={C.Blossom}
          iconColor={C.Sunset}
        />
        <MenuButton
          onClick={() => setAdminSubView("edit_hours")}
          icon={Clock}
          label="Uren Verwerken"
          iconBg={C.Blossom}
          iconColor={C.Sunset}
          badge={<NotificationBadge count={openHoursCount} />}
        />
        <MenuButton
          onClick={() => setAdminSubView("edit_orders")}
          icon={ShoppingCart}
          label="Bestellingen"
          iconBg={C.Honey}
          iconColor={C.Bark}
          badge={<NotificationBadge count={openOrdersCount} />}
        />
        <MenuButton
          onClick={() => setAdminSubView("edit_phones")}
          icon={Phone}
          label="Telefoonlijst Beheer"
          iconBg={C.Sky}
          iconColor={C.Lagoon}
        />
        <MenuButton
          onClick={() => setAdminSubView("settings")}
          icon={Settings}
          label="Instellingen & Team"
          iconBg={C.Bg}
          iconColor={C.Bark}
        />
      </div>
      <NotificationManager
        appData={appData}
        updateData={updateData}
        showAlert={showAlert}
        showConfirm={showConfirm}
      />
      <div className="pt-6 flex flex-col gap-2 pb-20">
        <button
          onClick={() => setView("dashboard")}
          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: C.Pine, color: C.Grass }}
        >
          <ArrowLeft size={18} /> Terug naar App
        </button>
      </div>
    </div>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  setView,
  handleLogout,
  isLoggedIn,
  setCurrentDay,
  userRole,
}) => {
  if (!isOpen) return null;
  const MenuItem = ({ icon: Icon, label, target }) => (
    <button
      onClick={() => {
        setView(target);
        if (target === "dashboard") setCurrentDay(new Date());
        onClose();
      }}
      className="flex items-center gap-4 w-full p-4 text-lg font-bold border-b hover:bg-gray-50 transition-colors"
      style={{ borderColor: C.Grass, color: C.Pine }}
    >
      <Icon size={24} /> {label}
    </button>
  );
  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-3/4 max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <div
          className="p-6 flex justify-between items-center border-b"
          style={{ backgroundColor: C.Pine, borderColor: C.Grass }}
        >
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button onClick={onClose} className="text-white">
            <CloseIcon size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {userRole !== "co" && (
            <MenuItem
              icon={LayoutDashboard}
              label="Dashboard"
              target="dashboard"
            />
          )}
          <MenuItem icon={CalendarIcon} label="Programma" target="schedule" />
          {userRole !== "co" && (
            <MenuItem icon={PieChart} label="Bezetting" target="occupancy" />
          )}
          {userRole !== "co" && (
            <MenuItem icon={Smile} label="Karakters" target="characters" />
          )}
          {userRole !== "co" && (
            <MenuItem icon={BookOpen} label="Overdracht" target="handover" />
          )}
          {userRole !== "co" && (
            <MenuItem icon={CheckSquare} label="Takenlijst" target="checks" />
          )}
          {userRole !== "co" && (
            <MenuItem icon={Clock} label="Uren" target="hours" />
          )}
          {userRole !== "co" && (
            <MenuItem icon={ShoppingCart} label="Bestellen" target="orders" />
          )}
          {userRole !== "co" && (
            <MenuItem icon={Phone} label="Telefoonlijst" target="phonelist" />
          )}
          {userRole === "staff" && (
            <MenuItem
              icon={KeyRound}
              label="Wijzig Pincode"
              target="change_pin"
            />
          )}
        </div>
        <div
          className="p-6 border-t"
          style={{ borderColor: C.Grass, backgroundColor: C.Bg }}
        >
          {!isLoggedIn ? (
            <button
              onClick={() => {
                setView("login");
                onClose();
              }}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center shadow-sm"
              style={{ backgroundColor: C.Grass, color: C.Pine }}
            >
              <Lock size={18} className="mr-2" /> Inloggen
            </button>
          ) : (
            <div className="space-y-3">
              {userRole === "fm" && (
                <button
                  onClick={() => {
                    setView("admin");
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center bg-white border border-green-200 shadow-sm"
                  style={{ color: C.Pine }}
                >
                  <Settings size={18} className="mr-2" /> Beheer
                </button>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center border bg-white shadow-sm"
                style={{ borderColor: C.Sunset, color: C.Sunset }}
              >
                <LogOut size={18} className="mr-2" /> Uitloggen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginScreen = ({
  pin,
  setPin,
  handleLogin,
  staffList,
  loginMode,
  setLoginMode,
  selectedStaff,
  setSelectedStaff,
}) => (
  <div
    className="flex flex-col items-center justify-center min-h-screen p-6 animate-in fade-in"
    style={{ backgroundColor: C.Pine }}
  >
    <Card className="w-full max-w-sm p-8 shadow-2xl" borderColor={C.Grass}>
      <div className="flex justify-center mb-6 gap-3">
        <div
          className="p-3 rounded-full animate-bounce-slow"
          style={{ backgroundColor: C.Grass, color: C.Pine }}
        >
          <PartyPopper size={28} />
        </div>
        <div
          className="p-3 rounded-full animate-bounce-slow delay-100"
          style={{ backgroundColor: C.Sky, color: C.Lagoon }}
        >
          <Music size={28} />
        </div>
        <div
          className="p-3 rounded-full animate-bounce-slow delay-200"
          style={{ backgroundColor: C.Honey, color: C.Bark }}
        >
          <Palette size={28} />
        </div>
      </div>
      <h2
        className="text-2xl font-bold mb-2 text-center"
        style={{ color: C.Pine }}
      >
        Kids & Entertainment
      </h2>
      <h3 className="text-lg font-medium mb-6 text-center text-gray-500">
        Limburgse Peel
      </h3>
      <div className="w-full mb-6">
        <label
          className="block text-xs font-bold uppercase mb-2"
          style={{ color: C.Bark }}
        >
          Wie ben je?
        </label>
        <select
          className="w-full p-3 border rounded-xl text-sm bg-white outline-none mb-4 cursor-pointer"
          style={{ borderColor: C.Grass, color: C.Pine }}
          value={
            loginMode === "fm"
              ? "Floormanager"
              : loginMode === "co"
              ? "Central Office"
              : selectedStaff
          }
          onChange={(e) => {
            if (e.target.value === "Floormanager") {
              setLoginMode("fm");
              setSelectedStaff("");
            } else if (e.target.value === "Central Office") {
              setLoginMode("co");
              setSelectedStaff("");
            } else {
              setLoginMode("staff");
              setSelectedStaff(e.target.value);
            }
            setPin("");
          }}
        >
          <option value="" disabled>
            Kies je naam...
          </option>
          <option value="Floormanager">Floormanager</option>
          <option value="Central Office">Central Office</option>
          <optgroup label="Medewerkers">
            {staffList
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
      {(loginMode === "fm" || loginMode === "co" || selectedStaff) && (
        <div className="animate-in slide-in-from-bottom-4 fade-in w-full flex flex-col items-center">
          <p className="text-xs font-bold mb-2" style={{ color: C.Pine }}>
            {loginMode === "fm"
              ? "FM Pincode"
              : loginMode === "co"
              ? "CO Pincode"
              : `Pincode voor ${selectedStaff}`}
          </p>
          <div className="grid grid-cols-3 gap-3 w-full mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => setPin(pin + n)}
                className="h-12 border rounded-lg text-lg font-bold hover:opacity-80 transition-colors"
                style={{ borderColor: C.Grass, color: C.Pine }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPin("")}
              className="h-12 rounded-lg font-bold flex items-center justify-center border"
              style={{
                backgroundColor: "#FFE5E5",
                borderColor: "#FECACA",
                color: C.Sunset,
              }}
            >
              C
            </button>
            <button
              onClick={() => setPin(pin + "0")}
              className="h-12 border rounded-lg text-lg font-bold hover:opacity-80 transition-colors"
              style={{ borderColor: C.Grass, color: C.Pine }}
            >
              0
            </button>
            <button
              onClick={handleLogin}
              className="h-12 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: C.Pine }}
            >
              <ChevronRight />
            </button>
          </div>
          <div className="flex justify-center gap-2 h-2 mb-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-200`}
                style={{
                  backgroundColor: i < pin.length ? C.Pine : "#e5e7eb",
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </Card>
    <p className="text-white/50 text-[10px] mt-4">
      © Center Parcs Limburgse Peel
    </p>
  </div>
);

const UserHoursView = ({
  setView,
  updateData,
  appData,
  userRole,
  loggedInUserName,
  showAlert,
}) => {
  const [form, setForm] = useState({
    name: userRole === "staff" ? loggedInUserName : "",
    date: toIsoDate(new Date()),
    start: "",
    end: "",
    code: "243",
    reason: "",
  });
  const [success, setSuccess] = useState(false);
  const myCorrections = (appData.hourCorrections || []).filter(
    (c) => c.name === loggedInUserName
  );

  const submit = () => {
    if (!form.name || !form.date || !form.start || !form.end || !form.reason) {
      showAlert("Vul alsjeblieft alle velden in!");
      return;
    }
    updateData({
      hourCorrections: [
        ...appData.hourCorrections,
        { ...form, id: Date.now(), processed: false },
      ],
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setView("dashboard");
    }, 2000);
  };
  if (success)
    return (
      <div
        className="h-full flex flex-col items-center justify-center animate-in zoom-in p-8 rounded-2xl border"
        style={{
          backgroundColor: C.Grass,
          borderColor: C.Pine,
          color: C.Pine,
        }}
      >
        <CheckCircle size={64} className="mb-4" />
        <h2 className="text-2xl font-bold">Verzonden!</h2>
        <p className="text-sm mt-2">De floormanager kijkt ernaar.</p>
      </div>
    );
  return (
    <Card className="p-6 max-w-lg mx-auto" borderColor={C.Grass}>
      <h2
        className="font-bold text-xl mb-2 flex items-center"
        style={{ color: C.Pine }}
      >
        <Clock className="mr-2" style={{ color: C.Sunset }} /> Urencorrectie
      </h2>
      <div
        className="border p-3 rounded-lg mb-4 text-sm font-bold flex items-start gap-2"
        style={{
          backgroundColor: "#FFFBEB",
          borderColor: C.Honey,
          color: C.Bark,
        }}
      >
        <AlertCircle size={18} className="shrink-0 mt-0.5" />
        <p>
          Ben je vergeten te klokken of om te klokken? Vul hieronder je tijden
          in.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label
            className="block text-xs font-bold uppercase mb-1"
            style={{ color: C.Bark }}
          >
            Jouw Naam *
          </label>
          {userRole === "staff" ? (
            <input
              type="text"
              disabled
              value={form.name}
              className="w-full border p-3 rounded-lg text-sm bg-gray-100"
              style={{ borderColor: C.Grass }}
            />
          ) : (
            <select
              className="w-full border p-3 rounded-lg text-sm bg-white"
              style={{ borderColor: C.Grass }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            >
              <option value="">Kies je naam...</option>
              {appData.staffList.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-bold uppercase mb-1"
              style={{ color: C.Bark }}
            >
              Datum *
            </label>
            <input
              type="date"
              className="w-full border p-3 rounded-lg text-sm"
              style={{ borderColor: C.Grass }}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label
              className="block text-xs font-bold uppercase mb-1"
              style={{ color: C.Bark }}
            >
              Afdeling *
            </label>
            <select
              className="w-full border p-3 rounded-lg text-sm"
              style={{ borderColor: C.Grass }}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            >
              <option value="243">243 (Crea Atelier)</option>
              <option value="258">258 (Entertainment)</option>
              <option value="279">279 (Springkussens)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-xs font-bold uppercase mb-1"
              style={{ color: C.Bark }}
            >
              Starttijd *
            </label>
            <input
              type="time"
              className="w-full border p-3 rounded-lg text-sm"
              style={{ borderColor: C.Grass }}
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
            />
          </div>
          <div>
            <label
              className="block text-xs font-bold uppercase mb-1"
              style={{ color: C.Bark }}
            >
              Eindtijd *
            </label>
            <input
              type="time"
              className="w-full border p-3 rounded-lg text-sm"
              style={{ borderColor: C.Grass }}
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label
            className="block text-xs font-bold uppercase mb-1"
            style={{ color: C.Bark }}
          >
            Reden *
          </label>
          <input
            type="text"
            className="w-full border p-3 rounded-lg text-sm"
            style={{ borderColor: C.Grass }}
            placeholder="Bijv. Pasje vergeten..."
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
        </div>
        <button
          onClick={submit}
          className="w-full font-bold py-3 rounded-xl shadow-md transition-colors mt-2"
          style={{ backgroundColor: C.Sunset, color: C.White }}
        >
          Versturen
        </button>

        {myCorrections.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: C.Bark }}>
              Mijn Correcties
            </h4>
            <div className="space-y-2">
              {myCorrections.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded border"
                >
                  <span>
                    {c.date} ({c.start}-{c.end})
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      c.processed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.processed ? "Verwerkt" : "Open"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const UserOrderView = ({ setView, updateData, appData, loggedInUserName }) => {
  const [item, setItem] = useState("");
  const [success, setSuccess] = useState(false);
  const order = () => {
    if (!item) return;
    updateData({
      orders: [
        ...appData.orders,
        {
          id: Date.now(),
          item,
          who: loggedInUserName,
          date: toDutchDate(new Date()),
          status: "open",
        },
      ],
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setView("dashboard");
    }, 2000);
  };
  if (success)
    return (
      <div
        className="h-full flex flex-col items-center justify-center animate-in zoom-in p-8 rounded-2xl border"
        style={{
          backgroundColor: C.Sky,
          borderColor: C.Lagoon,
          color: C.Lagoon,
        }}
      >
        <CheckCircle size={64} className="mb-4" />
        <h2 className="text-2xl font-bold">Besteld!</h2>
        <p className="text-sm mt-2">Staat in de lijst.</p>
      </div>
    );
  return (
    <div className="space-y-6 animate-in fade-in max-w-lg mx-auto">
      <Card className="p-5" borderColor={C.Grass}>
        <h2
          className="font-bold text-lg mb-3 flex items-center"
          style={{ color: C.Pine }}
        >
          <ShoppingCart className="mr-2" style={{ color: C.Lagoon }} /> Nieuwe
          Bestelling
        </h2>
        <p className="text-xs mb-3" style={{ color: C.Bark }}>
          Wat heb je nodig? Je bestelling komt direct bij de Floormanager
          binnen.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border p-3 rounded-lg text-sm"
            style={{ borderColor: C.Grass }}
            placeholder="Typ hier je bestelling..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <button
            onClick={order}
            className="px-4 rounded-lg font-bold flex items-center"
            style={{ backgroundColor: C.Lagoon, color: C.White }}
          >
            <Plus size={18} />
          </button>
        </div>
      </Card>
      <div>
        <h3
          className="font-bold text-sm uppercase mb-3 ml-1"
          style={{ color: C.Bark }}
        >
          Mijn Bestellingen
        </h3>
        {(!appData.orders || appData.orders.length === 0) && (
          <p
            className="text-center text-sm py-8 italic"
            style={{ color: C.Bark }}
          >
            Nog geen bestellingen.
          </p>
        )}
        <div className="space-y-2">
          {appData.orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-3 bg-white rounded-xl border shadow-sm"
                style={{ borderColor: C.Grass }}
              >
                <div>
                  <div className="text-sm font-bold" style={{ color: C.Pine }}>
                    {order.item}
                  </div>
                  <div className="text-[10px]" style={{ color: C.Bark }}>
                    {order.date} {order.who && `(${order.who})`}
                  </div>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded font-bold`}
                  style={{
                    backgroundColor:
                      order.status === "received"
                        ? C.Grass
                        : order.status === "ordered"
                        ? C.Honey
                        : C.Sky,
                    color:
                      order.status === "received"
                        ? C.Pine
                        : order.status === "ordered"
                        ? C.Bark
                        : C.Lagoon,
                  }}
                >
                  {order.status === "received"
                    ? "Binnen"
                    : order.status === "ordered"
                    ? "Besteld"
                    : "Nieuw"}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const ChangePinView = ({
  setView,
  appData,
  updateData,
  loggedInUserName,
  showAlert,
}) => {
  const [step, setStep] = useState("verify"); // verify, new, confirm
  const [inputPin, setInputPin] = useState("");
  const [tempNewPin, setTempNewPin] = useState("");

  const handlePress = (num) => {
    if (inputPin.length < 4) {
      const nextPin = inputPin + num;
      setInputPin(nextPin);

      if (nextPin.length === 4) {
        // Process complete input
        setTimeout(() => processPin(nextPin), 100);
      }
    }
  };

  const processPin = (pin) => {
    const user = appData.staffList.find((s) => s.name === loggedInUserName);

    if (step === "verify") {
      if (user.pin === pin) {
        setStep("new");
        setInputPin("");
      } else {
        showAlert("Huidige pincode is onjuist");
        setInputPin("");
      }
    } else if (step === "new") {
      setTempNewPin(pin);
      setStep("confirm");
      setInputPin("");
    } else if (step === "confirm") {
      if (pin === tempNewPin) {
        // Save
        const newList = appData.staffList.map((s) =>
          s.name === loggedInUserName
            ? { ...s, pin: pin, forcePinChange: false }
            : s
        );
        updateData({ staffList: newList });
        showAlert("Pincode succesvol gewijzigd!");
        setView("dashboard");
      } else {
        showAlert("Pincodes komen niet overeen. Probeer opnieuw.");
        setStep("new");
        setTempNewPin("");
        setInputPin("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Card className="p-6 max-w-sm w-full shadow-2xl" borderColor={C.Pine}>
        <h2
          className="text-xl font-bold mb-2 text-center"
          style={{ color: C.Pine }}
        >
          {step === "verify" && "Verifieer Huidige Code"}
          {step === "new" && "Kies Nieuwe Pincode"}
          {step === "confirm" && "Bevestig Nieuwe Pincode"}
        </h2>
        <div className="flex justify-center gap-2 h-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                i < inputPin.length ? "bg-teal-600" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 w-full mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handlePress(n.toString())}
              className="h-12 border rounded-lg text-lg font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors"
              style={{ borderColor: C.Grass, color: C.Pine }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setInputPin("")}
            className="h-12 rounded-lg font-bold flex items-center justify-center border"
            style={{
              backgroundColor: "#FFE5E5",
              borderColor: "#FECACA",
              color: C.Sunset,
            }}
          >
            C
          </button>
          <button
            onClick={() => handlePress("0")}
            className="h-12 border rounded-lg text-lg font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors"
            style={{ borderColor: C.Grass, color: C.Pine }}
          >
            0
          </button>
          <div className="w-full h-12"></div>
        </div>

        <button
          onClick={() => setView("dashboard")}
          className="w-full mt-4 py-2 text-sm text-gray-500 underline text-center"
        >
          Annuleren
        </button>
      </Card>
    </div>
  );
};

const PhoneList = ({ appData, backAction }) => (
  <AdminContainer
    title="Telefoonlijst"
    backAction={backAction}
    hideDateControls={true}
  >
    <div className="space-y-2">
      {appData.phoneDirectory.map((entry) => (
        <div
          key={entry.id}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm"
          style={{
            borderLeftWidth: "6px",
            borderLeftColor: entry.color || C.Pine,
            borderColor: C.Grass,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: entry.color || C.Pine }}
            >
              {entry.name[0]}
            </div>
            <div>
              <div className="font-bold" style={{ color: C.Pine }}>
                {entry.name}
              </div>
              <div className="text-xs text-gray-500">{entry.phone}</div>
            </div>
          </div>
          <a
            href={`tel:${entry.phone}`}
            className="p-2 rounded-full hover:bg-green-100 text-green-700"
            style={{ backgroundColor: C.Bg }}
          >
            <Phone size={20} />
          </a>
        </div>
      ))}
    </div>
  </AdminContainer>
);

// --- MAIN APP ---
export default function App() {
  useEffect(() => {
    if (!document.getElementById("tailwind-script")) {
      const script = document.createElement("script");
      script.id = "tailwind-script";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
    const style = document.createElement("style");
    style.innerHTML = ` @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap'); body { font-family: 'DM Serif Display', serif; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }`;
    document.head.appendChild(style);
  }, []);

  const [view, setView] = useState("login");
  const [adminSubView, setAdminSubView] = useState("menu");
  const [appData, setAppData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const [loginMode, setLoginMode] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [pin, setPin] = useState("");
  const [alertParams, setAlertParams] = useState({
    isOpen: false,
    message: "",
  });
  const [confirmParams, setConfirmParams] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const [currentDay, setCurrentDay] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const weather = useWeather(currentDay);
  const greeting = getGreeting();
  const [searchPhone, setSearchPhone] = useState("");

  const WeatherIcon = weather.icon; // Robust icon component

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (auth) initAuth();
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (mounted) {
          setUser(u);
          if (!u) setLoading(false);
        }
      });
      return () => {
        mounted = false;
        unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const docRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "cp_live_data",
      "master"
    );
    const unsub = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        setAppData(sanitizeData(docSnap.data()));
      } else {
        setDoc(docRef, INITIAL_DATA);
        setAppData(INITIAL_DATA);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const saveData = async (newData) => {
    const updated = {
      ...appData,
      ...newData,
      lastUpdate: new Date().toISOString(),
    };
    setAppData(updated);
    if (user && db) {
      try {
        const docRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "cp_live_data",
          "master"
        );
        await setDoc(docRef, updated, { merge: true });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const triggerAlert = (message) => setAlertParams({ isOpen: true, message });
  const triggerConfirm = (message, onConfirm) =>
    setConfirmParams({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmParams({ isOpen: false, message: "", onConfirm: null });
      },
    });

  const handleLogin = () => {
    const fmPin = appData.settings?.pin || "2412";
    const coPin = appData.settings?.coPin || "1234";
    if (loginMode === "fm") {
      if (pin === fmPin) {
        setIsLoggedIn(true);
        setUserRole("fm");
        setLoggedInUserName("Floormanager");
        setView("dashboard");
      } else triggerAlert("Foutieve FM pincode");
    } else if (loginMode === "co") {
      if (pin === coPin) {
        setIsLoggedIn(true);
        setUserRole("co");
        setLoggedInUserName("Central Office");
        setView("schedule");
      } else triggerAlert("Foutieve CO pincode");
    } else if (loginMode === "staff") {
      const userObj = appData.staffList.find((s) => s.name === selectedStaff);
      if (pin === (userObj ? userObj.pin : "0000")) {
        if (userObj.forcePinChange) {
          // Redirect to force pin change view instead of dashboard
          setIsLoggedIn(true);
          setUserRole("staff");
          setLoggedInUserName(selectedStaff);
          setView("force_pin_change");
        } else {
          setIsLoggedIn(true);
          setUserRole("staff");
          setLoggedInUserName(selectedStaff);
          setView("dashboard");

          // --- UPDATE LAST LOGIN ---
          const newStaffList = appData.staffList.map((s) =>
            s.name === selectedStaff
              ? { ...s, lastLogin: new Date().toISOString() }
              : s
          );
          saveData({ staffList: newStaffList });
          // -------------------------
        }
      } else triggerAlert("Foutieve pincode");
    }
    setPin("");
  };

  const resetAllData = async () => {
    triggerConfirm("Weet je zeker dat je ALLE data wilt wissen?", async () => {
      if (user && db) {
        const docRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "cp_live_data",
          "master"
        );
        await setDoc(docRef, INITIAL_DATA);
      } else {
        setAppData(INITIAL_DATA);
      }
    });
  };
  const handleReadNotification = (id) => {
    const updatedNotifs = appData.notifications.map((n) =>
      n.id === id
        ? { ...n, readBy: [...(n.readBy || []), loggedInUserName] }
        : n
    );
    saveData({ notifications: updatedNotifs });
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setView("login");
    setLoginMode("");
    setSelectedStaff("");
    setPin("");
  };
  const handleLockApp = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setView("login");
    setLoginMode("");
    setSelectedStaff("");
    setPin("");
  };

  // Updated Navigation Logic (Weeks for schedule)
  const nextDay = () => {
    const d = new Date(currentDay);
    if (view === "schedule") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDay(d);
  };
  const prevDay = () => {
    const d = new Date(currentDay);
    if (view === "schedule") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDay(d);
  };

  const dayKey = toIsoDate(currentDay);
  const currentWeekdayId = currentDay.getDay();
  const todaysSchedule = appData.schedule.filter((s) => s.date === dayKey);
  const todaysCharacters = appData.characters.filter(
    (c) => c.date === dayKey && c.actor
  );

  // Helper within App component
  const getDailyTasks = (type) => {
    const specific = appData.checklists.filter((c) => {
      if (c.type !== type) return false;
      // Voor extra taken: toon globaal én specifiek voor vandaag
      if (type === "extra") return c.date === "global" || c.date === dayKey;
      // Voor andere taken: alleen vandaag
      return c.date === dayKey;
    });

    const specificIds = new Set(specific.map((t) => t.id));

    const templates = (
      appData.checklistTemplates?.[currentWeekdayId]?.[type] || []
    )
      .filter((t) => !specificIds.has(t.id)) // Voorkom duplicaten
      .map((t) => ({ ...t, done: false })); // Sjablonen zijn standaard 'niet gedaan' tenzij ze in checklists staan

    return [...specific, ...templates];
  };

  const entTasks = getDailyTasks("entertainment");
  const creaTasks = getDailyTasks("crea");
  const extraTasks = getDailyTasks("extra");

  // Filter tasks into groups based on category
  const groupedEntTasks = groupTasksByCategory(entTasks);
  const groupedCreaTasks = groupTasksByCategory(creaTasks);
  const groupedExtraTasks = groupTasksByCategory(extraTasks);

  const renderGroupedTasks = (groups, color) => {
    const categories = [
      { id: "startup", label: "Opstart", icon: Power },
      { id: "during", label: "Tijdens Dienst", icon: Clock3 },
      { id: "closing", label: "Afsluit", icon: Moon },
      { id: "general", label: "Algemeen", icon: Clipboard },
    ];

    return (
      <div className="space-y-4">
        {categories.map((cat) => {
          const tasks = groups[cat.id];
          if (!tasks || tasks.length === 0) return null;

          return (
            <div key={cat.id}>
              <h4
                className="text-xs font-bold uppercase mb-2 flex items-center gap-1 border-b pb-1"
                style={{ color: C.Bark, borderColor: color }}
              >
                <cat.icon size={12} /> {cat.label}
              </h4>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleCheckTask(t)}
                  className={`p-3 mb-2 rounded cursor-pointer flex justify-between items-center border-l-4 ${
                    t.done ? "bg-green-50" : "bg-gray-50"
                  }`}
                  style={{
                    borderLeftColor: color, // Use the passed color
                  }}
                >
                  <div className="flex-1 pr-4">
                    <span
                      className={`block ${
                        t.done
                          ? "line-through text-gray-400"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      {safeRenderText(t.text)}
                    </span>
                    {t.done && t.doneBy && (
                      <span className="text-[10px] text-green-600 block mt-1">
                        Gedaan door: {t.doneBy}
                        {t.doneAt &&
                          ` op ${new Date(t.doneAt).toLocaleDateString(
                            "nl-NL",
                            {
                              weekday: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}`}
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      t.done
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {t.done && <Check size={14} className="text-white" />}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const handleCheckTask = (task) => {
    // If it's a template task (no date property or marked as template), we create a new entry in checklists.
    // If it exists in checklists, update it.
    let newChecklists = [...appData.checklists];
    const existingIndex = newChecklists.findIndex((c) => c.id === task.id);

    const doneAt = new Date().toISOString();

    if (existingIndex >= 0) {
      newChecklists[existingIndex] = {
        ...newChecklists[existingIndex],
        done: !newChecklists[existingIndex].done,
        doneBy: !newChecklists[existingIndex].done ? loggedInUserName : null,
        doneAt: !newChecklists[existingIndex].done ? doneAt : null,
      };
    } else {
      // It's a template that hasn't been checked yet today
      newChecklists.push({
        id: task.id,
        ...task,
        date: task.type === "extra" ? "global" : dayKey, // Keep 'global' if it came from extra template
        done: true,
        doneBy: loggedInUserName,
        doneAt: doneAt,
      });
    }
    saveData({ checklists: newChecklists });
  };

  const getDayCharacters = (date) => {
    const dKey = toIsoDate(date);
    const existing = appData.characters.filter((c) => c.date === dKey);
    const baseRolesMap = BASE_ROLES.reduce((acc, role) => {
      acc[role] = existing.find((c) => c.role === role) || {
        id: null,
        role,
        actor: "",
        pakCheck: false,
        date: dKey,
        isExtra: false,
      };
      return acc;
    }, {});
    const extraRoles = existing
      .filter((c) => !BASE_ROLES.includes(c.role))
      .map((c) => ({ ...c, isExtra: true }));
    return [...Object.values(baseRolesMap), ...extraRoles];
  };

  // MULTI-DAY DASHBOARD PROGRAM LOGIC
  // Get upcoming activities for distinct days
  const getUpcomingSchedule = () => {
    const today = new Date(currentDay);
    today.setHours(0, 0, 0, 0);
    // Get data for next 14 days to be safe, or just all future
    const allItems = appData.schedule
      .map((s) => ({ ...s, parsedDate: new Date(s.date) }))
      .filter((s) => s.parsedDate >= today)
      .sort(
        (a, b) => a.parsedDate - b.parsedDate || a.time.localeCompare(b.time)
      );

    // Group by date, NO LIMIT on items, just group all found
    const grouped = {};
    allItems.forEach((item) => {
      const dKey = toIsoDate(item.parsedDate);
      if (!grouped[dKey]) grouped[dKey] = [];
      grouped[dKey].push(item);
    });
    return grouped;
  };
  const groupedSchedule = getUpcomingSchedule();

  const filteredPhoneDirectory = appData.phoneDirectory.filter(
    (p) =>
      p.name.toLowerCase().includes(searchPhone.toLowerCase()) ||
      p.phone.includes(searchPhone)
  );
  const todayStr = new Date().toISOString().split("T")[0];
  const activeNotification = appData.notifications.find(
    (n) =>
      todayStr >= n.start &&
      todayStr <= n.end &&
      !n.readBy.includes(loggedInUserName)
  );
  const isDayPlanned = appData.planningStatus?.[dayKey]?.isSystemReady || false;
  const toggleDayPlanned = () => {
    saveData({
      planningStatus: {
        ...appData.planningStatus,
        [dayKey]: { isSystemReady: !isDayPlanned },
      },
    });
  };

  const sortedChecklists = {
    entertainment: entTasks,
    crea: creaTasks,
    extra: extraTasks,
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-teal-800 font-bold animate-pulse">
        Laden...
      </div>
    );

  return (
    <div
      className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden"
      style={{ backgroundColor: C.Bg }}
    >
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        setView={setView}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        setCurrentDay={setCurrentDay}
      />
      <AlertModal
        isOpen={alertParams.isOpen}
        message={alertParams.message}
        onClose={() => setAlertParams({ isOpen: false, message: "" })}
      />
      <ConfirmModal
        isOpen={confirmParams.isOpen}
        message={confirmParams.message}
        onConfirm={confirmParams.onConfirm}
        onCancel={() => setConfirmParams({ ...confirmParams, isOpen: false })}
      />

      {activeNotification && view === "dashboard" && (
        <NotificationPopup
          notification={activeNotification}
          onClose={() => handleReadNotification(activeNotification.id)}
        />
      )}

      <div
        className={`hidden md:flex w-64 flex-col h-screen p-4 shadow-xl z-20 flex-shrink-0`}
        style={{ backgroundColor: C.Pine }}
      >
        <div className="mb-8 text-center text-white font-bold text-xl">
          Kids & Entertainment <br />
          <span style={{ color: C.Grass }}>LP</span>
        </div>
        <div className="flex-1 space-y-1">
          {isLoggedIn && (
            <>
              {userRole !== "co" && (
                <SidebarItem
                  id="dash"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={() => {
                    setView("dashboard");
                    setCurrentDay(new Date());
                  }}
                  active={view === "dashboard"}
                />
              )}
              <SidebarItem
                id="prog"
                icon={CalendarIcon}
                label="Programma"
                onClick={() => setView("schedule")}
                active={view === "schedule"}
              />
              {userRole !== "co" && (
                <SidebarItem
                  id="occ"
                  icon={PieChart}
                  label="Bezetting"
                  onClick={() => setView("occupancy")}
                  active={view === "occupancy"}
                />
              )}
              {userRole !== "co" && (
                <SidebarItem
                  id="char"
                  icon={Smile}
                  label="Karakters"
                  onClick={() => setView("characters")}
                  active={view === "characters"}
                />
              )}
              {userRole !== "co" && (
                <SidebarItem
                  id="ho"
                  icon={BookOpen}
                  label="Overdracht"
                  onClick={() => setView("handover")}
                  active={view === "handover"}
                />
              )}
              {userRole !== "co" && (
                <SidebarItem
                  id="checks"
                  icon={CheckSquare}
                  label="Takenlijst"
                  onClick={() => setView("checks")}
                  active={view === "checks"}
                />
              )}
              {userRole !== "co" && (
                <SidebarItem
                  id="hours"
                  icon={Clock}
                  label="Uren"
                  onClick={() => setView("hours")}
                  active={view === "hours"}
                />
              )}
              {userRole !== "co" && (
                <SidebarItem
                  id="orders"
                  icon={ShoppingCart}
                  label="Bestellen"
                  onClick={() => setView("orders")}
                  active={view === "orders"}
                />
              )}
              {userRole !== "co" && (
                <SidebarItem
                  id="phone"
                  icon={Phone}
                  label="Telefoonlijst"
                  onClick={() => setView("phonelist")}
                  active={view === "phonelist"}
                />
              )}
              {userRole === "staff" && (
                <SidebarItem
                  id="change_pin"
                  icon={KeyRound}
                  label="Wijzig Pincode"
                  onClick={() => setView("change_pin")}
                  active={view === "change_pin"}
                />
              )}
            </>
          )}
        </div>
        {isLoggedIn && (
          <div className="mt-auto">
            {userRole === "fm" && (
              <button
                onClick={() => setView("admin")}
                className="w-full text-left flex items-center text-white opacity-70 hover:opacity-100 mb-2"
              >
                <Settings size={16} className="mr-2" /> Beheer
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center text-white opacity-70 hover:opacity-100"
            >
              <LogOut size={16} className="mr-2" /> Uitloggen
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {isLoggedIn && (
          <div
            className="md:hidden p-4 flex justify-between items-center text-white shadow-md sticky top-0 z-30"
            style={{ backgroundColor: C.Pine }}
          >
            {userRole !== "co" && (
              <button onClick={() => setIsMobileMenuOpen(true)}>
                <Menu />
              </button>
            )}
            {userRole === "co" && (
              <button onClick={handleLogout}>
                <LogOut size={20} />
              </button>
            )}
            <div className="font-bold">Kids & Entertainment LP</div>
            <div className="w-6"></div>
          </div>
        )}

        <main className="flex-1 overflow-hidden p-0 md:p-6 bg-white md:bg-transparent">
          {view === "login" ? (
            <div className="h-full overflow-y-auto p-4">
              <LoginScreen
                pin={pin}
                setPin={setPin}
                handleLogin={handleLogin}
                staffList={appData.staffList}
                loginMode={loginMode}
                setLoginMode={setLoginMode}
                selectedStaff={selectedStaff}
                setSelectedStaff={setSelectedStaff}
              />
            </div>
          ) : view === "force_pin_change" ? (
            // Use the key-pad based ChangePinView but customized for forcing
            <div className="h-full overflow-y-auto p-4">
              <ChangePinView
                setView={(target) => {
                  if (target === "dashboard") {
                    // Just a wrapper, logic is inside ChangePinView
                    setView(target);
                  }
                }}
                appData={appData}
                updateData={saveData}
                loggedInUserName={loggedInUserName}
                showAlert={triggerAlert}
              />
            </div>
          ) : view === "change_pin" ? (
            <div className="h-full overflow-y-auto p-4 md:p-0">
              <ChangePinView
                setView={setView}
                appData={appData}
                updateData={saveData}
                loggedInUserName={loggedInUserName}
                showAlert={triggerAlert}
              />
            </div>
          ) : view === "admin" ? (
            <div className="h-full overflow-y-auto p-4 md:p-0">
              {adminSubView === "menu" ? (
                <AdminMenu
                  setAdminSubView={setAdminSubView}
                  setView={setView}
                  handleLogout={handleLogout}
                  appData={appData}
                  updateData={saveData}
                  showAlert={triggerAlert}
                  handleLockApp={handleLockApp}
                  resetAllData={resetAllData}
                  showConfirm={triggerConfirm}
                />
              ) : adminSubView === "edit_schedule" ? (
                <EditSchedule
                  currentDay={currentDay}
                  todaysSchedule={todaysSchedule}
                  updateData={saveData}
                  appData={appData}
                  setAdminSubView={setAdminSubView}
                  onPrev={prevDay}
                  onNext={nextDay}
                  onCalendar={() => setIsCalendarOpen(true)}
                />
              ) : adminSubView === "edit_stats" ? (
                <EditStats
                  appData={appData}
                  updateData={saveData}
                  setAdminSubView={setAdminSubView}
                  currentDay={currentDay}
                  onPrev={prevDay}
                  onNext={nextDay}
                  onCalendar={() => setIsCalendarOpen(true)}
                />
              ) : adminSubView === "edit_chars" ? (
                <EditChars
                  currentDay={currentDay}
                  appData={appData}
                  updateData={saveData}
                  setAdminSubView={setAdminSubView}
                  onPrev={prevDay}
                  onNext={nextDay}
                  onCalendar={() => setIsCalendarOpen(true)}
                />
              ) : adminSubView === "manage_tasks" ? (
                <AdminTasksView
                  currentDay={currentDay}
                  backAction={() => setAdminSubView("menu")}
                  appData={appData}
                  updateData={saveData}
                  showConfirm={triggerConfirm}
                  onPrev={prevDay}
                  onNext={nextDay}
                  onCalendar={() => setIsCalendarOpen(true)}
                />
              ) : adminSubView === "edit_hours" ? (
                <EditHours
                  setAdminSubView={setAdminSubView}
                  appData={appData}
                  updateData={saveData}
                  showConfirm={triggerConfirm}
                  onPrev={prevDay}
                  onNext={nextDay}
                  onCalendar={() => setIsCalendarOpen(true)}
                  currentDay={currentDay}
                />
              ) : adminSubView === "edit_orders" ? (
                <EditOrders
                  setAdminSubView={setAdminSubView}
                  appData={appData}
                  updateData={saveData}
                  showConfirm={triggerConfirm}
                  onPrev={prevDay}
                  onNext={nextDay}
                  onCalendar={() => setIsCalendarOpen(true)}
                  currentDay={currentDay}
                />
              ) : adminSubView === "edit_phones" ? (
                <EditPhoneDirectory
                  appData={appData}
                  updateData={saveData}
                  showAlert={triggerAlert}
                  showConfirm={triggerConfirm}
                  backAction={() => setAdminSubView("menu")}
                />
              ) : adminSubView === "settings" ? (
                <EditSettings
                  setAdminSubView={setAdminSubView}
                  appData={appData}
                  updateData={saveData}
                  resetAllData={resetAllData}
                  showAlert={triggerAlert}
                  showConfirm={triggerConfirm}
                />
              ) : null}
            </div>
          ) : view === "dashboard" ? (
            <div className="h-full flex flex-col p-4 md:p-0 gap-4 overflow-y-auto md:overflow-hidden">
              {/* HEADER SECTION - FIXED HEIGHT */}
              <div className="shrink-0 space-y-4">
                <Card
                  className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white border-l-8 shadow-sm"
                  style={{ borderLeftColor: C.Blossom }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto justify-between md:justify-start">
                    <div>
                      <h2
                        className="text-xl font-bold"
                        style={{ color: C.Pine }}
                      >
                        {greeting}, {loggedInUserName.split(" ")[0]}!
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                      <button onClick={prevDay}>
                        <ChevronLeft size={16} />
                      </button>
                      <span
                        className="font-medium cursor-pointer min-w-[80px] text-center"
                        onClick={() => setCurrentDay(new Date())}
                      >
                        {toDutchDate(currentDay)}
                      </span>
                      <button onClick={nextDay}>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-xl font-bold text-gray-700 flex items-center justify-end">
                        {weather.temp}°{" "}
                        <WeatherIcon size={24} className="ml-2 text-gray-400" />
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {weather.desc}
                      </div>
                    </div>
                  </div>
                </Card>
                <BirthdayWidget
                  staffList={appData.staffList}
                  currentDay={currentDay}
                />
              </div>

              {/* WIDGETS SECTION - FIXED HEIGHT / SHRINKABLE */}
              <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-full">
                  <StatsWidget
                    dailyStats={appData.dailyStats}
                    currentDay={currentDay}
                    onViewDetails={() => setView("occupancy")}
                  />
                </div>
                <div className="h-full">
                  <TaskProgressWidget
                    checklists={sortedChecklists}
                    onViewTasks={() => setView("checks")}
                  />
                </div>
                <div className="h-full">
                  <CharactersWidget
                    todaysCharacters={todaysCharacters}
                    onViewCharacters={() => setView("characters")}
                  />
                </div>
              </div>

              {/* PROGRAM SECTION - FLEX GROW - FILL REMAINING SPACE */}
              <div className="flex-1 min-h-0 flex flex-col pb-2">
                <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <CalendarIcon size={18} style={{ color: C.Pine }} />{" "}
                    Programma (Komende dagen)
                  </h3>
                  <button
                    onClick={() => setView("schedule")}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    Volledig Overzicht
                  </button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row md:overflow-x-auto md:overflow-y-hidden gap-4 items-start pb-2 h-auto md:h-full">
                  {Object.keys(groupedSchedule).length > 0 ? (
                    Object.keys(groupedSchedule)
                      .slice(0, 7) // Show next 7 days with activities
                      .map((dateStr) => (
                        <div
                          key={dateStr}
                          className="bg-white rounded-xl shadow-sm overflow-hidden w-full md:w-[350px] md:min-w-[350px] h-auto md:h-full flex flex-col border-2 shrink-0"
                          style={{ borderColor: C.Pine }}
                        >
                          <div
                            className="px-4 py-2 border-b font-bold text-sm shrink-0"
                            style={{
                              backgroundColor: C.Pine,
                              color: "white",
                            }}
                          >
                            {toDutchDate(new Date(dateStr))}
                          </div>
                          <div className="divide-y divide-gray-100 md:overflow-y-auto custom-scrollbar flex-1">
                            {groupedSchedule[dateStr]
                              .sort((a, b) =>
                                sortActivities(a, b, new Date(dateStr))
                              )
                              .map((item) => {
                                const past = isActivityPast(
                                  item.time,
                                  new Date(dateStr)
                                );
                                const catInfo = ACTIVITY_TYPES.find(
                                  (t) => t.id === item.type
                                );
                                const staffMembers = formatStaffList(
                                  item.staff
                                ).sort();
                                return (
                                  <div
                                    key={item.id}
                                    className={`p-4 flex flex-col gap-2 ${
                                      past
                                        ? "opacity-50 grayscale bg-gray-50"
                                        : "hover:bg-teal-50"
                                    } transition-colors`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="font-bold text-sm text-gray-600 shrink-0">
                                        {item.time}
                                      </div>
                                      {catInfo && (
                                        <div
                                          className="text-[10px] font-bold uppercase"
                                          style={{
                                            color: catInfo.text,
                                            backgroundColor: catInfo.bg,
                                            display: "inline-block",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          {catInfo.label}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-bold text-base text-gray-800 whitespace-normal">
                                        {item.title}
                                      </div>
                                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin size={12} /> {item.loc}
                                      </div>
                                      {(userRole === "fm" ||
                                        userRole === "co") && (
                                        <div className="text-[10px] text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-dashed flex flex-wrap gap-3">
                                          {item.maxPax && (
                                            <span>
                                              <Users
                                                size={10}
                                                className="inline mr-1"
                                              />{" "}
                                              Max: {item.maxPax}
                                            </span>
                                          )}
                                          {item.price && (
                                            <span>
                                              <Euro
                                                size={10}
                                                className="inline mr-1"
                                              />{" "}
                                              {item.price}
                                            </span>
                                          )}
                                          {item.refhd && (
                                            <span className="font-mono bg-gray-200 px-1 rounded">
                                              REFHD: {item.refhd}
                                            </span>
                                          )}
                                          {item.paris && (
                                            <span className="text-blue-600 font-bold flex items-center">
                                              <CheckCircle
                                                size={10}
                                                className="mr-1"
                                              />{" "}
                                              PARIS
                                            </span>
                                          )}
                                          {item.villageMap && (
                                            <span className="text-green-600 font-bold flex items-center">
                                              <Map size={10} className="mr-1" />{" "}
                                              VillageMap
                                            </span>
                                          )}
                                          {item.remarks && (
                                            <div className="w-full text-gray-600 italic border-t pt-1 mt-1">
                                              Opmerking: {item.remarks}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {userRole === "staff" && (
                                        <div className="flex gap-3 mt-1 text-xs text-gray-500 font-medium">
                                          {item.maxPax && (
                                            <span>Max: {item.maxPax}</span>
                                          )}
                                          {item.price && (
                                            <span>Prijs: € {item.price}</span>
                                          )}
                                        </div>
                                      )}
                                      {userRole !== "co" &&
                                        item.staff &&
                                        item.staff.length > 0 && (
                                          <div className="flex gap-1 flex-wrap mt-2">
                                            {staffMembers.map(
                                              (staffName, idx) => (
                                                <span
                                                  key={idx}
                                                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                    staffName ===
                                                    loggedInUserName
                                                      ? "font-bold bg-teal-100 border-teal-300 text-teal-800"
                                                      : "bg-gray-50 border-gray-200 text-gray-600"
                                                  }`}
                                                >
                                                  {staffName}
                                                </span>
                                              )
                                            )}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 italic bg-white rounded-xl border col-span-full w-full">
                      Geen activiteiten gepland.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : view === "occupancy" && userRole !== "co" ? (
            <div className="max-w-4xl mx-auto h-full overflow-y-auto p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: C.Pine }}>
                  Bezetting
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-600 w-24 text-center">
                    {toDutchDate(currentDay)}
                  </span>
                  <button
                    onClick={nextDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <OccupancyView
                dailyStats={appData.dailyStats}
                currentDay={currentDay}
              />
            </div>
          ) : view === "characters" && userRole !== "co" ? (
            <div className="max-w-4xl mx-auto h-full overflow-y-auto p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: C.Pine }}>
                  Karakters
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-600 w-24 text-center">
                    {toDutchDate(currentDay)}
                  </span>
                  <button
                    onClick={nextDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getDayCharacters(currentDay)
                  .filter((c) => c.actor)
                  .map((c) => (
                    <div
                      key={c.role}
                      className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl"
                          style={{
                            backgroundColor: getCharColorInfo(c.role).bg,
                            color: getCharColorInfo(c.role).text,
                          }}
                        >
                          {c.role[0]}
                        </div>
                        <div className="font-bold text-lg">{c.role}</div>
                      </div>
                      <div className="font-bold text-gray-600">
                        {c.actor || "-"}
                      </div>
                    </div>
                  ))}
                {getDayCharacters(currentDay).filter((c) => c.actor).length ===
                  0 && (
                  <div className="col-span-full text-center py-10 text-gray-400 italic">
                    Geen karakters ingepland vandaag.
                  </div>
                )}
              </div>
            </div>
          ) : view === "handover" && userRole !== "co" ? (
            <div className="max-w-4xl mx-auto h-full overflow-y-auto p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: C.Pine }}>
                  Overdracht
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-600 w-24 text-center">
                    {toDutchDate(currentDay)}
                  </span>
                  <button
                    onClick={nextDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <HandoverView
                currentDay={currentDay}
                appData={appData}
                updateData={saveData}
                loggedInUserName={loggedInUserName}
                userRole={userRole}
              />
            </div>
          ) : view === "checks" && userRole !== "co" ? (
            <div className="max-w-6xl mx-auto space-y-6 h-full overflow-y-auto p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: C.Pine }}>
                  Takenlijsten
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-gray-600 w-24 text-center">
                    {toDutchDate(currentDay)}
                  </span>
                  <button
                    onClick={nextDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* ENTERTAINMENT COLUMN */}
                <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-yellow-400">
                  <h3
                    className="font-bold mb-4 flex items-center gap-2 text-lg"
                    style={{ color: C.Honey }}
                  >
                    <Music size={22} /> Entertainment
                  </h3>
                  {renderGroupedTasks(groupedEntTasks, C.Honey)}
                </div>

                {/* CREA ATELIER COLUMN */}
                <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-sky-400">
                  <h3
                    className="font-bold mb-4 flex items-center gap-2 text-lg"
                    style={{ color: C.Sky }}
                  >
                    <Palette size={22} /> Crea Atelier
                  </h3>
                  {renderGroupedTasks(groupedCreaTasks, C.Sky)}
                </div>

                {/* EXTRA COLUMN */}
                <div
                  className="bg-white p-4 rounded-xl shadow-sm border-t-4"
                  style={{ borderColor: C.Sunset }}
                >
                  <h3
                    className="font-bold mb-4 flex items-center gap-2 text-lg"
                    style={{ color: C.Sunset }}
                  >
                    <Clipboard size={22} /> Extra / Overig
                  </h3>
                  {renderGroupedTasks(groupedExtraTasks, C.Sunset)}
                  {(!extraTasks || extraTasks.length === 0) && (
                    <p className="text-xs text-gray-400 italic">
                      Geen extra taken.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : view === "hours" && userRole !== "co" ? (
            <div className="h-full overflow-y-auto p-4 md:p-0">
              <UserHoursView
                setView={setView}
                updateData={saveData}
                appData={appData}
                userRole={userRole}
                loggedInUserName={loggedInUserName}
                showAlert={triggerAlert}
              />
            </div>
          ) : view === "orders" && userRole !== "co" ? (
            <div className="h-full overflow-y-auto p-4 md:p-0">
              <UserOrderView
                setView={setView}
                updateData={saveData}
                appData={appData}
                loggedInUserName={loggedInUserName}
              />
            </div>
          ) : view === "phonelist" && userRole !== "co" ? (
            <div className="max-w-4xl mx-auto h-full overflow-y-auto p-4 md:p-0">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{ color: C.Pine }}>
                  Telefoonlijst
                </h2>
                <button
                  onClick={() => setView("dashboard")}
                  className="text-sm underline"
                >
                  Terug
                </button>
              </div>
              <div
                className="bg-white p-4 rounded-xl shadow-sm mb-4 flex gap-2 border"
                style={{ borderColor: C.Grass }}
              >
                <Search size={20} className="text-gray-400" />
                <input
                  placeholder="Zoek naam of nummer..."
                  className="flex-1 outline-none"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {filteredPhoneDirectory.map((p) => (
                  <a
                    key={p.id}
                    href={`tel:${p.phone}`}
                    className="block bg-white p-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                    style={{
                      borderLeftWidth: 6,
                      borderLeftColor: p.color || C.Pine,
                      borderColor: C.Grass,
                    }}
                  >
                    <div>
                      <div className="font-bold text-gray-800">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.phone}</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-full text-green-700">
                      <Phone size={18} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : view === "change_pin" && userRole !== "co" ? (
            <div className="h-full overflow-y-auto p-4 md:p-0">
              <ChangePinView
                setView={setView}
                appData={appData}
                updateData={saveData}
                loggedInUserName={loggedInUserName}
                showAlert={triggerAlert}
              />
            </div>
          ) : view === "schedule" ? (
            <div className="w-full h-full flex flex-col space-y-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4 shrink-0 px-4 md:px-0">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold" style={{ color: C.Pine }}>
                    Programma
                  </h2>
                  {(() => {
                    const start = getFridayOfWeek(currentDay);
                    const end = new Date(start);
                    end.setDate(start.getDate() + 6);
                    return (
                      <span className="text-xs font-medium text-gray-500">
                        Week van {toDutchDate(start)} t/m {toDutchDate(end)}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextDay}
                    className="p-2 bg-white rounded shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              {(userRole === "co" || userRole === "fm") && (
                <div
                  className={`p-3 rounded-lg flex justify-between items-center mb-4 shrink-0 mx-4 md:mx-0 ${
                    isDayPlanned
                      ? "bg-green-100 border border-green-300 text-green-800"
                      : "bg-orange-50 border border-orange-200 text-orange-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MonitorCheck size={20} />
                    <span className="font-bold text-sm">
                      {isDayPlanned
                        ? "Programma ingepland in systemen"
                        : "Nog niet ingepland in systemen"}
                    </span>
                  </div>
                  {userRole === "co" && (
                    <button
                      onClick={toggleDayPlanned}
                      className={`px-3 py-1 rounded font-bold text-xs ${
                        isDayPlanned
                          ? "bg-white text-green-700 border border-green-200"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      {isDayPlanned ? "Wijzig" : "Markeer als gedaan"}
                    </button>
                  )}
                </div>
              )}

              {/* 7-DAY WEEK SCHEDULE VIEW (STARTS FRIDAY) */}
              {/* Horizontale scroll container voor de 7 dagen */}
              {/* MODIFIED FOR MOBILE SCROLLING - STACKED VERTICALLY */}
              <div className="flex flex-col md:flex-row gap-4 pb-4 items-start h-full px-4 md:px-0 overflow-y-auto md:overflow-y-hidden md:overflow-x-auto">
                {(() => {
                  const startDate = getFridayOfWeek(currentDay);
                  const datesToShow = [];
                  for (let i = 0; i < 7; i++) {
                    const d = new Date(startDate);
                    d.setDate(startDate.getDate() + i);
                    datesToShow.push(d);
                  }

                  // Sort logic: Past days to bottom/end
                  const todayStart = new Date();
                  todayStart.setHours(0, 0, 0, 0);

                  // We map to object to keep date info, then sort
                  const sortedDates = datesToShow
                    .map((d) => ({ date: d, isPast: d < todayStart }))
                    .sort((a, b) => {
                      if (a.isPast !== b.isPast) return a.isPast ? 1 : -1; // Past last
                      return a.date - b.date;
                    });

                  return sortedDates.map(({ date: dateObj, isPast }) => {
                    const dKey = toIsoDate(dateObj);
                    const dailyItems = appData.schedule
                      .filter((s) => s.date === dKey)
                      .sort((a, b) => sortActivities(a, b, dateObj));

                    return (
                      <div
                        key={dKey}
                        // Modified width classes: w-full on mobile, fixed width on desktop
                        // Modified height classes: h-auto on mobile (to expand), h-full on desktop (to scroll inside)
                        className={`bg-white rounded-xl shadow-sm overflow-hidden w-full md:w-[400px] md:min-w-[400px] shrink-0 flex flex-col h-auto md:h-full border-2 ${
                          isPast ? "opacity-60 grayscale" : ""
                        }`}
                        style={{ borderColor: C.Pine }}
                      >
                        <div
                          className="px-4 py-2 border-b font-bold text-lg shrink-0 flex justify-between items-center"
                          style={{
                            backgroundColor: C.Pine,
                            color: "white",
                          }}
                        >
                          <span>{toDutchDate(dateObj)}</span>
                          {isPast && (
                            <span className="text-xs font-normal uppercase bg-white/20 px-2 py-1 rounded">
                              Geweest
                            </span>
                          )}
                        </div>
                        <div className="divide-y divide-gray-100 md:overflow-y-auto custom-scrollbar flex-1">
                          {" "}
                          {/* Removed overflow-y-auto for mobile so it expands */}
                          {dailyItems.length > 0 ? (
                            dailyItems.map((item) => {
                              const past = isActivityPast(item.time, dateObj);
                              const catInfo = ACTIVITY_TYPES.find(
                                (t) => t.id === item.type
                              );
                              const staffMembers = formatStaffList(
                                item.staff
                              ).sort();
                              return (
                                <div
                                  key={item.id}
                                  className={`p-4 flex flex-col gap-2 ${
                                    past
                                      ? "opacity-50 grayscale bg-gray-50"
                                      : "hover:bg-teal-50"
                                  } transition-colors`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="font-bold text-lg text-gray-600 shrink-0">
                                      {item.time}
                                    </div>
                                    {catInfo && (
                                      <div
                                        className="text-[10px] font-bold uppercase"
                                        style={{
                                          color: catInfo.text,
                                          backgroundColor: catInfo.bg,
                                          display: "inline-block",
                                          padding: "2px 6px",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {catInfo.label}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-base text-gray-800 whitespace-normal">
                                      {item.title}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                      <MapPin size={12} /> {item.loc}
                                    </div>
                                    {(userRole === "fm" ||
                                      userRole === "co") && (
                                      <div className="text-[10px] text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-dashed flex flex-wrap gap-3">
                                        {item.maxPax && (
                                          <span>
                                            <Users
                                              size={10}
                                              className="inline mr-1"
                                            />{" "}
                                            Max: {item.maxPax}
                                          </span>
                                        )}
                                        {item.price && (
                                          <span>
                                            <Euro
                                              size={10}
                                              className="inline mr-1"
                                            />{" "}
                                            {item.price}
                                          </span>
                                        )}
                                        {item.refhd && (
                                          <span className="font-mono bg-gray-200 px-1 rounded">
                                            REFHD: {item.refhd}
                                          </span>
                                        )}
                                        {item.paris && (
                                          <span className="text-blue-600 font-bold flex items-center">
                                            <CheckCircle
                                              size={10}
                                              className="mr-1"
                                            />{" "}
                                            PARIS
                                          </span>
                                        )}
                                        {item.villageMap && (
                                          <span className="text-green-600 font-bold flex items-center">
                                            <Map size={10} className="mr-1" />{" "}
                                            VillageMap
                                          </span>
                                        )}
                                        {item.remarks && (
                                          <div className="w-full text-gray-600 italic border-t pt-1 mt-1">
                                            Opmerking: {item.remarks}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {userRole === "staff" && (
                                      <div className="flex gap-3 mt-1 text-xs text-gray-500 font-medium">
                                        {item.maxPax && (
                                          <span>Max: {item.maxPax}</span>
                                        )}
                                        {item.price && (
                                          <span>Prijs: € {item.price}</span>
                                        )}
                                      </div>
                                    )}
                                    {userRole !== "co" &&
                                      item.staff &&
                                      item.staff.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mt-2">
                                          {staffMembers.map(
                                            (staffName, idx) => (
                                              <span
                                                key={idx}
                                                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                  staffName === loggedInUserName
                                                    ? "font-bold bg-teal-100 border-teal-300 text-teal-800"
                                                    : "bg-gray-50 border-gray-200 text-gray-600"
                                                }`}
                                              >
                                                {staffName}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-6 text-center text-gray-400 italic">
                              Geen activiteiten.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500">
              Selecteer een optie in het menu
            </div>
          )}
        </main>
        {isCalendarOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="p-4 bg-white">
              <input
                type="date"
                className="border p-2 rounded w-full mb-4"
                onChange={(e) => {
                  setCurrentDay(new Date(e.target.value));
                  setIsCalendarOpen(false);
                }}
              />
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="w-full text-center text-red-500 font-bold"
              >
                Sluiten
              </button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
