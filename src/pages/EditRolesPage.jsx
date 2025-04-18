import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditRolesLayer from "../components/EditRolesLayer";


const EditRolesPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Role" />
        {/* EditRolesLayer */}
        <EditRolesLayer />

      </MasterLayout>

    </>
  );
};

export default EditRolesPage; 