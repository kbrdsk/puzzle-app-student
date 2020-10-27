import React from "react";
import ReactDOM from "react-dom";

import { Login } from "./login/index";

function App() {
	return (
		<main>
			<Login />
		</main>
	);
}

//---------

ReactDOM.render(<App />, document.getElementById("root"));
