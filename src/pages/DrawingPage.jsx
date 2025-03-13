import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DrawingLayer from "../components/DrawingLayer";

const DrawingPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Drawing" />

            {/* DrawingLayer */}
          <DrawingLayer/>

        </MasterLayout>
    </>
  );
};

export default DrawingPage; 