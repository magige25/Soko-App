import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddTargetsLayer from "../components/AddTargetsLayer";


const AddTargetsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Target" />
        {/* AddTargetsLayer */}
        <AddTargetsLayer />

      </MasterLayout>

    </>
  );
};

export default AddTargetsPage; 