import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DrawRequestLayer from "../components/DrawRequestLayer";


const DrawRequestPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Request" />

        {/* DrawRequestLayer */}
        <DrawRequestLayer />


      </MasterLayout>
    </>
  );
};

export default DrawRequestPage;