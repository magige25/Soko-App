import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddCategoryLayer from "../components/AddCategoryLayer";


const AddCategoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Category" />

        {/* AddCategoryLayer */}
        <AddCategoryLayer />


      </MasterLayout>
    </>
  );
};

export default AddCategoryPage;