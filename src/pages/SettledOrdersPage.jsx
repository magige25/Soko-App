import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SettledOrdersLayer from "../components/SettledOrdersLayer";


const SettledOrdersPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Pending Deliveries"/>

        {/* SettledOrdersLayer */}
        <SettledOrdersLayer />


      </MasterLayout>
    </>
  );
};

export default SettledOrdersPage;