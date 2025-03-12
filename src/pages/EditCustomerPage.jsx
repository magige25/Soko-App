import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditCustomer from "../components/child/EditCustomer";


const EditCustomerPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit customer" />

        {/* EditCustomer */}
        <EditCustomer />


      </MasterLayout>
    </>
  );
};

export default EditCustomerPage;