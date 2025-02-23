import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SettledSuppliesLayer from "../components/SettledSuppliesLayer";

const SettledSuppliesPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Settled Supplies" />

            {/* SettledSuppliesLayer */}
          <SettledSuppliesLayer/>

        </MasterLayout>
    </>
  );
};

export default SettledSuppliesPage; 