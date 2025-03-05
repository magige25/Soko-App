import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BatchLayer from "../components/BatchLayer";

const BatchPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Batch" />

            {/* BatchLayer */}
          <BatchLayer/>

        </MasterLayout>
    </>
  );
};

export default BatchPage; 