import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditSuppliersLayer from "../components/EditSuppliersLayer";

const EditSuppliersPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Suppliers" />

        {/* EditSuppliersLayer */}
        <EditSuppliersLayer />

      </MasterLayout>

    </>
  );
};

export default EditSuppliersPage; 