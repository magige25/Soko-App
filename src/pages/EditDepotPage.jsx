import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditDepotLayer from "../components/EditDepotLayer";

const EditDepotPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Edit Depot" />

            {/* EditDepotLayer */}
          <EditDepotLayer/>

        </MasterLayout>
    </>
  );
};

export default EditDepotPage; 