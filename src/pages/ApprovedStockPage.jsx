import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ApprovedStockLayer from "../components/ApprovedStockLayer";

const ApprovedStockPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Approved Stock" />

            {/* ApprovedStockLayer */}
          <ApprovedStockLayer/>

        </MasterLayout>
    </>
  );
};

export default ApprovedStockPage; 