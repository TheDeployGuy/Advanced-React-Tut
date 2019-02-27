import React from "react";
import CreateItem from "../components/CreateItem";
import PleaseSignIn from "../components/PleaseSignIn";

const Sell: React.SFC<{}> = () => (
  <div>
    <PleaseSignIn>
      <CreateItem />
    </PleaseSignIn>
  </div>
);

export default Sell;
