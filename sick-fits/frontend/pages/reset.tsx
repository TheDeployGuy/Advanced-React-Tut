import React from "react";
import Reset from "../components/Reset";
import { ResetQueryProps } from "../frontend.types";

const ResetPage: React.SFC<ResetQueryProps> = ({ query }) => (
  <div>
    <p>Reset your password!</p>
    <Reset resetToken={query.resetToken} />
  </div>
);

export default ResetPage;
