import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddDepot from "../components/child/AddDepot";


const AddDepotPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Depot" />

        {/* AddDepot */}
        <AddDepot />


      </MasterLayout>
    </>
  );
};

export default AddDepotPage;
