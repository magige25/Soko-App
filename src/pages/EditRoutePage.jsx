import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditRoute from "../components/child/EditRoute";


const EditRoutePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Route" />

        {/* EditRoute */}
        <EditRoute />


      </MasterLayout>
    </>
  );
};

export default EditRoutePage;