import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SalespersonsDetailsLayer from "../components/SalespersonsDetailsLayer";

const SalespersonsDetailsPage = () => {
  return (
    <MasterLayout>
      {/* Breadcrumb */}
      <Breadcrumb title="Salesperson Details" />

      {/* SalespersonsDetailsLayer */}
      <SalespersonsDetailsLayer/>

    </MasterLayout>
  );
};

export default SalespersonsDetailsPage;