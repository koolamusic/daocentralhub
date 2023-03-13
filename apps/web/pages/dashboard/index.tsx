import React from "react";
import { Meta } from "../../layouts";
import View from "../../views/Dashboard";

function Page() {
  return (
    <>
      <Meta />
      <View />
    </>
  );
}

// add the requireAuth property to the page component
Page.requireAuth = true;

export default Page;
