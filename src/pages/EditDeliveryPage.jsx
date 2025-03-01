import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditDelivery from "../components/child/EditDelivery";


const EditDeliveryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add delivery" />

        {/* EditDelivery */}
        <EditDelivery />


      </MasterLayout>
    </>
  );
};

export default EditDeliveryPage;