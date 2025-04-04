import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddOrdersLayer from "../components/AddOrdersLayer";


const AddOrdersPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Orders" />

        {/* AddOrdersLayer */}
        <AddOrdersLayer />


      </MasterLayout>
    </>
  );
};

export default AddOrdersPage;