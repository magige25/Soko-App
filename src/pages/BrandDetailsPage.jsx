import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BrandDetails from "../components/child/BrandDetails";


const BrandDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Brand Details" />

        {/* BrandDetails */}
        <BrandDetails />


      </MasterLayout>
    </>
  );
};

export default BrandDetailsPage;