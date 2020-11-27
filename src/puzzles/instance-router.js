import React from "react";
import { Route, Switch } from "react-router-dom";
import List from "./instance-list";

export default function InstanceRouter(props) {
	const { match, Instance, Instructions, id, name, instanceList } = props;

	const renderInstanceRoute = (match, { instance }) => {
		return (
			<Route
				key={instance}
				path={`${match.url}/${instance}`}
				render={(props) => <Instance {...props} name={instance} />}
			/>
		);
	};

	return (
		<Switch>
			<Route
				key="instructions"
				path={`${match.url}/instructions`}
				render={(props) => <Instructions {...props} />}
			/>
			{instanceList.map(renderInstanceRoute.bind(null, match))}
			<Route
				exact
				path={match.url}
				render={(props) => (
					<List
						{...props}
						instanceList={instanceList}
						title={name}
						puzzleType={id}
					/>
				)}
			/>
		</Switch>
	);
}
