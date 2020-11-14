import React, { useState, useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import List from "./list";
import Instance from "./instance";
import Instructions from "./instructions";
import { UserContext } from "../../login/user-context";

export default function Page(props) {
	const cachedList = sessionStorage.getItem("calcudoku-instance-list");
	const [instanceList, setInstanceList] = useState(
		cachedList ? JSON.parse(cachedList) : []
	);
	const {
		user: { token },
	} = useContext(UserContext);
	const match = props.match;

	useEffect(() => {
		if (cachedList) {
			setInstanceList(JSON.parse(cachedList));
		} else {
			(async () => {
				const uri = `${process.env.REACT_APP_API_URL}/puzzles/calcudoku/`;
				const response = await fetch(uri, {
					method: "GET",
					headers: { authorization: token },
				});
				if (response.ok) {
					try {
						const list = await response.json();
						sessionStorage.setItem(
							"calcudoku-instance-list",
							JSON.stringify(list)
						);
						setInstanceList(list);
					} catch (error) {
						console.log(error);
					}
				} else console.log("HTTP error, status = " + response.status);
			})();
		}
	}, [token, cachedList]);

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
			{instanceList
				? instanceList.map(renderInstanceRoute.bind(null, match))
				: null}
			<Route
				exact
				path={match.url}
				render={(props) => (
					<List {...props} instanceList={instanceList} />
				)}
			/>
		</Switch>
	);
}
