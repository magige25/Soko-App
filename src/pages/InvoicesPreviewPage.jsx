import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InvoicesPreviewLayer from "../components/InvoicesPreviewLayer";

const InvoicesPreviewPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Invoices Preview" />

            {/* InvoicesPreviewLayer */}
          <InvoicesPreviewLayer/>

        </MasterLayout>
    </>
  );
};

export default InvoicesPreviewPage; 