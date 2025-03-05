import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditTargetsLayer from "../components/EditTargetsLayer";


const EditTargetsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Target" />
        {/* EditTargetsLayer */}
        <EditTargetsLayer />

      </MasterLayout>

    </>
  );
};

export default EditTargetsPage; 