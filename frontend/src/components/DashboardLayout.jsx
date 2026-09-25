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
  Search,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Settings,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/authcontext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuGroups = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: <LayoutDashboard size={18} />,
        },
      ],
    },
    {
      title: "ACADEMIC",
      items: [
        {
          label: "Students",
          path: "/admin/students",
          icon: <Users size={18} />,
        },
        {
          label: "Teachers",
          path: "/admin/teachers",
          icon: <GraduationCap size={18} />,
        },
        {
          label: "Courses",
          path: "/admin/courses",
          icon: <BookOpen size={18} />,
        },
        {
          label: "Attendance",
          path: "/admin/attendance",
          icon: <ClipboardCheck size={18} />,
        },
        {
          label: "Results",
          path: "/admin/results",
          icon: <ClipboardList size={18} />,
        },
        {
          label: "Timetable",
          path: "/admin/timetable",
          icon: <CalendarDays size={18} />,
        },
      ],
    },
    {
      title: "FINANCE & NOTICES",
      items: [
        {
          label: "Fees",
          path: "/admin/fees",
          icon: <IndianRupee size={18} />,
        },
        {
          label: "Notices",
          path: "/admin/notices",
          icon: <Bell size={18} />,
        },
      ],
    },
    {
      title: "LIBRARY",
      items: [
        {
          label: "Book Issue",
          path: "/admin/BookIssue",
          icon: <Library size={18} />,
        },
        {
          label: "Book Management",
          path: "/admin/BookManagement",
          icon: <BookOpen size={18} />,
        },
        {
          label: "Library",
          path: "/student/library",
          icon: <BookOpen size={18} />,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          label: "Users",
          path: "/admin/users",
          icon: <UsersRound size={18} />,
        },
      ],
    },
  ];

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return menuGroups;

    return menuGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [search]);

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="cms-layout">
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="cms-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`cms-sidebar ${
          sidebarOpen ? "cms-sidebar-open" : ""
        }`}
      >
        {/* Brand */}
        <div className="cms-brand">
          <div className="cms-brand-icon">
            <GraduationCap size={23} />
          </div>

          <div className="cms-brand-text">
            <div className="cms-brand-title">
              College CMS
            </div>

            <div className="cms-brand-subtitle">
              Management System
            </div>
          </div>

          <button
            className="cms-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="cms-admin-badge">
          <div className="cms-admin-badge-icon">
            <ShieldCheck size={15} />
          </div>

          <div>
            <div className="cms-admin-badge-title">
              Administrator
            </div>

            <div className="cms-admin-badge-status">
              <span />
              System active
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="cms-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="cms-search-clear"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="cms-navigation">
          {filteredGroups.length === 0 ? (
            <div className="cms-no-results">
              <Search size={24} />
              <span>No menu found</span>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                className="cms-nav-group"
                key={group.title}
              >
                <div className="cms-nav-heading">
                  {group.title}
                </div>

                <div className="cms-nav-items">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setSidebarOpen(false);
                      }}
                      className={({ isActive }) =>
                        `cms-nav-link ${
                          isActive
                            ? "cms-nav-link-active"
                            : ""
                        }`
                      }
                    >
                      <span className="cms-nav-icon">
                        {item.icon}
                      </span>

                      <span className="cms-nav-label">
                        {item.label}
                      </span>

                      <ChevronRight
                        className="cms-nav-arrow"
                        size={15}
                      />
                    </NavLink>
                  ))}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="cms-sidebar-footer">
          <div className="cms-user-card">
            <div className="cms-user-avatar">
              {firstLetter}
            </div>

            <div className="cms-user-details">
              <div className="cms-user-name">
                {user?.name || "Admin"}
              </div>

              <div className="cms-user-role">
                <span className="cms-online-dot" />
                {user?.role || "admin"}
              </div>
            </div>

            <button
              className="cms-settings-btn"
              title="Settings"
            >
              <Settings size={16} />
            </button>
          </div>

          <button
            className="cms-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="cms-main">
        {/* Top Navbar */}
        <header className="cms-navbar">
          <div className="cms-navbar-left">
            <button
              className="cms-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div className="cms-page-context">
              <div className="cms-context-label">
                ADMINISTRATION
              </div>

              <div className="cms-context-title">
                College Management
              </div>
            </div>
          </div>

          <div className="cms-navbar-right">
            {/* System status */}
            <div className="cms-system-status">
              <span className="cms-status-dot" />
              <span>System Online</span>
            </div>

            {/* Notification */}
            <button
              className="cms-notification-btn"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="cms-notification-badge">
                0
              </span>
            </button>

            {/* Profile */}
            <div className="cms-navbar-profile">
              <div className="cms-navbar-avatar">
                {firstLetter}
              </div>

              <div className="cms-navbar-user">
                <div className="cms-navbar-user-name">
                  {user?.name || "Admin"}
                </div>

                <div className="cms-navbar-user-role">
                  Administrator
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="cms-content">
          <Outlet />
        </div>
      </main>

      {/* =====================================================
          PROFESSIONAL RESPONSIVE CSS
      ====================================================== */}

      <style>
        {`
          * {
            box-sizing: border-box;
          }

          html,
          body,
          #root {
            margin: 0;
            min-height: 100%;
          }

          .cms-layout {
            min-height: 100vh;
            width: 100%;
            display: flex;
            background: #f8fafc;
            color: #0f172a;
            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          /* =================================================
             SIDEBAR
          ================================================= */

          .cms-sidebar {
            width: 200px;
            min-width: 200px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;

            background:
              radial-gradient(
                circle at 20% 0%,
                rgba(37, 99, 235, 0.13),
                transparent 32%
              ),
              linear-gradient(
                180deg,
                #0b1220 0%,
                #0f172a 100%
              );

            border-right: 1px solid #1e293b;
            color: white;

            transition:
              transform 0.3s ease,
              box-shadow 0.3s ease;
          }

          /* =================================================
             BRAND
          ================================================= */

          .cms-brand {
            height: 76px;
            padding: 0 17px;
            display: flex;
            align-items: center;
            gap: 11px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.12);
          }

          .cms-brand-icon {
            width: 42px;
            height: 42px;
            min-width: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;

            background:
              linear-gradient(
                135deg,
                #2563eb,
                #3b82f6
              );

            box-shadow:
              0 8px 22px rgba(37, 99, 235, 0.3);
          }

          .cms-brand-text {
            min-width: 0;
          }

          .cms-brand-title {
            font-size: 16px;
            font-weight: 750;
            letter-spacing: -0.2px;
            color: #f8fafc;
          }

          .cms-brand-subtitle {
            margin-top: 2px;
            font-size: 9px;
            color: #64748b;
            letter-spacing: 0.2px;
          }

          .cms-close-btn {
            display: none;
            margin-left: auto;
            width: 34px;
            height: 34px;
            border-radius: 9px;
            border: 1px solid #334155;
            background: rgba(255,255,255,0.04);
            color: #cbd5e1;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          /* =================================================
             ADMIN BADGE
          ================================================= */

          .cms-admin-badge {
            margin: 16px 14px 12px;
            padding: 11px;
            border-radius: 12px;

            display: flex;
            align-items: center;
            gap: 10px;

            background:
              linear-gradient(
                135deg,
                rgba(37,99,235,0.15),
                rgba(59,130,246,0.06)
              );

            border: 1px solid
              rgba(59,130,246,0.15);
          }

          .cms-admin-badge-icon {
            width: 30px;
            height: 30px;
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: rgba(37,99,235,0.18);
            color: #60a5fa;
          }

          .cms-admin-badge-title {
            font-size: 11px;
            font-weight: 700;
            color: #e2e8f0;
          }

          .cms-admin-badge-status {
            margin-top: 3px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 9px;
            color: #64748b;
          }

          .cms-admin-badge-status span {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #22c55e;
            box-shadow:
              0 0 0 3px rgba(34,197,94,0.08);
          }

          /* =================================================
             SEARCH
          ================================================= */

          .cms-search {
            margin: 0 14px 14px;
            height: 38px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 11px;

            color: #64748b;
            background: rgba(15,23,42,0.7);
            border: 1px solid #1e293b;
            border-radius: 9px;
          }

          .cms-search:focus-within {
            border-color: #2563eb;
            box-shadow:
              0 0 0 3px rgba(37,99,235,0.1);
          }

          .cms-search input {
            width: 100%;
            min-width: 0;
            border: 0;
            outline: 0;
            background: transparent;
            color: #e2e8f0;
            font-size: 11px;
          }

          .cms-search input::placeholder {
            color: #475569;
          }

          .cms-search-clear {
            border: 0;
            background: transparent;
            color: #64748b;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          /* =================================================
             NAVIGATION
          ================================================= */

          .cms-navigation {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 2px 10px 12px;
          }

          .cms-navigation::-webkit-scrollbar {
            width: 4px;
          }

          .cms-navigation::-webkit-scrollbar-track {
            background: transparent;
          }

          .cms-navigation::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 10px;
          }

          .cms-nav-group {
            margin-bottom: 18px;
          }

          .cms-nav-heading {
            padding: 0 9px 7px;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1.3px;
            color: #475569;
          }

          .cms-nav-items {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .cms-nav-link {
            min-height: 39px;
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 10px;
            border-radius: 9px;
            color: #94a3b8;
            text-decoration: none;
            font-size: 11.5px;
            font-weight: 500;

            transition:
              color 0.18s ease,
              background 0.18s ease,
              transform 0.18s ease;
          }

          .cms-nav-link:hover {
            color: #f1f5f9;
            background: rgba(255,255,255,0.045);
            transform: translateX(2px);
          }

          .cms-nav-link-active {
            color: #ffffff !important;
            background:
              linear-gradient(
                90deg,
                rgba(37,99,235,0.95),
                rgba(29,78,216,0.78)
              ) !important;

            box-shadow:
              0 7px 18px rgba(37,99,235,0.18);
          }

          .cms-nav-link-active::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 3px;
            border-radius: 0 4px 4px 0;
            background: #bfdbfe;
          }

          .cms-nav-icon {
            width: 24px;
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .cms-nav-link-active
            .cms-nav-icon {
            color: #ffffff;
          }

          .cms-nav-label {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .cms-nav-arrow {
            opacity: 0;
            transform: translateX(-4px);
            transition: all 0.18s ease;
          }

          .cms-nav-link:hover
            .cms-nav-arrow,
          .cms-nav-link-active
            .cms-nav-arrow {
            opacity: 0.65;
            transform: translateX(0);
          }

          .cms-no-results {
            min-height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #475569;
            font-size: 10px;
          }

          /* =================================================
             SIDEBAR FOOTER
          ================================================= */

          .cms-sidebar-footer {
            padding: 12px;
            border-top: 1px solid rgba(148,163,184,0.12);
            background: rgba(2,6,23,0.3);
          }

          .cms-user-card {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 8px;
            border-radius: 10px;
            background: rgba(255,255,255,0.035);
            border: 1px solid rgba(148,163,184,0.08);
          }

          .cms-user-avatar {
            width: 34px;
            height: 34px;
            min-width: 34px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;

            color: white;
            font-size: 12px;
            font-weight: 750;

            background:
              linear-gradient(
                135deg,
                #2563eb,
                #3b82f6
              );
          }

          .cms-user-details {
            flex: 1;
            min-width: 0;
          }

          .cms-user-name {
            color: #e2e8f0;
            font-size: 10.5px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .cms-user-role {
            margin-top: 3px;
            display: flex;
            align-items: center;
            gap: 4px;
            color: #64748b;
            font-size: 8.5px;
            text-transform: capitalize;
          }

          .cms-online-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #22c55e;
          }

          .cms-settings-btn {
            width: 28px;
            height: 28px;
            border: 0;
            border-radius: 7px;
            background: transparent;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .cms-settings-btn:hover {
            color: #cbd5e1;
            background: rgba(255,255,255,0.05);
          }

          .cms-logout-btn {
            width: 100%;
            height: 36px;
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;

            border: 1px solid rgba(239,68,68,0.18);
            border-radius: 8px;

            background: rgba(239,68,68,0.045);
            color: #fca5a5;

            font-size: 10.5px;
            font-weight: 600;
            cursor: pointer;

            transition: all 0.2s ease;
          }

          .cms-logout-btn:hover {
            background: rgba(239,68,68,0.1);
            border-color: rgba(239,68,68,0.3);
          }

          /* =================================================
             MAIN
          ================================================= */

          .cms-main {
            width: calc(100% - 220px);
            min-width: 0;
            margin-left: 220px;
            min-height: 100vh;
          }

          /* =================================================
             NAVBAR
          ================================================= */

          .cms-navbar {
            height: 76px;
            position: sticky;
            top: 0;
            z-index: 50;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0 28px;

            background:
              rgba(255,255,255,0.94);

            backdrop-filter: blur(16px);

            border-bottom: 1px solid #e2e8f0;
          }

          .cms-navbar-left {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
          }

          .cms-menu-btn {
            display: none;
            width: 39px;
            height: 39px;
            border: 1px solid #e2e8f0;
            border-radius: 9px;
            background: #ffffff;
            color: #334155;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .cms-page-context {
            min-width: 0;
          }

          .cms-context-label {
            color: #2563eb;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1.3px;
          }

          .cms-context-title {
            margin-top: 3px;
            color: #0f172a;
            font-size: 15px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .cms-navbar-right {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-shrink: 0;
          }

          .cms-system-status {
            height: 30px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            gap: 6px;
            border-radius: 8px;
            background: #f0fdf4;
            border: 1px solid #dcfce7;
            color: #15803d;
            font-size: 9px;
            font-weight: 600;
          }

          .cms-status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #22c55e;
            box-shadow:
              0 0 0 3px rgba(34,197,94,0.1);
          }

          .cms-notification-btn {
            width: 36px;
            height: 36px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;

            border: 1px solid #e2e8f0;
            border-radius: 9px;
            background: #ffffff;

            color: #64748b;
            cursor: pointer;
          }

          .cms-notification-btn:hover {
            color: #2563eb;
            border-color: #bfdbfe;
            background: #eff6ff;
          }

          .cms-notification-badge {
            position: absolute;
            top: -3px;
            right: -3px;
            min-width: 15px;
            height: 15px;
            padding: 0 3px;
            display: flex;
            align-items: center;
            justify-content: center;

            border: 2px solid white;
            border-radius: 999px;

            background: #2563eb;
            color: white;

            font-size: 7px;
            font-weight: 700;
          }

          .cms-navbar-profile {
            display: flex;
            align-items: center;
            gap: 9px;
            padding-left: 14px;
            border-left: 1px solid #e2e8f0;
          }

          .cms-navbar-avatar {
            width: 37px;
            height: 37px;
            min-width: 37px;
            border-radius: 10px;

            display: flex;
            align-items: center;
            justify-content: center;

            color: #1d4ed8;
            background:
              linear-gradient(
                135deg,
                #dbeafe,
                #bfdbfe
              );

            font-size: 12px;
            font-weight: 750;
          }

          .cms-navbar-user {
            min-width: 0;
          }

          .cms-navbar-user-name {
            max-width: 130px;
            color: #0f172a;
            font-size: 10.5px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .cms-navbar-user-role {
            margin-top: 2px;
            color: #94a3b8;
            font-size: 8.5px;
          }

          /* =================================================
             CONTENT
          ================================================= */

          .cms-content {
            width: 100%;
            min-width: 0;
            padding: 28px;
          }

          /* =================================================
             TABLET
          ================================================= */

          @media (max-width: 1050px) {
            .cms-sidebar {
              width: 245px;
              min-width: 245px;
            }

            .cms-main {
              width: calc(100% - 245px);
              margin-left: 245px;
            }

            .cms-content {
              padding: 23px;
            }

            .cms-system-status {
              display: none;
            }
          }

          /* =================================================
             MOBILE
          ================================================= */

          @media (max-width: 768px) {
            .cms-sidebar {
              width: 280px;
              min-width: 280px;
              transform: translateX(-100%);
              box-shadow:
                15px 0 40px rgba(15,23,42,0.22);
            }

            .cms-sidebar-open {
              transform: translateX(0);
            }

            .cms-close-btn {
              display: flex;
            }

            .cms-overlay {
              display: block;
              position: fixed;
              inset: 0;
              z-index: 90;
              background: rgba(15,23,42,0.55);
              backdrop-filter: blur(3px);
            }

            .cms-main {
              width: 100%;
              margin-left: 0;
            }

            .cms-menu-btn {
              display: flex;
            }

            .cms-navbar {
              height: 68px;
              padding: 0 18px;
            }

            .cms-content {
              padding: 20px;
            }

            .cms-navbar-profile {
              padding-left: 8px;
              border-left: 0;
            }

            .cms-navbar-user {
              display: none;
            }
          }

          /* =================================================
             SMALL MOBILE
          ================================================= */

          @media (max-width: 480px) {
            .cms-sidebar {
              width: 88vw;
              min-width: 0;
              max-width: 300px;
            }

            .cms-navbar {
              padding: 0 13px;
              gap: 8px;
            }

            .cms-navbar-left {
              gap: 9px;
            }

            .cms-context-label {
              font-size: 7px;
            }

            .cms-context-title {
              font-size: 12px;
            }

            .cms-navbar-right {
              gap: 7px;
            }

            .cms-notification-btn {
              width: 34px;
              height: 34px;
            }

            .cms-navbar-avatar {
              width: 34px;
              height: 34px;
              min-width: 34px;
            }

            .cms-content {
              padding: 14px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;