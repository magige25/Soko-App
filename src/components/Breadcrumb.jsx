import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter((path) => path);

  if (location.pathname === "/dashboard") {
    return null;
  }

  const formatPath = (path) =>
    path.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="breadcrumb-container d-flex align-items-center justify-content-between">
      <ul className="breadcrumb-list d-flex align-items-center mb-0">
        <li>
          <Link to="/dashboard">Home</Link>
        </li>

        {paths.length > 0 && (
          <>
            <li className="breadcrumb-separator">/</li>
            {paths.map((path, index) => {
              const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
              const isLast = index === paths.length - 1;

              return (
                <React.Fragment key={routeTo}>
                  <li>
                    {isLast ? (
                      <span>{formatPath(path)}</span>
                    ) : (
                      <Link to={routeTo}>{formatPath(path)}</Link>
                    )}
                  </li>
                  {!isLast && <li className="breadcrumb-separator">/</li>}
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