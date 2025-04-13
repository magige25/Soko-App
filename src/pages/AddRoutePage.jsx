import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddRoute from "../components/child/AddRoute";


const AddRoutePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Route" />

        {/* AddRoute */}
        <AddRoute />


      </MasterLayout>
    </>
  );
};

export default AddRoutePage;