import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddDrawLayer from "../components/AddDrawLayer";


const AddDrawPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Draw" />

        {/* AddDrawLayer */}
        <AddDrawLayer />


      </MasterLayout>
    </>
  );
};

export default AddDrawPage;