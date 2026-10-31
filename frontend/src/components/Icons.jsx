import {
  BookOpen,
  Wallet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  Code,
  BarChart3,
  Palette,
  Calendar,
  CalendarCheck,
  Mail,
  Phone,
  MapPin,
  Users,
  X,
  Menu,
  Check,
  ArrowRight,
  ArrowLeft,
  Inbox,
  Trash2,
  Pencil,
  Plus,
  Lock,
  GraduationCap,
  Target,
  Send,
  LogOut,
  Ban,
  Frown,
  ShoppingBag,
} from "lucide-react";

// Maps a simple name to a Lucide icon component.
// Usage: <Icon name="clock" className="h-5 w-5" />
const ICONS = {
  book: BookOpen,
  wallet: Wallet,
  clock: Clock,
  checkCircle: CheckCircle2,
  alert: AlertTriangle,
  search: Search,
  sparkles: Sparkles,
  code: Code,
  chart: BarChart3,
  palette: Palette,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  users: Users,
  x: X,
  menu: Menu,
  check: Check,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  inbox: Inbox,
  trash: Trash2,
  edit: Pencil,
  plus: Plus,
  lock: Lock,
  cap: GraduationCap,
  target: Target,
  send: Send,
  logout: LogOut,
  ban: Ban,
  frown: Frown,
  bag: ShoppingBag,
};

function Icon({ name, className = "h-5 w-5", strokeWidth = 1.6 }) {
  const Component = ICONS[name];
  if (!Component) return null;

  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}

export default Icon;