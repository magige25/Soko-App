import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ViewStockRequest from "../components/child/ViewStockRequest";


const ViewStockRequestPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="View Stock Request" />

        {/* ViewStockRequest */}
        <ViewStockRequest />


      </MasterLayout>
    </>
  );
};

export default ViewStockRequestPage;
