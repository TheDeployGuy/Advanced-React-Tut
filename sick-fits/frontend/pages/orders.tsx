import React from "react";
import OrderList from "../components/OrderList";
import PleaseSignIn from "../components/PleaseSignIn";

const OrderListPage: React.SFC<{}> = () => (
  <PleaseSignIn>
    <OrderList />
  </PleaseSignIn>
);

export default OrderListPage;
