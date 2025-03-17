import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StockLayer from "../components/StockLayer";


const StockPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Stock" />
        {/* StockLayer */}
        <StockLayer />

      </MasterLayout>

    </>
  );
};

export default StockPage; 