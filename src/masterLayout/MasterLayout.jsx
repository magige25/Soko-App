import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import "../styles/masterlayout.css";
import { useAuth } from "../context/AuthContext";

const MasterLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRefs = useRef([]);
  const sidebarRef = useRef(null); // Ref for the sidebar element
  const location = useLocation();
  const { signOut } = useAuth();

  const sidebarControl = () => {
    setSidebarActive((prev) => !prev);
  };

  const mobileMenuControl = () => {
    setMobileMenu((prev) => !prev);
  };

  // New: Handle clicks outside the sidebar to close it in mobile view
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the sidebar is open and the click is outside the sidebar
      if (
        mobileMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        // Ignore clicks on the sidebar toggle button to prevent immediate reopening
        if (!event.target.closest(".sidebar-mobile-toggle")) {
          setMobileMenu(false);
        }
      }
    };

    // Add event listener when the sidebar is open
    if (mobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener when the sidebar closes or component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenu]); // Re-run when mobileMenu changes

  useEffect(() => {
    const handleDropdownClick = (index) => (event) => {
      event.preventDefault();
      dropdownRefs.current.forEach((dropdown, i) => {
        if (dropdown) {
          if (i === index) {
            const isActive = dropdown.classList.contains("open");
            dropdown.classList.toggle("open", !isActive);
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = isActive ? "0px" : `${submenu.scrollHeight}px`;
            }
          } else {
            dropdown.classList.remove("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = "0px";
            }
          }
        }
      });
    };

    const handleSubmenuItemClick = (link) => {
      link.classList.add("submenu-clicked");
      setTimeout(() => {
        link.classList.remove("submenu-clicked");
        dropdownRefs.current.forEach((dropdown) => {
          dropdown.classList.remove("open");
          const submenu = dropdown.querySelector(".sidebar-submenu");
          if (submenu) {
            submenu.style.maxHeight = "0px";
          }
        });
      }, 300);
    };

    dropdownRefs.current = Array.from(document.querySelectorAll(".sidebar-menu .dropdown"));

    dropdownRefs.current.forEach((dropdown, index) => {
      const trigger = dropdown.querySelector("a");
      if (trigger) {
        trigger.removeEventListener("click", handleDropdownClick(index));
        trigger.addEventListener("click", handleDropdownClick(index));
      }
      const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
      submenuLinks.forEach((link) => {
        link.removeEventListener("click", () => handleSubmenuItemClick(link));
        link.addEventListener("click", () => handleSubmenuItemClick(link));
      });
    });

    const highlightActiveMainMenu = () => {
      dropdownRefs.current.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        let isActive = false;
        submenuLinks.forEach((link) => {
          const path = link.getAttribute("to") || link.getAttribute("href");
          if (path === location.pathname) {
            isActive = true;
          }
        });
        if (isActive) {
          dropdown.classList.add("active-main");
        } else {
          dropdown.classList.remove("active-main");
        }
      });
    };

    highlightActiveMainMenu();

    return () => {
      dropdownRefs.current.forEach((dropdown, index) => {
        const trigger = dropdown.querySelector("a");
        if (trigger) {
          trigger.removeEventListener("click", handleDropdownClick(index));
        }
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          link.removeEventListener("click", () => handleSubmenuItemClick(link));
        });
      });
    };
  }, [location.pathname]);

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* Attach ref to the sidebar for click detection */}
      <aside
        ref={sidebarRef}
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/dashboard" className="sidebar-logo">
            <img
              src="/assets/images/logo.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="/assets/images/logo-light.png"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="/assets/images/logo-icon.png"
              alt="site logo"
              className="logo-icon"
            />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li>
              <NavLink
                to="/dashboard"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="ri-home-5-line" className="menu-icon" />
                <span>Dashboards</span>
              </NavLink>
            </li>
            <li className="sidebar-menu-group-title">Under Development</li>
            {/* System Users */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="flowbite:users-group-outline"
                  className="menu-icon"
                />
                <span>System Users</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/users"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Users
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Customer Management */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:user-line" className="menu-icon" />
                <span>Customer Management</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/customers"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Customers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/creditors-request"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Creditors Request
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Orders */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:shopping-cart-line" className="menu-icon" />
                <span>Order Management</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/pending-orders"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Pending Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pending-deliveries"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Pending Deliveries
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settled-orders"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Settled Orders
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Salespersons */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:group-line" className="menu-icon" />
                <span>Salesperson Operation</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/salespersons"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Salespersons
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Payment */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:wallet-line" className="menu-icon" />
                <span>Payment Management</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/payments"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Payments
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/creditors-payment"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Creditors Payment
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Regions Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:map-pin-line" className="menu-icon" />
                <span>Regions</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/regions"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Regions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sub-regions"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Sub Regions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/routes"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Routes
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Product Catalogue */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:archive-2-line" className="menu-icon" />
                <span>Product Catalogue</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/category"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Category
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sub-category"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Sub Category
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/brands"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Brands
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/products"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Products
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Supplier Management */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:clipboard-line" className="menu-icon" />
                <span>Supplier Management</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/suppliers"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Suppliers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/deliveries'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Deliveries
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/pending-supplies'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Pending Supplies
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/unpaid-supplies"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Unpaid Supplies
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/settled-bills'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Settled Bills
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to='/supply-residence'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Supply Residence
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Warehouse Management */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:store-3-line" className="menu-icon" />
                <span>Warehouse Management</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/warehouses"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Warehouses
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Stock Reconciliation */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:equalizer-line" className="menu-icon" />
                <span>Stock Reconciliation</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/reconciled"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Reconciled Stock
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Authentication Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:shield-user-line" className="menu-icon" />
                <span>Authentication</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/sign-in"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Sign In
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/forgot-password"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Forgot Password
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/reset-password"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Reset Password
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Roles */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:user-settings-line" className="menu-icon" />
                <span>Roles</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/roles-list"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Roles
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Settings Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="icon-park-outline:setting-two"
                  className="menu-icon"
                />
                <span>Settings</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/company"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Company
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/notification"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Notification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/notification-alert"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Notification Alert
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/theme"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Theme
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/customer-type"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Customer Type
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pricing-categories"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Pricing Categories
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/currencies"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Currencies
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/units-of-measure"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Units of Measure
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/countries"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Countries
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/language"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Languages
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/payment-gateway"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Payment Gateway
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-group-title">Application</li>
            <li>
              <NavLink
                to="/email"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="mage:email" className="menu-icon" />
                <span>Email</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/chat-message"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="bi:chat-dots" className="menu-icon" />
                <span>Chat</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calendar-main"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="solar:calendar-outline" className="menu-icon" />
                <span>Calendar</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/kanban"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon="material-symbols:map-outline"
                  className="menu-icon"
                />
                <span>Kanban</span>
              </NavLink>
            </li>
            {/* Invoice Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                <span>Invoice</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/invoice-list"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/invoice-preview"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Preview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/invoice-add"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Add new
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/invoice-edit"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Edit
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Ai Application Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:robot-2-line" className="menu-icon" />
                <span>Ai Application</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/text-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Text Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/code-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Code Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/image-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Image Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/voice-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Voice Generator
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/video-generator"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Video Generator
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Crypto Currency Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:btc-line" className="menu-icon" />
                <span>Crypto Currency</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/wallet"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Wallet
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/marketplace"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Marketplace
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/marketplace-details"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Marketplace Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/portfolio"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Portfolios
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-group-title">UI Elements</li>
            {/* Components Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="solar:document-text-outline"
                  className="menu-icon"
                />
                <span>Components</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/typography"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Typography
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/colors"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Colors
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/button"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dropdown"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Dropdown
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/alert"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Alerts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/card"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Card
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/carousel"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Carousel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/avatar"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Avatars
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/progress"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Progress bar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tabs"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Tab & Accordion
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pagination"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Pagination
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/badges"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Badges
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tooltip"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Tooltip & Popover
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/videos"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Videos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/star-rating"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Star Ratings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tags"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Tags
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/list"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    List
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/calendar"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Calendar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/radio"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Radio
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/switch"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Switch
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/image-upload"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Upload
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Forms Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="heroicons:document" className="menu-icon" />
                <span>Forms</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/form"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Input Forms
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/form-layout"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Input Layout
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/form-validation"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Form Validation
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wizard"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Form Wizard
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Table Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="mingcute:storage-line" className="menu-icon" />
                <span>Table</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/table-basic"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Basic Table
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/table-data"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Data Table
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Chart Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="solar:pie-chart-outline" className="menu-icon" />
                <span>Chart</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/line-chart"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Line Chart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/column-chart"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Column Chart
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pie-chart"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Pie Chart
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink
                to="/widgets"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="fe:vector" className="menu-icon" />
                <span>Widgets</span>
              </NavLink>
            </li>
            {/* Role & Access Dropdown */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="ri:user-settings-line" className="menu-icon" />
                <span>Role & Access</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/role-access"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Role & Access
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assign-role"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Assign Role
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="sidebar-menu-group-title">Application</li>
            {/* Gallery */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="flowbite:users-group-outline"
                  className="menu-icon"
                />
                <span>Gallery</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/gallery-grid"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Gallery Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/gallery"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Gallery Grid Desc
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/gallery-masonry"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Gallery Grid
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/gallery-hover"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Gallery Hover Effect
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink
                to="/pricing"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon="hugeicons:money-send-square"
                  className="menu-icon"
                />
                <span>Pricing</span>
              </NavLink>
            </li>
            {/* Blog */}
            <li className="dropdown">
              <Link to="#">
                <Icon
                  icon="flowbite:users-group-outline"
                  className="menu-icon"
                />
                <span>Blog</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/blog"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blog-details"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Blog Details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/add-blog"
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    Add Blog
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink
                to="/testimonials"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon="mage:message-question-mark-round"
                  className="menu-icon"
                />
                <span>Testimonials</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon="mage:message-question-mark-round"
                  className="menu-icon"
                />
                <span>FAQs.</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/error"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="streamline:straight-face" className="menu-icon" />
                <span>404</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terms-condition"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="octicon:info-24" className="menu-icon" />
                <span>Terms & Conditions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/coming-soon"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="ri:rocket-line" className="menu-icon" />
                <span>Coming Soon</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/access-denied"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="ri:folder-lock-line" className="menu-icon" />
                <span>Access Denied</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/maintenance"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon="ri:hammer-line" className="menu-icon" />
                <span>Maintenance</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blank-page"
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon
                  icon="ri:checkbox-multiple-blank-line"
                  className="menu-icon"
                />
                <span>Blank Page</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <ThemeToggleButton />
                <div className="dropdown d-none d-sm-inline-block">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="/assets/images/lang-flag.png"
                      alt="Wowdash"
                      className="w-24 h-24 object-fit-cover rounded-circle"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Choose Your Language
                        </h6>
                      </div>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-8">
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="english"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag1.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              English
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="english"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="japan"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag2.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              Japan
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="japan"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="france"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag3.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              France
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="france"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="germany"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag4.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              Germany
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="germany"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="korea"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag5.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              South Korea
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="korea"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="bangladesh"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag6.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              Bangladesh
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="bangladesh"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between mb-16">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="india"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag7.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              India
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="india"
                        />
                      </div>
                      <div className="form-check style-check d-flex align-items-center justify-content-between">
                        <label
                          className="form-check-label line-height-1 fw-medium text-secondary-light"
                          htmlFor="canada"
                        >
                          <span className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                            <img
                              src="/assets/images/flags/flag8.png"
                              alt=""
                              className="w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0"
                            />
                            <span className="text-md fw-semibold mb-0">
                              Canada
                            </span>
                          </span>
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="crypto"
                          id="canada"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="mage:email"
                      className="text-primary-light text-xl"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                    <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Message
                        </h6>
                      </div>
                      <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                        05
                      </span>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-40-px h-40-px rounded-circle flex-shrink-0 position-relative">
                            <img
                              src="/assets/images/notification/profile-3.png"
                              alt=""
                            />
                            <span className="w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Kathryn Murphy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-100-px">
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-sm text-secondary-light flex-shrink-0">
                            12:30 PM
                          </span>
                          <span className="mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle">
                            8
                          </span>
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-40-px h-40-px rounded-circle flex-shrink-0 position-relative">
                            <img
                              src="/assets/images/notification/profile-4.png"
                              alt=""
                            />
                            <span className="w-8-px h-8-px bg-neutral-300 rounded-circle position-absolute end-0 bottom-0" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Kathryn Murphy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-100-px">
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-sm text-secondary-light flex-shrink-0">
                            12:30 PM
                          </span>
                          <span className="mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle">
                            2
                          </span>
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-40-px h-40-px rounded-circle flex-shrink-0 position-relative">
                            <img
                              src="/assets/images/notification/profile-5.png"
                              alt=""
                            />
                            <span className="w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Kathryn Murphy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-100-px">
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-sm text-secondary-light flex-shrink-0">
                            12:30 PM
                          </span>
                          <span className="mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle">
                            0
                          </span>
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-40-px h-40-px rounded-circle flex-shrink-0 position-relative">
                            <img
                              src="/assets/images/notification/profile-6.png"
                              alt=""
                            />
                            <span className="w-8-px h-8-px bg-neutral-300 rounded-circle position-absolute end-0 bottom-0" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Kathryn Murphy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-100-px">
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-sm text-secondary-light flex-shrink-0">
                            12:30 PM
                          </span>
                          <span className="mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle">
                            0
                          </span>
                        </div>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-40-px h-40-px rounded-circle flex-shrink-0 position-relative">
                            <img
                              src="/assets/images/notification/profile-7.png"
                              alt=""
                            />
                            <span className="w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0" />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Kathryn Murphy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-100-px">
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <span className="text-sm text-secondary-light flex-shrink-0">
                            12:30 PM
                          </span>
                          <span className="mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle">
                            8
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="text-center py-12 px-16">
                      <Link
                        to="#"
                        className="text-primary-600 fw-semibold text-md"
                      >
                        See All Message
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="iconoir:bell"
                      className="text-primary-light text-xl"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                    <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Notifications
                        </h6>
                      </div>
                      <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                        05
                      </span>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <Icon
                              icon="bitcoin-icons:verify-outline"
                              className="icon text-xxl"
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Congratulations
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <img
                              src="/assets/images/notification/profile-1.png"
                              alt=""
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Ronald Richards
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              You can stitch between artboards
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            AM
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Arlene McCoy
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <img
                              src="/assets/images/notification/profile-2.png"
                              alt=""
                            />
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Annette Black
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to="#"
                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                      >
                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                          <span className="w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            DR
                          </span>
                          <div>
                            <h6 className="text-md fw-semibold mb-4">
                              Darlene Robertson
                            </h6>
                            <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-light flex-shrink-0">
                          23 Mins ago
                        </span>
                      </Link>
                    </div>
                    <div className="text-center py-12 px-16">
                      <Link
                        to="#"
                        className="text-primary-600 fw-semibold text-md"
                      >
                        See All Notification
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="/assets/images/user.png"
                      alt="image_user"
                      className="w-40-px h-40-px object-fit-cover rounded-circle"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                          Tiger Soft Developers
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm">
                          Super Admin
                        </span>
                      </div>
                      <button type="button" className="hover-text-danger">
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/view-profile"
                        >
                          <Icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/email"
                        >
                          <Icon
                            icon="tabler:message-check"
                            className="icon text-xl"
                          />{" "}
                          Inbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          to="/company"
                        >
                          <Icon
                            icon="icon-park-outline:setting-two"
                            className="icon text-xl"
                          />
                          Setting
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 w-100"
                          onClick={signOut}
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />{" "}
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-main-body">
          {children || (
            <div className="card shadow-sm mt-3 full-width-card" style={{ width: "100%" }}>
              <div className="card-body">
                <p>No content available. Please check the URL or refresh.</p>
              </div>
            </div>
          )}
        </div>
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0" style={{ fontSize: "13px" }}>
                © 2025 Bizchain System. All Rights Reserved.
              </p>
            </div>
            <div className="col-auto">
              <p className="mb-0" style={{ fontSize: "13px" }}>
                Made by <span className="text-primary-600">tigersoft-team</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;