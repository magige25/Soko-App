import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SettledInvoicesLayer from "../components/SettledInvoicesLayer";

const SettledInvoicesPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Settled Invoices" />

            {/* SettledInvoicesLayer */}
          <SettledInvoicesLayer/>

        </MasterLayout>
    </>
  );
};

export default SettledInvoicesPage; 