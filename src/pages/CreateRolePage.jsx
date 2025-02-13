import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateRoleLayer from "../components/CreateRoleLayer";


const CreateRolePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Create Role" />

        {/* CreateRoleLayer */}
        <CreateRoleLayer />


      </MasterLayout>
    </>
  );
};

export default CreateRolePage;
