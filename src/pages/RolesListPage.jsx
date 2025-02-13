import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RolesListLayer from "../components/RolesListLayer";


const RolesListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Roles" />

        {/* UsersListLayer */}
        <RolesListLayer />

      </MasterLayout>

    </>
  );
};

export default RolesListPage; 
