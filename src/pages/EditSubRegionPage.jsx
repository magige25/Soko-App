import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditSubRegion from "../components/child/EditSubRegion";


const EditSubRegionPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add SubRegion" />

        {/* EditSubRegion */}
        <EditSubRegion />


      </MasterLayout>
    </>
  );
};

export default EditSubRegionPage;