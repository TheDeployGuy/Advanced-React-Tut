import React from "react";
import Items from "../components/Items";

const Home: React.SFC<{
  query: {
    page: string;
  };
}> = props => (
  <div>
    <Items page={parseFloat(props.query.page) || 1} />
  </div>
);
export default Home;
