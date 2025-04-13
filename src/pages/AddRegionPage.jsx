import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddRegion from "../components/child/AddRegion";


const AddRegionPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Region" />

        {/* AddRegion */}
        <AddRegion />


      </MasterLayout>
    </>
  );
};

export default AddRegionPage;