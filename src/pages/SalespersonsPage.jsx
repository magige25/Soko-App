import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SalespersonsLayer from "../components/SalespersonsLayer";

const SalespersonsPage = () => {
  return (
    <>
    
        {/* MasterLayout */}
        <MasterLayout>

            {/* Breadcrumb */}
            <Breadcrumb title="Salespersons" />

             {/* SalespersonsLayer */}
            <SalespersonsLayer/>

        </MasterLayout>
       
    </>    
  );
};

export default SalespersonsPage;