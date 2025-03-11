import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddSubCategoryLayer from "../components/AddSubCategoryLayer";


const AddSubCategoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Subcategory" />

        {/* AddSubCategoryLayer */}
        <AddSubCategoryLayer />


      </MasterLayout>
    </>
  );
};

export default AddSubCategoryPage;