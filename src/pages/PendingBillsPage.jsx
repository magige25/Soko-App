import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PendingBillsLayer from "../components/PendingBillsLayer";

const PendingBillsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Pending Bills" />

            {/* PendingBillsLayer */}
          <PendingBillsLayer/>

        </MasterLayout>
    </>
  );
};

export default PendingBillsPage; 