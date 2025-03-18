import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ViewDepot from "../components/child/ViewDepot";


const ViewDepotPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="View Depot" />

        {/* ViewDepot */}
        <ViewDepot />


      </MasterLayout>
    </>
  );
};

export default ViewDepotPage;