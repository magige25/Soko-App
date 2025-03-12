import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditBrand from "../components/child/EditBrand";


const EditBrandPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Brand" />

        {/* EditBrand */}
        <EditBrand />


      </MasterLayout>
    </>
  );
};

export default EditBrandPage;