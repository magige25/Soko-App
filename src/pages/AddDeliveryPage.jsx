import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddDelivery from "../components/child/AddDelivery";


const AddDeliveryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add delivery" />

        {/* AddDelivery */}
        <AddDelivery />


      </MasterLayout>
    </>
  );
};

export default AddDeliveryPage;