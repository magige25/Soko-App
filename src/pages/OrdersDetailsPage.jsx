import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrdersDetailsLayer from "../components/OrdersDetailsLayer";


const OrdersDetailsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Order Details" />

        {/* OrdersDetailsLayer */}
        <OrdersDetailsLayer />


      </MasterLayout>
    </>
  );
};

export default OrdersDetailsPage;