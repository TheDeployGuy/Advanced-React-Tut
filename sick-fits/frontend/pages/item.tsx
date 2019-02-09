import React from "react";
import SingleItem from "../components/SingleItem";
import { PageQueryProps } from "../frontend.types";

const Item: React.SFC<PageQueryProps> = ({ query }) => (
  <div>
    <SingleItem id={query.id} />
  </div>
);
export default Item;
