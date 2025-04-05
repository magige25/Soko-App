import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrdersLayer from "../components/OrdersLayer";

const OrdersPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Orders"/>

        {/* OrdersLayer */}
        <OrdersLayer />


      </MasterLayout>
    </>
  );
};

export default OrdersPage;
