import React from "react";
import Order from "../components/Order";
import { PageQueryProps } from "../frontend.types";

const OrderPage: React.SFC<PageQueryProps> = props => (
  <div>
    <Order id={props.query.id} />
  </div>
);

export default OrderPage;
