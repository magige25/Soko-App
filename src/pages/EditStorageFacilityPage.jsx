import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditStorageFacilityLayer from "../components/EditStorageFacilityLayer";

const EditStorageFacilityPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Storage Facility" />

        {/* EditStorageFacilityLayer */}
        <EditStorageFacilityLayer />

      </MasterLayout>

    </>
  );
};

export default EditStorageFacilityPage; 