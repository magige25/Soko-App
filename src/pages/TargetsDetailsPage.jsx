import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TargetsDetailsLayer from "../components/TargetsDetailsLayer";


const TargetsDetailsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Target Details" />
        {/* TargetsDetailsLayer */}
        <TargetsDetailsLayer />

      </MasterLayout>

    </>
  );
};

export default TargetsDetailsPage; 