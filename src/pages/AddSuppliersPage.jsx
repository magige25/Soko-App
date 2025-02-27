import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddSuppliersLayer from "../components/AddSuppliersLayer";

const AddSuppliersPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Suppliers" />

        {/* AddSuppliersLayer */}
        <AddSuppliersLayer />

      </MasterLayout>

    </>
  );
};

export default AddSuppliersPage; 