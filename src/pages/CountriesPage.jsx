import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CountriesLayer from "../components/CountriesLayer";


const CountriesPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Settings - Countries" />

        {/* CountriesLayer */}
        <CountriesLayer />


      </MasterLayout>
    </>
  );
};

export default CountriesPage;