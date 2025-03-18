import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ApprovedStockDetailsLayer from "../components/ApprovedStockDetailsLayer";

const ApprovedStockDetailsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Stock Details" />

            {/* ApprovedStockDetailsLayer */}
          <ApprovedStockDetailsLayer/>

        </MasterLayout>
    </>
  );
};

export default ApprovedStockDetailsPage; 