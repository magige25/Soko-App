import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddProduct from "../components/child/AddProduct";


const AddProductPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Product" />

        {/* AddProduct */}
        <AddProduct />


      </MasterLayout>
    </>
  );
};

export default AddProductPage;