import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BrandsLayer from "../components/BrandsLayer";

const BrandPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Brands" />

            {/* BrandsLayer */}
          <BrandsLayer/>

        </MasterLayout>
    </>
  );
};

export default BrandPage; 