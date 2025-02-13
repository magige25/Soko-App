import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SubRegionsLayer from "../components/SubRegionsLayer";

const SubRegionsPage = () => {
  return (
    <>
    
        {/* MasterLayout */}
        <MasterLayout>

            {/* Breadcrumb */}
            <Breadcrumb title="Sub-Regions" />

             {/* RegionsLayer */}
            <SubRegionsLayer/>

        </MasterLayout>
       
    </>    
  );
};

export default SubRegionsPage;