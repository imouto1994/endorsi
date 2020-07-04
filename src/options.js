import { h, render } from "preact";

import Options from "./components/Options";

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error("Root element not found");
}

render(<Options />, rootElement);
