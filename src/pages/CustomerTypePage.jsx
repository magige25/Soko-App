import React from 'react';
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerTypeLayer from "../components/CustomerTypeLayer";

const CustomerTypePage = () => {
  return (
    <>
    
        {/* MasterLayout */}
        <MasterLayout>

            {/* Breadcrumb */}
            <Breadcrumb title="Customer Type" />

             {/* CustomerTypeLayer */}
            <CustomerTypeLayer/>

        </MasterLayout>
       
    </>    
  );
};

export default CustomerTypePage;