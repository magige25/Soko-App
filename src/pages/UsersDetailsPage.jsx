import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UsersDetailsLayer from "../components/UsersDetailsLayer";

const UsersDetailsPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Users Details" />

            {/* UsersDetailsLayer */}
          <UsersDetailsLayer/>

        </MasterLayout>
    </>
  );
};

export default UsersDetailsPage; 