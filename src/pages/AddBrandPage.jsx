import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddBrand from "../components/child/AddBrand";


const AddBrandPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add brand" />

        {/* AddBrand */}
        <AddBrand />


      </MasterLayout>
    </>
  );
};

export default AddBrandPage;