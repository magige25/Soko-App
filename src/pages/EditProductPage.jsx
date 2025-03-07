import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditProduct from "../components/child/EditProduct";


const EditProductPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit product" />

        {/* EditProduct */}
        <EditProduct />


      </MasterLayout>
    </>
  );
};

export default EditProductPage;