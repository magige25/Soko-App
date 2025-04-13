import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddSubRegion from "../components/child/AddSubRegion";


const AddSubRegionPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add SubRegion" />

        {/* AddSubRegion */}
        <AddSubRegion />


      </MasterLayout>
    </>
  );
};

export default AddSubRegionPage;