import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SupplyResidenceLayer from "../components/SupplyResidenceLayer";

const SupplyResidencePage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Supply Residence" />

            {/* SupplyResidenceLayer */}
          <SupplyResidenceLayer/>

        </MasterLayout>
    </>
  );
};

export default SupplyResidencePage; 