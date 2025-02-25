import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomersLayer from "../components/CustomersLayer";


const CustomersPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Customers"/>

        {/* CustomersLayer */}
        <CustomersLayer />


      </MasterLayout>
    </>
  );
};

export default CustomersPage;
