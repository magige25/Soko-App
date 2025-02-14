import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RoutesDetailsLayer from "../components/RoutesDetailsLayer";

const RoutesDetailsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="routes" />

            {/* RoutesDetailsLayer */}
          <RoutesDetailsLayer/>

        </MasterLayout>
    </>
  );
};

export default RoutesDetailsPage; 