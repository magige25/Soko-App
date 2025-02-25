import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PricingCategoriesLayer from "../components/PricingCategoriesLayer";

const PricingCategoriesPage = () => {
  return (
    <>
    
        {/* MasterLayout */}
        <MasterLayout>

            {/* Breadcrumb */}
            <Breadcrumb title="PricingCategories" />

             {/* PricingCategoriesLayer */}
            <PricingCategoriesLayer/>

        </MasterLayout>
       
    </>    
  );
};

export default PricingCategoriesPage;