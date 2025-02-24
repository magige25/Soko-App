import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SubCategoryLayer from "../components/SubCategoryLayer";

const SubCategoryPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Sub Category" />

            {/* SubCategoryLayer */}
          <SubCategoryLayer/>

        </MasterLayout>
    </>
  );
};

export default SubCategoryPage; 