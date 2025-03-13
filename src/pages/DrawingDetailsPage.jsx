import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DrawingDetailsLayer from "../components/DrawingDetailsLayer";

const DrawingDetailsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Drawing Details" />

            {/* DrawingDetailsLayer */}
          <DrawingDetailsLayer/>

        </MasterLayout>
    </>
  );
};

export default DrawingDetailsPage; 