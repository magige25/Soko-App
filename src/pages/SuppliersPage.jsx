import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SuppliersLayer from "../components/SuppliersLayer";

const SuppliersPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Suppliers" />

            {/* SuppliersLayerLayer */}
          <SuppliersLayer/>

        </MasterLayout>
    </>
  );
};

export default SuppliersPage; 