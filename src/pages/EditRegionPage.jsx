import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditRegion from "../components/child/EditRegion";


const EditRegionPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Region" />

        {/* EditRegion */}
        <EditRegion />


      </MasterLayout>
    </>
  );
};

export default EditRegionPage;