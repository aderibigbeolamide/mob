
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { setExpandMenu, setMobileSidebar, setHiddenLayout } from "@/core/redux/sidebarSlice";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { SidebarData } from "./sidebarData";
import ImageWithBasePath from "../image-with-base-path";
import { useTranslation } from 'react-i18next';
import { all_routes } from "@/router/all_routes";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/core/redux/store";
import { updateTheme } from "@/core/redux/themeSlice";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/emr";
import Link from "next/link";

// Define SidebarMenuItem type if not already defined
interface SidebarMenuItem {
  label: string;
  link: string;
  submenu?: boolean;
  icon?: string;
  submenuItems?: SidebarMenuItem[];
  relatedRoutes?: string[];
  count?: number;
  adminOnly?: boolean;
}

const Sidebar = () => {
  const route = all_routes;
  const Location = usePathname();
  const pathname = Location;
  const [subsidebar, setSubsidebar] = useState("");
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === UserRole.ADMIN;

  // Utility: Recursively check if a menu item or any of its children is active
  const isMenuItemActive = useCallback((item: SidebarMenuItem, pathname: string): boolean => {
    if (item.link && item.link !== "#" && item.link === pathname) return true;
    if (item.relatedRoutes && item.relatedRoutes.includes(pathname)) return true;
    if (item.submenuItems && item.submenuItems.length > 0) {
      return item.submenuItems.some((child) => isMenuItemActive(child, pathname));
    }
    return false;
  }, []);

  // On mount or pathname change, auto-open submenus with an active link
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    (SidebarData as { submenuItems: SidebarMenuItem[] }[]).forEach((mainLabel) => {
      mainLabel.submenuItems?.forEach((title: SidebarMenuItem) => {
        if (isMenuItemActive(title, pathname)) {
          newOpenMenus[title.label] = true;
        }
      });
    });
    setOpenMenus(newOpenMenus); // <-- Reset instead of merging
  }, [pathname, isMenuItemActive]);

  // Memoize handler functions
  const handleMenuToggle = useCallback((label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const toggleSubsidebar = useCallback((subitem: any) => {
    setSubsidebar((prev) => (subitem === prev ? "" : subitem));
  }, []);

  const handleClick = useCallback((label: any) => {
    handleMenuToggle(label);
  }, [handleMenuToggle]);

  const navigate = useRouter();
  const themeSettings = useAppSelector((state) => state.theme.themeSettings);

  const handleMiniSidebar = useCallback(() => {
    if (themeSettings["data-layout"] === "hidden") {
      dispatch(setHiddenLayout(false));
      return;
    }
    
    const isMini = themeSettings["data-layout"] === "mini";
    const updatedLayout = isMini ? "default" : "mini";
    
    dispatch(
      updateTheme({
        "data-layout": updatedLayout,
      })
    );
  }, [dispatch, themeSettings["data-layout"]]);

  const onMouseEnter = useCallback(() => {
    dispatch(setExpandMenu(true));
  }, [dispatch]);

  const onMouseLeave = useCallback(() => {
    dispatch(setExpandMenu(false));
  }, [dispatch]);

  const handleLayoutClick = useCallback((layout: string) => {
    const layoutSettings: any = {
      "data-layout": "default",
      dir: "ltr",
    };
    switch (layout) {
      case "Default":
        layoutSettings["data-layout"] = "default";
        break;
      case "Hidden":
        layoutSettings["data-layout"] = "hidden";
        dispatch(setHiddenLayout(true));
        break;
      case "Mini":
        layoutSettings["data-layout"] = "mini";
        break;
      case "Hover View":
        layoutSettings["data-layout"] = "hoverview";
        break;
      case "Full Width":
        layoutSettings["data-layout"] = "full-width";
        break;
      case "Dark":
        layoutSettings["data-bs-theme"] = "dark";
        break;
      case "RTL":
        layoutSettings.dir = "rtl";
        break;
      default:
        break;
    }
    dispatch(updateTheme(layoutSettings));
    navigate.push("/dashboard");
  }, [dispatch, navigate]);

  const mobileSidebar = useAppSelector((state) => state.sidebarSlice.mobileSidebar);
  const toggleMobileSidebar = useCallback(() => {
    dispatch(setMobileSidebar(!mobileSidebar));
  }, [dispatch, mobileSidebar]);
  useEffect(() => {
    const rootElement: any = document.documentElement;
    Object.entries(themeSettings).forEach(([key, value]) => {
      rootElement.setAttribute(key, value);
    });
  }, [
    themeSettings["data-bs-theme"],
    themeSettings["dir"],
    themeSettings["data-layout"],
    themeSettings["data-sidebar"],
    themeSettings["data-color"],
    themeSettings["data-topbar"],
    themeSettings["data-size"],
    themeSettings["data-width"],
    themeSettings["data-sidebarbg"]
  ]);

  return (
    <>
      {/* Sidenav Menu Start */}
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}

        tabIndex={-1}
      >
        {/* Start Logo */}
        <div className="sidebar-logo">
          <div>
            {/* Logo Normal */}
            <Link href={route.dashboard} className="logo logo-normal">
              <ImageWithBasePath src="life-point-logo.png" alt="Life Point Medical Centre" width={150} height={50} />
            </Link>
            {/* Logo Small */}
            <Link href={route.dashboard} className="logo-small">
              <ImageWithBasePath src="life-point-logo.png" alt="Life Point Medical Centre" width={40} height={40} />
            </Link>
            {/* Logo Dark */}
            <Link href={route.dashboard} className="dark-logo">
              <ImageWithBasePath src="life-point-logo.png" alt="Life Point Medical Centre" width={150} height={50} />
            </Link>
          </div>
          <button
            className="sidenav-toggle-btn btn border-0 p-0 active"
            id="toggle_btn"
            onClick={handleMiniSidebar}
            type="button"
          >
            <i className="ti ti-arrow-bar-to-left" />
          </button>
          {/* Sidebar Menu Close */}
          <button className="sidebar-close" onClick={toggleMobileSidebar} type="button">
            <i className="ti ti-x align-middle" />
          </button>
        </div>
        {/* End Logo */}
        {/* Sidenav Menu */}

        <div className="sidebar-inner" data-simplebar="">
          <OverlayScrollbarsComponent style={{ height: "100%", width: "100%" }}>
            <div id="sidebar-menu" className="sidebar-menu">
                             <ul>
                {SidebarData?.map((mainLabel, index) => (
                  <React.Fragment key={`main-${index}`}>
                                         <li className="menu-title">
                      <span>{t(`sidebarTitles.${mainLabel?.tittle}`)}</span>
                    </li>
                    {(mainLabel?.submenuItems as SidebarMenuItem[])?.filter(title => !title.adminOnly || isAdmin)?.map((title, i) => {
                      const isActive = isMenuItemActive(title, Location);
                      const isMenuOpen = openMenus[title.label] || false;
                      return (
                                                 <li className="submenu" key={`title-${i}`}>
                          <Link
                            href={title?.submenu ? "#" : title?.link}
                            onClick={() => {
                              handleClick(title?.label);
                              if (mainLabel?.tittle === "Layout") {
                                handleLayoutClick(title?.label);
                              }
                            }}
                            className={`${isActive ? "active" : ""} ${isMenuOpen ? "subdrop" : ""}`}
                            tabIndex={0}
                          >
                            <i className={`ti ti-${title.icon}`}></i>
                            <span>{t(`sidebar.${title?.label}`)}</span>
                            {title.label === "Changelog" && (
                              <span className="badge badge-sm bg-success" style={{ marginLeft: 8 }}>v1.0</span>
                            )}
                            {title?.count && (
                              <span className="count">{title.count}</span>
                            )}
                            {title?.submenu && (
                              <span className="menu-arrow"></span>
                            )}
                          </Link>
                          {title?.submenu && (
                                                         <ul
                               style={{
                                 display: isMenuOpen ? "block" : "none",
                               }}
                             >
                              {(title?.submenuItems as SidebarMenuItem[])?.map((item, j) => {
                                const isSubActive = isMenuItemActive(item, Location);
                                
                                return (
                                                                     <li
                                     className={`${item?.submenuItems ? "submenu submenu-two" : ""} `}
                                     key={`item-${j}`}
                                   >
                                    <Link
                                      href={item?.submenu ? "#" : item?.link}
                                      className={`${isSubActive ? "active subdrop" : ""} ${subsidebar === item?.label ? "subdrop" : ""}`}
                                      onClick={() => {
                                        toggleSubsidebar(item?.label);
                                        if (title?.label === "Layouts") {
                                          handleLayoutClick(item?.label);
                                        }
                                      }}
                                      tabIndex={0}
                                    >
                                      {t(`sidebar.${item?.label}`)}
                                      {item?.submenu && (
                                        <span className="menu-arrow custome-menu"></span>
                                      )}
                                    </Link>
                                    {item?.submenuItems && (
                                                                             <ul
                                         style={{
                                           display: subsidebar === item?.label ? "block" : "none",
                                         }}
                                       >
                                        {(item?.submenuItems as SidebarMenuItem[])?.map((items, k) => {
                                          const isSubSubActive = isMenuItemActive(items, Location);
                                          return (
                                                                                         <li key={`submenu-item-${k}`}>
                                              <Link
                                                href={items?.submenu ? "#" : items?.link}
                                                className={`${isSubSubActive ? "active" : ""}`}
                                                tabIndex={0}
                                              >
                                                {t(`sidebar.${items?.label}`)}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      {/* Sidenav Menu End */}
    </>
  );
};

export default React.memo(Sidebar);
