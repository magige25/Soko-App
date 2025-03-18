import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditStockRequest from "../components/child/EditStockRequest";


const EditStockRequestPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Stock Request" />

        {/* EditStockRequest */}
        <EditStockRequest />


      </MasterLayout>
    </>
  );
};

export default EditStockRequestPage;
