import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Library,
  ClipboardCheck,
  ClipboardList,
  IndianRupee,
  CalendarDays,
  Bell,
  LogOut,
  Menu,
  X,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/authcontext";


const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Students",
      path: "/admin/students",
      icon: <Users size={20} />,
    },
    {
      label: "Teachers",
      path: "/admin/teachers",
      icon: <GraduationCap size={20} />,
    },
    {
      label: "Courses",
      path: "/admin/courses",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Attendance",
      path: "/admin/attendance",
      icon: <ClipboardCheck size={20} />,
    },
    {
      label: "Fees",
      path: "/admin/fees",
      icon: <IndianRupee size={20} />,
    },
    {
      label: "Timetable",
      path: "/admin/timetable",
      icon: <CalendarDays size={20} />,
    },
    {
      label: "Notices",
      path: "/admin/notices",
      icon: <Bell size={20} />,
    },
    {
  label: "Results",
  path: "/admin/results",
  icon: <ClipboardList size={20} />,
},
{
  label: "Book Issue",
  path: "/admin/BookIssue",
  icon: <Library size={20} />,
},
{
  label: "Book Management",
  path: "/admin/BookManagement",
  icon: <BookOpen size={20} />,
},
{
  label: "Library",
  path: "/student/library",
  icon: <BookOpen size={20} />,
},
    {
  label: "Users",
  path: "/admin/users",
  icon: <UsersRound size={20} />,
},
    
  ];

  return (
    <div style={styles.container}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarMobileOpen : {}),
        }}
      >
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <GraduationCap size={26} />
          </div>
          <div>
            <h2 style={styles.logoTitle}>College CMS</h2>
            <p style={styles.logoSubtitle}>Management System</p>
          </div>

          <button
            style={styles.closeButton}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav style={styles.nav}>
          <p style={styles.menuHeading}>MAIN MENU</p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.activeNavLink : {}),
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <div style={styles.userMini}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>

          <button
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main style={styles.main}>
        <header style={styles.navbar}>
          <button
            style={styles.menuButton}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div>
            <h3 style={styles.navbarTitle}>Welcome back, {user?.name}</h3>
            <p style={styles.navbarSubtitle}>
              Manage your college activities
            </p>
          </div>

          <div style={styles.navbarRight}>
            <Bell size={21} />
            <div style={styles.navbarAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section style={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  overlay: {
    display: "none",
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: "#111827",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 20,
  },

  sidebarMobileOpen: {
    transform: "translateX(0)",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "24px 18px",
    borderBottom: "1px solid #374151",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoTitle: {
    margin: 0,
    fontSize: "18px",
  },

  logoSubtitle: {
    margin: "4px 0 0",
    fontSize: "11px",
    color: "#9ca3af",
  },

  closeButton: {
    display: "none",
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
  },

  nav: {
    padding: "22px 12px",
    flex: 1,
    overflowY: "auto",
  },

  menuHeading: {
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: "bold",
    margin: "0 12px 12px",
    letterSpacing: "1px",
  },

  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "12px 14px",
    marginBottom: "6px",
    borderRadius: "8px",
    color: "#d1d5db",
    textDecoration: "none",
    fontSize: "14px",
    transition: "0.2s",
  },

  activeNavLink: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },

  sidebarBottom: {
    padding: "16px",
    borderTop: "1px solid #374151",
  },

  userMini: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    overflow: "hidden",
  },

  logoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 12px",
    border: "1px solid #374151",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#fca5a5",
    cursor: "pointer",
    fontSize: "14px",
  },

  main: {
    flex: 1,
    marginLeft: "250px",
    minWidth: 0,
  },

  navbar: {
    height: "76px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    padding: "0 30px",
    gap: "16px",
  },

  menuButton: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  navbarTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },

  navbarSubtitle: {
    margin: "5px 0 0",
    fontSize: "12px",
    color: "#6b7280",
  },

  navbarRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#6b7280",
  },

  navbarAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  content: {
    padding: "30px",
  },
};

export default DashboardLayout;