import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreditorsRequestLayer from "../components/CreditorsRequestLayer";


const CreditorsRequestPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Creditors Request"/>

        {/* CreditorsRequestLayer */}
        <CreditorsRequestLayer />


      </MasterLayout>
    </>
  );
};

export default CreditorsRequestPage;
