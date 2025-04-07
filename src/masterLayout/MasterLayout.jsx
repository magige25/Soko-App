import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useAuth } from "../context/AuthContext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Spinner } from "../hook/spinner-utils";

const MasterLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRefs = useRef([]);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { signOut, user, loading } = useAuth();
  const unreadMessages = 3;

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

    dropdownRefs.current = Array.from(
      document.querySelectorAll(".sidebar-menu .dropdown")
    );

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

  useEffect(() => {
    if (sidebarRef.current) {
      const activeElement = sidebarRef.current.querySelector(".active-page");
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        const activeDropdown =
          sidebarRef.current.querySelector(".submenu-active");
        if (activeDropdown) {
          activeDropdown.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [location.pathname]);

  const isSubmenuActive = (paths, childRoutes = []) => {
    const allPaths = [...paths, ...childRoutes];
    return allPaths.some((path) => location.pathname.startsWith(path));
  };

  const submenuPaths = {
    systemUsers: {
      paths: ["/users"],
      childRoutes: ["/users/add", "/users/edit"],
    },
    customerManagement: {
      paths: ["/customers", "/creditors-request"],
      childRoutes: [],
    },
    orderManagement: {
      paths: ["/orders", "/pending-deliveries", "/settled-orders"],
      childRoutes: [],
    },
    salespersonOperation: {
      paths: ["/salespersons", "/targets"],
      childRoutes: [],
    },
    paymentManagement: {
      paths: ["/payments", "/creditors-payment"],
      childRoutes: [],
    },
    regions: {
      paths: ["/regions", "/sub-regions", "/routes"],
      childRoutes: [],
    },
    productCatalogue: {
      paths: ["/category", "/sub-category", "/brands", "/products"],
      childRoutes: [],
    },
    farmerManagement: {
      paths: [
        "/suppliers",
        "/deliveries",
        "/pending-bills",
        "/settled-bills",
        "/supply-residence",
      ],
      childRoutes: [],
    },
    invoices: {
      paths: ["/invoice-register", "/pending-invoices", "/settled-invoices"],
      childRoutes: ["/settled-invoices/invoice"],
    },
    depotManagement: {
      paths: ["/depot", "/stock-request", "/approved-stock", "/delivered-order"],
      childRoutes: [],
    },
    stockManagement: {
      paths: ["/stock", "/depot-reconciliation", "/salesperson-reconciliation"],
      childRoutes: [],
    },
    storageFacility: {
      paths: ["/storage-facility", "/batch", "/drawing"],
      childRoutes: [],
    },
    authentication: {
      paths: ["/sign-in", "/forgot-password", "/reset-password"],
      childRoutes: [],
    },
    roles: {
      paths: ["/roles-list"],
      childRoutes: [],
    },
    settings: {
      paths: [
        "/customer-type",
        "/customer-category",
        "/customer-pricing",
        "/pricing-categories",
        "/currencies",
        "/units-of-measure",
        "/countries",
      ],
      childRoutes: [],
    },
    invoice: {
      paths: ["/invoice-list", "/invoice-preview", "/invoice-add", "/invoice-edit"],
      childRoutes: [],
    },
    chart: {
      paths: ["/line-chart", "/column-chart", "/pie-chart"],
      childRoutes: [],
    },
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
                  className={(navData) =>
                    navData.isActive ? "active-page" : ""
                  }
                >
                  <HomeOutlinedIcon className="menu-icon" />
                  <span>Dashboards</span>
                </NavLink>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.systemUsers.paths,
                    submenuPaths.systemUsers.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <GroupAddOutlinedIcon className="menu-icon" />
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.customerManagement.paths,
                    submenuPaths.customerManagement.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.orderManagement.paths,
                    submenuPaths.orderManagement.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <Icon icon="ri:shopping-cart-line" className="menu-icon" />
                  <span>Order Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/orders"
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.salespersonOperation.paths,
                    submenuPaths.salespersonOperation.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
                  <li>
                    <NavLink
                      to="/targets"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Targets
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.paymentManagement.paths,
                    submenuPaths.paymentManagement.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.regions.paths,
                    submenuPaths.regions.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.productCatalogue.paths,
                    submenuPaths.productCatalogue.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.farmerManagement.paths,
                    submenuPaths.farmerManagement.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <Icon icon="ri:clipboard-line" className="menu-icon" />
                  <span>Farmer Management</span>
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
                      to="/deliveries"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Deliveries
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/supply-residence"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Farmer Residence
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.invoices.paths,
                    submenuPaths.invoices.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <Icon icon="hugeicons:invoice-03" className="menu-icon" />
                  <span>Invoices</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/invoice-register"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.depotManagement.paths,
                    submenuPaths.depotManagement.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <Icon icon="ri:store-3-line" className="menu-icon" />
                  <span>Depot Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/depot"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Depots
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/stock-request"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Stock Request
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/approved-stock"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Approved Stock
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/delivered-order"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Delivered Order
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.stockManagement.paths,
                    submenuPaths.stockManagement.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <Icon icon="ri:equalizer-line" className="menu-icon" />
                  <span>Stock Management</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/stock"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Stock
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/depot-reconciliation"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Depot Stock Reconciliation
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/salesperson-reconciliation"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Salesperson Reconciliation
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.storageFacility.paths,
                    submenuPaths.storageFacility.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
                <Link to="#">
                  <Icon icon="ri-store-line" className="menu-icon" />
                  <span>Storage Facility</span>
                </Link>
                <ul className="sidebar-submenu">
                  <li>
                    <NavLink
                      to="/storage-facility"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Storage Facility
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/batch"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Batch
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/drawing"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Drawing
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.authentication.paths,
                    submenuPaths.authentication.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.roles.paths,
                    submenuPaths.roles.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.settings.paths,
                    submenuPaths.settings.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
                      to="/customer-category"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Customer Category
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/customer-pricing"
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      Customer Pricing
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
                </ul>
              </li>
              <li
                className={`dropdown ${
                  isSubmenuActive(
                    submenuPaths.chart.paths,
                    submenuPaths.chart.childRoutes
                  )
                    ? "submenu-active"
                    : ""
                }`}
              >
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
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <ThemeToggleButton />
                  <div>
                    <Link to="/chat">
                      <button
                        className="positioning position-relative border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
                        type="button"
                      >
                        <Icon
                          icon="tabler:message-circle"
                          className="text-primary-light text-xl"
                        />
                        {unreadMessages > 0 && (
                          <span className="position-absolute top-0 end-0 w-12-px h-12-px bg-danger-main text-white fw-semibold fs-14 rounded-circle d-flex justify-content-center align-items-center">
                            {unreadMessages}
                          </span>
                        )}
                      </button>
                    </Link>
                  </div>
                  <div>
                    <Link to="/email">
                      <button
                        className="positioning position-relative border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
                        type="button"
                      >
                        <Icon
                          icon="mage:email"
                          className="text-primary-light text-xl"
                        />
                      </button>
                    </Link>
                  </div>
                  <div className="dropdown">
                    <button
                      className="positioning position-relative border-0 bg-transparent p-0 d-flex justify-content-center align-items-center gap-1"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <Icon
                        icon="iconoir:bell"
                        className="text-primary-light text-xl"
                      />
                    </button>
                    <div className="dropdown-menu to-top dropdown-menu-md p-0">
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
                      className="user-image d-flex justify-content-center align-items-center rounded-circle positioning position-relative gap-2"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src="/assets/images/user-img.png"
                        alt="image_user"
                        className="object-fit-cover rounded-circle"
                      />
                      <span className="position-absolute bottom-0 end-0 background-success-main w-8-px h-8-px rounded-circle"></span>
                    </button>
                    <div className="dropdown-menu to-top dropdown-menu-sm">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src="/assets/images/user-img.png"
                          alt="image_user"
                          className="profile-image object-fit-cover"
                        />
                        <div className="headers bg-primary-50">
                          {loading ? (
                            <span>
                              <Spinner />
                            </span>
                          ) : user ? (
                            <>
                              <h6 className="text-lg text-primary-light fw-semibold mb-2">
                                {`${user.firstName} ${user.lastName}`}
                              </h6>
                              <span className="text-secondary-light fw-sm text-sm mb-4">
                                {user.email}
                              </span>
                              <p className="text-secondary-light fw-bold text-sm mb-0">
                                {user.role}
                              </p>
                            </>
                          ) : (
                            <span>Please log in</span>
                          )}
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
                            />
                            My Profile
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
                            <Icon icon="lucide:power" className="icon text-md" />
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
              <div
                className="card shadow-sm mt-3 full-width-card"
                style={{ width: "100%" }}
              >
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
                  © 2025 Logistify System. All Rights Reserved.
                </p>
              </div>
              <div className="col-auto">
                <p className="mb-0" style={{ fontSize: "13px" }}>
                  Made by{" "}
                  <span className="text-primary-600">tigersoft-team</span>
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