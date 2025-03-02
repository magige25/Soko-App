import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StorageFacilityLayer from "../components/StorageFacilityLayer";

const StorageFacilityPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title=" Storage Facility" />

        {/* StorageFacilityLayer */}
        <StorageFacilityLayer />

      </MasterLayout>

    </>
  );
};

export default StorageFacilityPage; 