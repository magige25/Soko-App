import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddSalespersonsLayer from "../components/AddSalespersonsLayer";

const AddSalespersonsPage = () => {
  return (
    <MasterLayout>
      {/* Breadcrumb */}
      <Breadcrumb title="Salespersons" />

      {/* AddSalespersonsLayer */}
      <AddSalespersonsLayer/>

    </MasterLayout>
  );
};

export default AddSalespersonsPage;