import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CompletedSuppliesLayer from "../components/CompletedSuppliesLayer";

const CompletedSuppliesPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Completed Supplies" />

            {/* CompletedSuppliesLayer */}
          <CompletedSuppliesLayer/>

        </MasterLayout>
    </>
  );
};

export default CompletedSuppliesPage; 