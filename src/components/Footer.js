import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      {/* Changed to container-md to limit max width to the medium breakpoint (960px) */}
      <div className="container-md">
        <div className="row text-center text-md-start">
          {/* Column 1: Company Info & Contact */}
          <div className="col-md-6 col-lg-6 col-xl-6 mx-auto mb-4">
            <h6 className="text-uppercase fw-bold mb-4">
              <i className="bi bi-shop me-3"></i>E-Commerce Store
            </h6>
            <p className="text-muted small">
              Quality products, delivered fast.
            </p>
            {/* Added small margin top to separate info slightly on small screens */}
            <p className="mt-3">
              <i className="bi bi-house-door-fill me-3"></i> New York, NY 10012,
              US
            </p>
            <p>
              <i className="bi bi-envelope-fill me-3"></i> info@example.com
            </p>
            <p>
              <i className="bi bi-phone-fill me-3"></i> + 01 234 567 88
            </p>
          </div>

          {/* Column 2: Social Media */}
          <div className="col-md-6 col-lg-6 col-xl-6 mx-auto mb-4 text-center text-md-end">
            <h6 className="text-uppercase fw-bold mb-4">Stay Connected</h6>
            {/* Social Icons */}
            <a href="#!" className="text-white me-4" aria-label="Facebook">
              <i className="bi bi-facebook fs-3"></i>
            </a>
            <a href="#!" className="text-white me-4" aria-label="Twitter">
              <i className="bi bi-twitter fs-3"></i>
            </a>
            <a href="#!" className="text-white" aria-label="Instagram">
              <i className="bi bi-instagram fs-3"></i>
            </a>
            {/* Policy link */}
            <p className="mt-4">
              <Link
                to="/policy"
                className="text-reset text-decoration-none small"
              >
                Privacy Policy | Terms of Use
              </Link>
            </p>
          </div>
        </div>

        {/* Copyright Section (Always simple) */}
        <hr className="my-3" style={{ backgroundColor: "#7e7e7e" }} />
        <div className="text-center">
          <p className="small mb-0 text-muted">
            &copy; {new Date().getFullYear()} E-Commerce Store. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
