import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PendingSuppliesLayer from "../components/PendingSuppliesLayer";

const PendingSuppliersPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Pending Supplies" />

            {/* PendingSuppliesLayer */}
          <PendingSuppliesLayer/>

        </MasterLayout>
    </>
  );
};

export default PendingSuppliersPage; 