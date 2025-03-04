import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StorageFacilityDetailsLayer from "../components/StorageFacilityDetailsLayer";

const StorageFacilityDetailsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Facility Details" />

        {/* StorageFacilityDetailsLayer */}
        <StorageFacilityDetailsLayer />

      </MasterLayout>

    </>
  );
};

export default StorageFacilityDetailsPage; 