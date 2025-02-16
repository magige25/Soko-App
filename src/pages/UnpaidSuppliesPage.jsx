import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UnpaidSuppliesLayer from "../components/UnpaidSuppliesLayer";

const UnpaidSuppliesPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Unpaid Supplies" />

            {/* UnpaidSuppliesLayer */}
          <UnpaidSuppliesLayer/>

        </MasterLayout>
    </>
  );
};

export default UnpaidSuppliesPage; 