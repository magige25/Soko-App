import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveredRequestLayer from "../components/DeliveredRequestLayer";


const DeliveredRequestPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="DeliveredRequest" />

        {/* DeliveredRequestLayer */}
        <DeliveredRequestLayer />


      </MasterLayout>
    </>
  );
};

export default DeliveredRequestPage;