import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InvoicesLayer from "../components/InvoicesLayer";

const InvoicesPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Invoices" />

            {/* InvoicesLayer */}
          <InvoicesLayer/>

        </MasterLayout>
    </>
  );
};

export default InvoicesPage; 