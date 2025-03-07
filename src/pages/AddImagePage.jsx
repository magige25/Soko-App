import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddImage from "../components/child/AddImage";




const AddImagePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Components /Add Image" />

        {/* AddImage */}
        <AddImage />

      </MasterLayout>

    </>
  );
};

export default AddImagePage;