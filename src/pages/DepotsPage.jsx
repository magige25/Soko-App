import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DepotsLayer from "../components/DepotsLayer";


const DepotsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Depots" />

        {/* DepotsLayer */}
        <DepotsLayer />


      </MasterLayout>
    </>
  );
};

export default DepotsPage;