import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TargetsLayer from "../components/TargetsLayer";


const TargetsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Targets" />
        {/* TargetsLayer */}
        <TargetsLayer />

      </MasterLayout>

    </>
  );
};

export default TargetsPage; 