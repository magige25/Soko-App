import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerCategory from "../components/CustomerCategory";


const CustomerCategoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Settings - CustomerCategory" />

        {/* CustomerCategory */}
        <CustomerCategory />


      </MasterLayout>
    </>
  );
};

export default CustomerCategoryPage;