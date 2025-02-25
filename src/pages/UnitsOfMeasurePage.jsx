import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UnitsOfMeasureLayer from "../components/UnitsOfMeasureLayer";


const UnitsOfMeasurePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Units of Measure"/>

        {/* UnitsOfMeasureLayer */}
        <UnitsOfMeasureLayer />


      </MasterLayout>
    </>
  );
};

export default UnitsOfMeasurePage;
