import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DepotLayer from "../components/DepotLayer";

const DepotPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Depot" />

            {/* DepotLayer */}
          <DepotLayer/>

        </MasterLayout>
    </>
  );
};

export default DepotPage; 