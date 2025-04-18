import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddRolesLayer from "../components/AddRolesLayer";


const AddRolesPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Role" />
        {/* AddRolesLayer */}
        <AddRolesLayer />

      </MasterLayout>

    </>
  );
};

export default AddRolesPage; 