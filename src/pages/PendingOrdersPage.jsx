import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PendingOrdersLayer from "../components/PendingOrdersLayer";


const PendingOrdersPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Pending Orders"/>

        {/* PendingOrdersLayer */}
        <PendingOrdersLayer />


      </MasterLayout>
    </>
  );
};

export default PendingOrdersPage;
