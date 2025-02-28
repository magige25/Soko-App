import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditUsersLayer from "../components/EditUsersLayer";

const EditUsersPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Edit Users" />

            {/* EditUsersLayer */}
          <EditUsersLayer/>

        </MasterLayout>
    </>
  );
};

export default EditUsersPage; 