import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProductDetails from "../components/child/ProductDetails";


const ProductDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Product Details" />

        {/* ProductDetails */}
        <ProductDetails />


      </MasterLayout>
    </>
  );
};

export default ProductDetailsPage;