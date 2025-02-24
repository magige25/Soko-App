import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SubRegionsDetailsLayer from "../components/SubRegionsDetailsLayer";

const SubRegionsDetailsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="sub-regions" />

            {/* SubRegionsDetailsLayer */}
          <SubRegionsDetailsLayer/>

        </MasterLayout>
    </>
  );
};

export default SubRegionsDetailsPage; 
