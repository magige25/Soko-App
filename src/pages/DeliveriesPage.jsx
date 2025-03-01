import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveriesLayer from "../components/DeliveriesLayer";


const DeliveriesPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Deliveries" />

        {/* DeliveriesLayer */}
        <DeliveriesLayer />


      </MasterLayout>
    </>
  );
};

export default DeliveriesPage;