import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveredOrderLayer from "../components/DeliveredOrderLayer";


const DeliveredOrderPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Delivered Order" />

        {/* DeliveredOrderLayer */}
        <DeliveredOrderLayer />


      </MasterLayout>
    </>
  );
};

export default DeliveredOrderPage;