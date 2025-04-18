import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SuppliesLayer from "../components/SuppliesLayer";

const SuppliesPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Supplies" />

            {/* SuppliesLayer */}
          <SuppliesLayer/>

        </MasterLayout>
    </>
  );
};

export default SuppliesPage; 