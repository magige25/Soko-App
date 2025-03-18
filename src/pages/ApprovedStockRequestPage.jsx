import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ApprovedStockRequestLayer from "../components/ApprovedStockRequestLayer";


const ApprovedStockRequestPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="ApprovedStockRequest" />

        {/* ApprovedStockRequestLayer */}
        <ApprovedStockRequestLayer />


      </MasterLayout>
    </>
  );
};

export default ApprovedStockRequestPage;