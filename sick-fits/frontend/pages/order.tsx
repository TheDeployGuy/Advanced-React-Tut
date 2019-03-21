import React from "react";
import Order from "../components/Order";
import { PageQueryProps } from "../frontend.types";
import PleaseSignIn from "../components/PleaseSignIn";

const OrderPage: React.SFC<PageQueryProps> = props => (
  <PleaseSignIn>
    <Order id={props.query.id} />
  </PleaseSignIn>
);

export default OrderPage;
