import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditDepot from "../components/child/EditDepot";


const EditDepotPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Depot" />

        {/* EditDepot */}
        <EditDepot />


      </MasterLayout>
    </>
  );
};

export default EditDepotPage;