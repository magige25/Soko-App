import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useAuth } from "../context/AuthContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

const MasterLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRefs = useRef([]);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { signOut } = useAuth();

  const sidebarControl = () => {
    setSidebarActive((prev) => !prev);
  };

  const mobileMenuControl = () => {
    setMobileMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        if (!event.target.closest(".sidebar-mobile-toggle")) {
          setMobileMenu(false);
        }
      }
    };

    if (mobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenu]);

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

  // Function to check if a submenu item is active
  const isSubmenuActive = (paths) => {
    return paths.some((path) => location.pathname === path);
  };

  // Define submenu paths for each dropdown
  const submenuPaths = {
    systemUsers: ["/users"],
    customerManagement: ["/customers", "/creditors-request"],
    orderManagement: ["/pending-orders", "/pending-deliveries", "/settled-orders"],
    salespersonOperation: ["/salespersons", "/targets"],
    paymentManagement: ["/payments", "/creditors-payment"],
    regions: ["/regions", "/sub-regions", "/routes"],
    productCatalogue: ["/category", "/sub-category", "/brands", "/products"],
    farmerManagement: ["/suppliers", "/deliveries", "/pending-bills", "/settled-bills", "/supply-residence"],
    invoices: ["/invoice-register", "/pending-invoices", "settled-invoices"],
    deportManagement: ["/deports"],
    warehouseManagement: ["/warehouses"],
    stockManagement: ["/stock", "/reconciled"],
    storageFacility: ["/storage-facility", "/batch", "/drawing"],
    authentication: ["/sign-in", "/forgot-password", "/reset-password"],
    roles: ["/roles-list"],
    settings: ["/customer-type", "/pricing-categories", "/currencies", "/units-of-measure", "/countries"],
    invoice: ["/invoice-list", "/invoice-preview", "/invoice-add", "/invoice-edit"],
    components: [
      "/typography", "/colors", "/button", "/dropdown", "/alert", "/card", "/carousel", "/avatar",
      "/progress", "/tabs", "/pagination", "/badges", "/tooltip", "/videos", "/star-rating", "/tags",
      "/list", "/calendar", "/radio", "/switch", "/image-upload"
    ],
    forms: ["/form", "/form-layout", "/form-validation", "/wizard"],
    table: ["/table-basic", "/table-data"],
    chart: ["/line-chart", "/column-chart", "/pie-chart"],
  };

  return (
    <div className="app-wrapper">
      <section className={mobileMenu ? "overlay active" : "overlay"}>
        <aside
          ref={sidebarRef}
          className={
            sidebarActive
              ? "sidebar active"
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
                  <HomeOutlinedIcon className="menu-icon" />
                  <span>Dashboards</span>
                </NavLink>
              </li>
              {/* System Users */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.systemUsers) ? "submenu-active" : ""}`}>
                <Link to="#">
                <GroupAddOutlinedIcon className="menu-icon" />
                  <span>System Users</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/users"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Users
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Customer Management */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.customerManagement) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:user-line" className="menu-icon" />
                  <span>Customer Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/customers"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Customers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/creditors-request"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Creditors Request
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Orders */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.orderManagement) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:shopping-cart-line" className="menu-icon" />
                  <span>Order Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/pending-orders"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Pending Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pending-deliveries"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Pending Deliveries
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settled-orders"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Settled Orders
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Salespersons */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.salespersonOperation) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:group-line" className="menu-icon" />
                  <span>Salesperson Operation</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/salespersons"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Salespersons
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/targets"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Targets
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Payment */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.paymentManagement) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:wallet-line" className="menu-icon" />
                  <span>Payment Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/payments"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Payments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/creditors-payment"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Creditors Payment
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Regions */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.regions) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:map-pin-line" className="menu-icon" />
                  <span>Regions</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/regions"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Regions
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sub-regions"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Sub Regions
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/routes"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Routes
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Product Catalogue */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.productCatalogue) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:archive-2-line" className="menu-icon" />
                  <span>Product Catalogue</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/category"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Category
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/sub-category"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Sub Category
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/brands"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Brands
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/products"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Products
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Farmer Management */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.farmerManagement) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:clipboard-line" className="menu-icon" />
                  <span>Farmer Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/suppliers"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Suppliers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/deliveries"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Deliveries
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/supply-residence"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Farmer Residence
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Invoices */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.invoices) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                  <span>Invoices</span>
                </Link>
                <ul className="sidebar-submenu">
                <li>
                    <NavLink
                      to="/invoice-register"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Invoice Register
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pending-invoices"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Pending Invoices
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settled-invoices"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Settled Invoices
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Deport Management */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.deportManagement) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:store-3-line" className="menu-icon" />
                  <span>Deport Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/deports"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Deports
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Stock Management */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.stockManagement) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:equalizer-line" className="menu-icon" />
                  <span>Stock Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/stock"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Stock
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/reconciled"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Reconciled Stock
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Storage Facility */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.storageFacility) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri-store-line" className="menu-icon" />
                  <span>Storage Facility</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/storage-facility"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Storage Facility
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/batch"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Batch
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/drawing"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Drawing
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Authentication */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.authentication) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:shield-user-line" className="menu-icon" />
                  <span>Authentication</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/sign-in"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Sign In
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/forgot-password"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Forgot Password
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/reset-password"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Reset Password
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Roles */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.roles) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="ri:user-settings-line" className="menu-icon" />
                  <span>Roles</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/roles-list"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Roles
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Settings */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.settings) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="icon-park-outline:setting-two" className="menu-icon" />
                  <span>Settings</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/customer-type"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Customer Type
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pricing-categories"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Pricing Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/currencies"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Currencies
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/units-of-measure"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Units of Measure
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/countries"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Countries
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
              {/* Invoice */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.invoice) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                  <span>Invoice</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/invoice-list"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/invoice-preview"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Preview
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/invoice-add"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Add new
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/invoice-edit"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Edit
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="sidebar-menu-group-title">UI Elements</li>
              {/* Components */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.components) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="solar:document-text-outline" className="menu-icon" />
                  <span>Components</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/typography"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Typography
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/colors"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Colors
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/button"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Button
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dropdown"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Dropdown
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/alert"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Alerts
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/card"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Card
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/carousel"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Carousel
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/avatar"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Avatars
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/progress"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Progress bar
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tabs"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Tab & Accordion
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pagination"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Pagination
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/badges"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Badges
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tooltip"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Tooltip & Popover
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/videos"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Videos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/star-rating"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Star Ratings
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/tags"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Tags
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/list"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      List
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/calendar"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Calendar
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/radio"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Radio
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/switch"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Switch
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/image-upload"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Upload
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Forms */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.forms) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="heroicons:document" className="menu-icon" />
                  <span>Forms</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/form"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Input Forms
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/form-layout"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Input Layout
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/form-validation"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Form Validation
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/wizard"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Form Wizard
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Table */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.table) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="mingcute:storage-line" className="menu-icon" />
                  <span>Table</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/table-basic"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Basic Table
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/table-data"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Data Table
                    </NavLink>
                  </li>
                </ul>
              </li>
              {/* Chart */}
              <li className={`dropdown ${isSubmenuActive(submenuPaths.chart) ? "submenu-active" : ""}`}>
                <Link to="#">
                  <Icon icon="solar:pie-chart-outline" className="menu-icon" />
                  <span>Chart</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/line-chart"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Line Chart
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/column-chart"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Column Chart
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pie-chart"
                      className={(navData) => (navData.isActive ? "active-page" : "")}
                    >
                      Pie Chart
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink
                  to="/testimonials"
                  className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon="mage:message-question-mark-round" className="menu-icon" />
                  <span>Testimonials</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faq"
                  className={(navData) => (navData.isActive ? "active-page" : "")}
                >
                  <Icon icon="mage:message-question-mark-round" className="menu-icon" />
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
                  <Icon icon="ri:checkbox-multiple-blank-line" className="menu-icon" />
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
                        icon="heroicons:bars-3-solid"
                        className="icon text-2xl non-active"
                      />
                    ) : (
                      <Icon
                        icon="heroicons:bars-3-solid"
                        className="icon text-2xl non-active"
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
                  <div className="dropdown">
                    <button
                      className="position-relative border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <Icon
                        icon="mage:email"
                        className="text-primary-light text-xl"
                      />
                    </button>
                    <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                      <div className="m-16 py-12 px-16 radius-4 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
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
                                Jeniffer Lopez
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
                      className="position-relative border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <Icon
                        icon="iconoir:bell"
                        className="text-primary-light text-xl"
                      />
                    </button>
                    <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                      <div className="m-16 py-12 px-16 radius-4 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
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
                      className="user-image d-flex justify-content-center align-items-center rounded-circle position-relative gap-2"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src="/assets/images/user-img.png"
                        alt="image_user"
                        className="object-fit-cover rounded-circle"
                      />
                      <span className="position-absolute bottom-0 end-0 bg-success-main w-8-px h-8-px rounded-circle"></span>
                    </button>
                    <div className="dropdown-menu to-top dropdown-menu-sm">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src="/assets/images/user-img.png"
                          alt="image_user"
                          className="profile-image object-fit-cover rounded-circle"
                        />
                        <div className="headers bg-primary-50">
                          <h6 className="text-sm text-primary-light fw-semibold mb-2">
                            Tigersoft Developers
                          </h6>
                          <span className="text-secondary-light fw-sm text-sm mb-6">
                            tigersoft@gmail.com
                          </span>
                        </div>
                      </div>
                      <ul className="to-top-list">
                        <li>
                          <Link
                            className="dropdown-item text-black px-0 py-8 hover-text-primary d-flex align-items-center gap-3"
                            to="/view-profile"
                          >
                            <Icon
                              icon="ri-account-circle-line"
                              className="icon text-md"
                            />{" "}
                            My Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-black px-0 py-8 hover-text-primary d-flex align-items-center gap-3"
                            to="/email"
                          >
                            <Icon
                              icon="tabler:message-check"
                              className="icon text-md"
                            />{" "}
                            Inbox
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-black px-0 py-8 hover-text-primary d-flex align-items-center gap-3"
                            to="/company"
                          >
                            <Icon
                              icon="icon-park-outline:setting-two"
                              className="icon text-md"
                            />
                            Setting
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-black px-0 py-8 hover-text-danger d-flex align-items-center gap-3 w-100 mt-32"
                            onClick={signOut}
                          >
                            <Icon icon="lucide:power" className="icon text-md" />{" "}
                            Sign Out
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
    </div>
  );
};

export default MasterLayout;