import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddDepotLayer from "../components/AddDepotLayer";

const AddDepotPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Add Depot" />

            {/* AddDepotLayer */}
          <AddDepotLayer/>

        </MasterLayout>
    </>
  );
};

export default AddDepotPage; 