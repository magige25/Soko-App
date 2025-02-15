import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PaginationTableLayer from "../components/PaginationTableLayer";

const PaginationTablePage = () => {
  // Sample data for the table
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Editor" },
    { id: 4, name: "Bob Brown", email: "bob@example.com", role: "Viewer" },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Admin" },
    { id: 6, name: "Eve White", email: "eve@example.com", role: "User" },
    { id: 7, name: "Frank Wilson", email: "frank@example.com", role: "Editor" },
    { id: 8, name: "Grace Lee", email: "grace@example.com", role: "Viewer" },
    { id: 9, name: "Hank Green", email: "hank@example.com", role: "Admin" },
    { id: 10, name: "Ivy Hall", email: "ivy@example.com", role: "User" },
    { id: 11, name: "Jack Black", email: "jack@example.com", role: "Admin" },
    { id: 12, name: "Karen White", email: "karen@example.com", role: "User" },
    { id: 13, name: "Leo Garcia", email: "leo@example.com", role: "Editor" },
    { id: 14, name: "Mona Lisa", email: "mona@example.com", role: "Viewer" },
    { id: 15, name: "Nina Simone", email: "nina@example.com", role: "Admin" },
  ];

  // Columns configuration
  const columns = [
    { header: "ID", field: "id" },
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "Role", field: "role" },
  ];

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Pagination Table" />

        {/* PaginationTableLayer with data, columns, and itemsPerPage set to 10 */}
        <PaginationTableLayer data={data} columns={columns} itemsPerPage={10} />
      </MasterLayout>
    </>
  );
};

export default PaginationTablePage;