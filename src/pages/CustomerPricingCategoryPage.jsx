import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerPricingCategory from "../components/CustomerPricingCategory";


const CustomerPricingCategoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Settings - CustomerPricingCategory" />

        {/* CustomerPricingCategory */}
        <CustomerPricingCategory />


      </MasterLayout>
    </>
  );
};

export default CustomerPricingCategoryPage;