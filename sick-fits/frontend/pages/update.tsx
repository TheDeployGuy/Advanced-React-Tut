import React from "react";
import UpdateItem from "../components/UpdateItem";
import { PageQueryProps } from "../frontend.types";

const Update: React.SFC<PageQueryProps> = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Update;
