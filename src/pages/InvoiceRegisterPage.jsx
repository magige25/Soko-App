import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InvoiceRegisterLayer from "../components/InvoiceRegisterLayer";

const InvoiceRegisterPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Invoice Register" />

            {/* InvoiceRegisterLayer */}
          <InvoiceRegisterLayer/>

        </MasterLayout>
    </>
  );
};

export default InvoiceRegisterPage; 