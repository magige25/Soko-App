import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StockRequestLayer from "../components/StockRequestLayer";


const StockRequestPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Stock Request" />
        {/* StockRequestLayer */}
        <StockRequestLayer />

      </MasterLayout>

    </>
  );
};

export default StockRequestPage; 