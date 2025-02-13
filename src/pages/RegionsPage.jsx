import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RegionsLayer from "../components/RegionsLayer";

const RegionsPage = () => {
  return (
    <>
    
        {/* MasterLayout */}
        <MasterLayout>

            {/* Breadcrumb */}
            <Breadcrumb title="Regions" />

             {/* RegionsLayer */}
            <RegionsLayer/>

        </MasterLayout>
       
    </>    
  );
};

export default RegionsPage;