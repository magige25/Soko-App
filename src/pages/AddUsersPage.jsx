import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddUsersLayer from "../components/AddUsersLayer";

const AddUsersPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users" />

        {/* RoleAccessLayer */}
        <AddUsersLayer />

      </MasterLayout>

    </>
  );
};

export default AddUsersPage; 