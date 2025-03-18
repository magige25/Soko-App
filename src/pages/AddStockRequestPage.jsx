import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddStockRequestLayer from "../components/AddStockRequestLayer";


const AddStockRequestPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Stock Request" />
        {/* AddStockRequestLayer */}
        <AddStockRequestLayer />

      </MasterLayout>

    </>
  );
};

export default AddStockRequestPage; 