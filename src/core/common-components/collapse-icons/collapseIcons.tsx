"use client";
import Link from "next/link";
import { useEffect, useState } from "react";


const CollapseIcons = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    if (window.bootstrap) {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new window.bootstrap!.Tooltip(tooltipTriggerEl as HTMLElement);
      });
    }
  }, []);

  const handleCollapseToggle = () => {
    const body = document.body;

    if (isCollapsed) {
      body.classList.remove("header-collapse");
    } else {
      body.classList.add("header-collapse");
    }

    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
      <Link
        href="#"
        className="btn btn-icon btn-outline-light shadow"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-title="Refresh"
        aria-label="Refresh"
      >
        <i className="ti ti-refresh" />
      </Link>

      <Link
        href="#"
        id="collapse-header"
        onClick={handleCollapseToggle}
        className={`btn btn-icon btn-outline-light shadow ${
          isCollapsed === true ? "active" : ""
        }`}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-title={isCollapsed ? "Expand" : "Collapse"}
        aria-label="Collapse"
      >
        <i className="ti ti-transition-top" />
      </Link>
    </>
  );
};

export default CollapseIcons;
