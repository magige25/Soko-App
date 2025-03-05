import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditSalespersonsLayer from "../components/EditSalespersonsLayer";

const EditSalespersonsPage = () => {
  return (
    <MasterLayout>
      {/* Breadcrumb */}
      <Breadcrumb title="Edit Salesperson" />

      {/* EditSalespersonsLayer */}
      <EditSalespersonsLayer/>

    </MasterLayout>
  );
};

export default EditSalespersonsPage;