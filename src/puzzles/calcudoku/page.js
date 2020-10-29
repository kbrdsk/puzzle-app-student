import React from "react";
import { Route, Switch } from "react-router-dom";
import List, { instanceList } from "./list";
import Instance from "./instance";

const renderInstanceRoute = (match, name) => {
	return (
		<Route
			key={name}
			path={`${match.url}/${name}`}
			render={(props) => <Instance {...props} name={name} />}
		/>
	);
};

export default function Page({ match }) {
	return (
		<Switch>
			{instanceList.map(renderInstanceRoute.bind(null, match))}
			<Route exact path={match.url} component={List} />
		</Switch>
	);
}
