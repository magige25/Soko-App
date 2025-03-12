import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerDetails from "../components/child/CustomerDetails";


const CustomerDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Customer Details"/>

        {/* CustomerDetails */}
        <CustomerDetails />


      </MasterLayout>
    </>
  );
};

export default CustomerDetailsPage;