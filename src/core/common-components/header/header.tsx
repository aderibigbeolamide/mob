"use client";
import React from "react";
import ImageWithBasePath from "../image-with-base-path";
import { useDispatch, useSelector } from "react-redux";
import { setMobileSidebar, toggleHiddenLayout } from "@/core/redux/sidebarSlice";
import { useEffect, useState, useRef, useCallback } from "react";
import { updateTheme } from "@/core/redux/themeSlice";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { all_routes } from "@/router/all_routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { apiClient } from "@/lib/services/api-client";
import { UserRole } from "@/types/emr";


// Function to load/unload RTL CSS
const loadRTLStylesheet = () => {
  const existingLink = document.getElementById('rtl-stylesheet');
  if (!existingLink) {
    const link = document.createElement('link');
    link.id = 'rtl-stylesheet';
    link.rel = 'stylesheet';
    link.href = '/src/assets/css/bootstrap.rtl.min.css';
    document.head.appendChild(link);
  }
};

const unloadRTLStylesheet = () => {
  const existingLink = document.getElementById('rtl-stylesheet');
  if (existingLink) {
    existingLink.remove();
  }
};

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const Header = () => {
  const location = usePathname();
  const dispatch = useDispatch();
  const themeSettings = useSelector((state: any) => state.theme.themeSettings);
  const hiddenLayout = useSelector((state: any) => state.sidebarSlice.hiddenLayout);
  const { data: session } = useSession();

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const getUserInitials = useCallback(() => {
    if (!session?.user?.firstName || !session?.user?.lastName) {
      return "U";
    }
    return `${session.user.firstName.charAt(0)}${session.user.lastName.charAt(0)}`.toUpperCase();
  }, [session]);

  const getUserRoleDisplay = useCallback(() => {
    if (!session?.user?.role) return "User";
    return session.user.role
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, [session]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  // Check if current page is a layout page
  const isLayoutPage = () => {
    const layoutPaths = [
      all_routes.layoutMini,
      all_routes.layoutHoverview,
      all_routes.layoutHidden,
      all_routes.layoutFullwidth,
      all_routes.layoutRtl,
      all_routes.layoutDark
    ];
    return layoutPaths.includes(location);
  };
  const toggleMobileSidebar = useCallback(() => {
    dispatch(setMobileSidebar(!mobileSidebar));
  }, [dispatch, mobileSidebar]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    }
  }, [isFullscreen]);

  const handleUpdateTheme = useCallback(
    (key: string, value: string) => {
      if (themeSettings["dir"] === "rtl" && key !== "dir") {
        dispatch(updateTheme({ dir: "ltr" }));
      }
      dispatch(updateTheme({ [key]: value }));
    },
    [dispatch, themeSettings["dir"]]
  );

  // Note: DOM updates are handled by sidebar.tsx useEffect to avoid race conditions

  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const { t } = useTranslation();

  const isAdmin = session?.user?.role === UserRole.ADMIN;

  const formatTime = useCallback((date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} min ago`;
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hours ago`;
    return `${Math.floor(diffInMins / 1440)} days ago`;
  }, []);

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case "success":
        return "ti-check-circle";
      case "error":
        return "ti-alert-circle";
      case "warning":
        return "ti-alert-triangle";
      case "appointment":
        return "ti-calendar";
      default:
        return "ti-info-circle";
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "10",
        ...(isAdmin && { viewAll: "true" }),
      });

      const response = await apiClient.get<NotificationsResponse>(
        `/api/notifications?${params.toString()}`,
        { showErrorToast: false }
      );

      const fetchedNotifications = response.notifications || [];
      setNotifications(fetchedNotifications);
      const unread = fetchedNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationsLoading(false);
    }
  }, [session?.user, isAdmin]);

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await apiClient.put(`/api/notifications/${id}/read`, { isRead: true }, {
        showSuccessToast: false,
        showErrorToast: false,
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, [fetchNotifications]);

  // Move inline event handlers to named functions
  const handleToggleBtn2Click = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (themeSettings["data-layout"] === "hidden") {
      // In hidden mode, toggle the hidden layout state
      dispatch(toggleHiddenLayout());
    } else {
      // On desktop, toggle mini sidebar; on mobile, toggle mobile sidebar
      const isMobile = window.innerWidth < 992; // Bootstrap lg breakpoint
      
      if (isMobile) {
        toggleMobileSidebar();
      } else {
        // Toggle mini sidebar on desktop
        const isMini = themeSettings["data-layout"] === "mini";
        const updatedLayout = isMini ? "default" : "mini";
        dispatch(updateTheme({ "data-layout": updatedLayout }));
      }
    }
  }, [dispatch, toggleMobileSidebar, themeSettings["data-layout"]]);
  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const handleDarkModeClick = useCallback(() => {
    handleUpdateTheme("data-bs-theme", "light");
  }, [handleUpdateTheme]);
  const handleLightModeClick = useCallback(() => {
    handleUpdateTheme("data-bs-theme", "dark");
  }, [handleUpdateTheme]);

  // Language change handler
  const handleLanguageChange = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      if (lng === "ar") {
        handleUpdateTheme("dir", "rtl");
        loadRTLStylesheet();
      } else {
        handleUpdateTheme("dir", "ltr");
        unloadRTLStylesheet();
      }
    },
    [handleUpdateTheme]
  );

  const languageOptions = [
    { code: "en", label: t("header.english"), flag: "assets/img/flags/us.svg" },
    { code: "de", label: t("header.german"), flag: "assets/img/flags/de.svg" },
    { code: "fr", label: t("header.french"), flag: "assets/img/flags/fr.svg" },
    { code: "ar", label: t("header.arabic"), flag: "assets/img/flags/ae.svg" },
  ];
  const currentLang =
    languageOptions.find((l) => l.code === i18n.language) || languageOptions[0];

  // Load RTL stylesheet on mount if current language is Arabic
  useEffect(() => {
    if (i18n.language === "ar") {
      loadRTLStylesheet();
    }
  }, []);

  // Initialize Bootstrap dropdowns
  useEffect(() => {
    const initializeDropdowns = () => {
      if (typeof window !== 'undefined' && window.bootstrap) {
        const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownElementList.forEach(dropdownToggleEl => {
          try {
            const existingDropdown = window.bootstrap!.Dropdown.getInstance(dropdownToggleEl as HTMLElement);
            if (!existingDropdown) {
              new window.bootstrap!.Dropdown(dropdownToggleEl as HTMLElement);
            }
          } catch (error) {
            console.error('Error initializing dropdown:', error);
          }
        });
      }
    };

    // Initialize immediately
    initializeDropdowns();

    // Re-initialize after a short delay to ensure all elements are loaded
    const timeoutId = setTimeout(initializeDropdowns, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session?.user, fetchNotifications]);

  useEffect(() => {
    if (!session?.user) return;

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [session?.user, fetchNotifications]);

  return (
    <>
      {/* Topbar Start */}
      <header className="navbar-header">
        <div className="page-container topbar-menu">
          <div className="d-flex align-items-center gap-sm-2 gap-1">
            {/* Sidebar Mobile Button */}
            <Link
              id="mobile_btn"
              className="mobile-btn"
              href="#sidebar"
              onClick={toggleMobileSidebar}
              aria-label="Toggle mobile sidebar"
            >
              <i className="ti ti-menu-deep fs-24" aria-hidden="true" />
            </Link>
            {/* Logo */}
            <Link href={all_routes.dashboard} className="logo">
              {/* Logo Normal */}
              <span className="logo-light">
                <span className="logo-lg">
                  <ImageWithBasePath src="life-point-logo.png" alt="Life Point Medical Centre" width={42} height={42} />
                </span>
              </span>
              {/* Logo Dark */}
              <span className="logo-dark">
                <span className="logo-lg">
                  <ImageWithBasePath
                    src="life-point-logo.png"
                    alt="Life Point Medical Centre"
                    width={42}
                    height={42}
                  />
                </span>
              </span>

              {/* Logo sm */}
              <span className="logo-small">
                <span className="logo-lg">
                  <ImageWithBasePath
                    src="life-point-logo.png"
                    alt="Life Point Medical Centre"
                    width={32}
                    height={32}
                  />
                </span>
              </span>
            </Link>
            <button
              className="sidenav-toggle-btn btn border-0 p-0 active"
              id="toggle_btn2"
              onClick={handleToggleBtn2Click}
              aria-label="Toggle sidebar"
              type="button"
            >
              <i className="ti ti-arrow-bar-to-right" aria-hidden="true" />
            </button>
            {/* Search */}
            <div className="me-auto d-flex align-items-center header-search d-lg-flex d-none">
              {/* Search */}
              <div className="input-icon position-relative me-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  ref={searchInputRef}
                  data-bs-toggle="modal"
                  data-bs-target="#searchModal"
                  aria-label="Search"
                />
                <span className="input-icon-addon d-inline-flex p-0 header-search-icon">
                  <i className="ti ti-command" aria-hidden="true" />
                </span>
              </div>
              {/* /Search */}
            </div>
          </div>
          <div className="d-flex align-items-center">
            {/* Search for Mobile */}
            <div className="me-auto d-flex align-items-center header-search d-lg-none d-sm-flex d-none">
              {/* Search */}
              <div className="input-icon position-relative me-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  ref={searchInputRef}
                  data-bs-toggle="modal"
                  data-bs-target="#searchModal"
                  aria-label="Search"
                />
                <span className="input-icon-addon d-inline-flex p-0 header-search-icon">
                  <i className="ti ti-command" aria-hidden="true" />
                </span>
              </div>
              {/* /Search */}
            </div>
            {/* Minimize */}
            <div className="header-item">
              <div className="dropdown me-2">
                <Link
                  href="#"
                  className="btn topbar-link btnFullscreen"
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                >
                  <i className="ti ti-minimize" aria-hidden="true" />
                </Link>
              </div>
            </div>
            {/* Minimize */}
            {/* Language Dropdown */}
            <div className="header-item">
              <div className="dropdown me-2">
                <button
                  className="topbar-link btn"
                  data-bs-toggle="dropdown"
                  data-bs-offset="0,24"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-label={`Current language: ${currentLang.label}`}
                >
                  <ImageWithBasePath
                    src={currentLang.flag}
                    alt={currentLang.label}
                    height={16}
                  />
                </button>
                <div className="dropdown-menu dropdown-menu-end p-2">
                  {languageOptions.map((lang) => (
                    <button
                      className="dropdown-item"
                      onClick={() => handleLanguageChange(lang.code)}
                      key={lang.code}
                      type="button"
                      aria-label={`Switch to ${lang.label}`}
                    >
                      <ImageWithBasePath
                        src={lang.flag}
                        alt=""
                        className="me-1"
                        height={16}
                      />{" "}
                      <span className="align-middle">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Notification Dropdown */}
            <div className="header-item">
              <div className="dropdown me-2">
                <button
                  className="topbar-link btn topbar-link dropdown-toggle drop-arrow-none"
                  data-bs-toggle="dropdown"
                  data-bs-offset="0,24"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-label="Notifications"
                >
                  <i className="ti ti-bell-check fs-16 animate-ring" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="notification-badge" aria-label={`${unreadCount} unread notifications`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div
                  className="dropdown-menu p-0 dropdown-menu-end dropdown-menu-lg"
                  style={{ minHeight: 300 }}
                >
                  <div className="p-2 border-bottom">
                    <div className="row align-items-center">
                      <div className="col">
                        <h6 className="m-0 fs-16 fw-semibold">
                          {" "}
                          {t("header.notifications")}
                        </h6>
                      </div>
                    </div>
                  </div>
                  {/* Notification Body */}
                  <div
                    className="notification-body position-relative z-2 rounded-0"
                    data-simplebar=""
                  >
                    <OverlayScrollbarsComponent style={{ height: "280px" }}>
                      {notificationsLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="ti ti-bell-off fs-1 text-muted mb-2 d-block" />
                          <p className="text-muted mb-0">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <div
                            key={notification._id}
                            className={`dropdown-item notification-item py-3 text-wrap ${
                              index < notifications.length - 1 ? "border-bottom" : ""
                            } ${!notification.isRead ? "bg-light-subtle" : ""}`}
                            onClick={() => handleMarkAsRead(notification._id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex">
                              <div className="me-2 position-relative flex-shrink-0">
                                <div className="avatar">
                                  <span 
                                    className={`avatar-title rounded-circle bg-${
                                      notification.type === "success"
                                        ? "success"
                                        : notification.type === "error"
                                        ? "danger"
                                        : notification.type === "warning"
                                        ? "warning"
                                        : "info"
                                    }-transparent`}
                                  >
                                    <i className={`${getNotificationIcon(notification.type)} fs-20`} />
                                  </span>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <p className="mb-0 fw-medium text-dark">
                                    {notification.title}
                                  </p>
                                  {!notification.isRead && (
                                    <span className="badge bg-primary ms-2">New</span>
                                  )}
                                </div>
                                <p className="mb-1 text-wrap fs-13">
                                  {notification.message}
                                </p>
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                  <span className="fs-12 text-muted">
                                    <i className="ti ti-clock me-1" />
                                    {formatTime(notification.createdAt)}
                                  </span>
                                  {notification.sender && (
                                    <span className="fs-12 text-muted">
                                      <i className="ti ti-user me-1" />
                                      {notification.sender.firstName} {notification.sender.lastName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </OverlayScrollbarsComponent>
                  </div>
                  {/* View All*/}
                  <div className="p-2 rounded-bottom border-top text-center">
                    <Link
                      href={all_routes.notifications}
                      className="text-center text-decoration-underline fs-14 mb-0"
                    >
                      {t("header.viewAllNotifications")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Light/Dark Mode Button */}
            {!isLayoutPage() && (
              <div className="header-item d-flex me-2">
                <button
                  className={`topbar-link btn topbar-link ${
                    themeSettings["mode"] === "dark" ? "active" : ""
                  }`}
                  id="dark-mode-toggle"
                  type="button"
                  onClick={handleDarkModeClick}
                  aria-label="Switch to light mode"
                >
                  <i className="ti ti-sun fs-16" aria-hidden="true" />
                </button>
                <button
                  className={`topbar-link btn topbar-link ${
                    themeSettings["mode"] === "light" ? "active" : ""
                  }`}
                  id="light-mode-toggle"
                  type="button"
                  onClick={handleLightModeClick}
                  aria-label="Switch to dark mode"
                >
                  <i className="ti ti-moon fs-16" aria-hidden="true" />
                </button>
              </div>
            )}
            {/* User Dropdown */}
            <div className="dropdown profile-dropdown d-flex align-items-center justify-content-center">
              <button
                type="button"
                className="topbar-link btn dropdown-toggle drop-arrow-none position-relative p-0 border-0 bg-transparent"
                data-bs-toggle="dropdown"
                data-bs-offset="0,22"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="User menu"
              >
                {session?.user?.profileImage ? (
                  <ImageWithBasePath
                    src={session.user.profileImage}
                    width={32}
                    className="rounded-2 d-flex"
                    alt="User avatar"
                  />
                ) : (
                  <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: 14 }}>
                    {getUserInitials()}
                  </div>
                )}
                <span className="online text-success">
                  <i className="ti ti-circle-filled d-flex bg-white rounded-circle border border-1 border-white" aria-hidden="true" />
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-md p-2">
                <div className="d-flex align-items-center bg-light rounded-3 p-2 mb-2">
                  {session?.user?.profileImage ? (
                    <ImageWithBasePath
                      src={session.user.profileImage}
                      className="rounded-circle"
                      width={42}
                      height={42}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, fontSize: 16 }}>
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="ms-2">
                    <p className="fw-medium text-dark mb-0">{session?.user?.name || "User"}</p>
                    <span className="d-block fs-13">{getUserRoleDisplay()}</span>
                  </div>
                </div>
                {/* Item*/}
                <Link href={all_routes.generalSettings} className="dropdown-item">
                  <i className="ti ti-settings me-2 align-middle" aria-hidden="true" />
                  <span className="align-middle">Settings</span>
                </Link>
                {/* Item*/}
                <div className="pt-2 mt-2 border-top">
                  <button onClick={handleLogout} className="dropdown-item text-danger border-0 bg-transparent w-100 text-start" type="button">
                    <i className="ti ti-logout me-2 fs-17 align-middle" aria-hidden="true" />
                    <span className="align-middle">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Topbar End */}
    
    </>
  );
};

export default React.memo(Header);
