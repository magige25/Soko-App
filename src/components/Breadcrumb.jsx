import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  // Hide breadcrumb when on the dashboard
  if (location.pathname === "/dashboard") {
    return null;
  }

  const formatPath = (path) =>
    path.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
      <ul className="d-flex align-items-center gap-2">
        {/* First path should always be "Home" instead of "Dashboard" */}
        <li className="fw-medium">
          <Link to="/dashboard" className="hover-text-primary">
            Home
          </Link>
        </li>

        {paths.length > 0 && (
          <>
            <li>/</li>
            {paths.map((path, index) => {
              const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;

              return (
                <React.Fragment key={routeTo}>
                  <li className="fw-medium">
                    {isLast ? (
                      <span>{formatPath(path)}</span>
                    ) : (
                      <Link to={routeTo} className="hover-text-primary">
                        {formatPath(path)}
                      </Link>
                    )}
                  </li>
                  {!isLast && <li key={`${routeTo}-separator`}>/</li>}
                </React.Fragment>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;