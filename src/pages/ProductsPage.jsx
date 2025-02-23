import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProductsLayer from "../components/ProductsLayer";

const ProductsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Products" />

            {/* ProductsLayer */}
          <ProductsLayer/>

        </MasterLayout>
    </>
  );
};

export default ProductsPage; 