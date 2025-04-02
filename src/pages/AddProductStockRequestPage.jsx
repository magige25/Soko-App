import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddProductStockRequest from "../components/child/AddProductStockRequest";


const AddProductStockRequestPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Stock" />
        {/* AddProductStockRequest */}
        <AddProductStockRequest />

      </MasterLayout>

    </>
  );
};

export default AddProductStockRequestPage; 