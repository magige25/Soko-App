import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerDetailsViewLayer from "../components/CustomerDetailsViewLayer";


const CustomerDetailsViewPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Customer Details View" />

        {/* CustomerDetailsViewLayer */}
        <CustomerDetailsViewLayer />


      </MasterLayout>
    </>
  );
};

export default CustomerDetailsViewPage;