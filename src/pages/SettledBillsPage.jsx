import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SettledBillsLayer from "../components/SettledBillsLayer";

const SettledBillsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Settled Bills" />

            {/* SettledBillsLayer */}
          <SettledBillsLayer/>

        </MasterLayout>
    </>
  );
};

export default SettledBillsPage; 