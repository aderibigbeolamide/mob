"use client";

import Link from "next/link";

const CommonFooter = () => {
  return (
    <footer className="footer text-center" role="contentinfo">
      <p className="mb-0 text-dark">
        2025 ©
        <Link
          href="#"
          className="link-primary ms-1"
          aria-label="Dreams EMR website"
        >
          Dreams EMR 
        </Link>{" "}
        - All Rights Reserved.
      </p>
    </footer>
  );
};

export default CommonFooter;
