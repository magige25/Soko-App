import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RegionsDetailsLayer from "../components/RegionsDetailsLayer";

const RegionsDetailsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="regions" />

            {/* RegionsDetailsLayer */}
          <RegionsDetailsLayer/>

        </MasterLayout>
    </>
  );
};

export default RegionsDetailsPage; 