import { h, render } from "preact";

import NewTab from "./components/NewTab";

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error("Root element not found");
}

render(<NewTab />, rootElement);
