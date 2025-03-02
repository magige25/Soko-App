import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddStorageFacilityLayer from "../components/AddStorageFacilityLayer";

const AddStorageFacilityPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Storage Facility" />

        {/* AddStorageFacilityLayer */}
        <AddStorageFacilityLayer />

      </MasterLayout>

    </>
  );
};

export default AddStorageFacilityPage; 