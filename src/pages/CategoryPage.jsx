import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CategoryLayer from "../components/CategoryLayer";

const CategoryPage= () => {
  return (
    <>

       {/* MasterLayout */}
        <MasterLayout>

          {/* Breadcrumb */}
          <Breadcrumb title="Category" />

            {/* CategoryLayer */}
          <CategoryLayer/>

        </MasterLayout>
    </>
  );
};

export default CategoryPage; 