import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PendingDeliveriesLayer from "../components/PendingDeliveriesLayer";


const PendingDeliveriesPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Pending Deliveries"/>

        {/* PendingDeliveriesLayer */}
        <PendingDeliveriesLayer />


      </MasterLayout>
    </>
  );
};

export default PendingDeliveriesPage;
