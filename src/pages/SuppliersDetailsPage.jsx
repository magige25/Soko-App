import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SuppliersDetailsLayer from "../components/SuppliersDetailsLayer";

const SuppliersDetailsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Suppliers Details" />

        {/* SuppliersDetailsLayer */}
        <SuppliersDetailsLayer />

      </MasterLayout>

    </>
  );
};

export default SuppliersDetailsPage; 