import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SettledInvoicesPreviewLayer from "../components/SettledInvoicesPreviewLayer";

const SettledInvoicesPreviewPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Settled Invoices Preview" />

            {/* SettledInvoicesPreviewLayer */}
          <SettledInvoicesPreviewLayer/>

        </MasterLayout>
    </>
  );
};

export default SettledInvoicesPreviewPage; 