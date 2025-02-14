import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RoutesLayer from "../components/RoutesLayer";

const RoutesPage = () => {
  return (
    <>
    
        {/* MasterLayout */}
        <MasterLayout>

            {/* Breadcrumb */}
            <Breadcrumb title="Routes" />

             {/* RoutesLayer */}
            <RoutesLayer/>

        </MasterLayout>
       
    </>    
  );
};

export default RoutesPage;