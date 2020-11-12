import React, { useState, useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import List from "./list";
import Instance from "./instance";
import { UserContext } from "../../login/user-context";

export default function Page(props) {
	const [instanceList, setInstanceList] = useState([]);
	const {
		user: { token },
	} = useContext(UserContext);
	const match = props.match;

	useEffect(() => {
		const cachedList = sessionStorage.getItem("calcudoku-instance-list");
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
	}, [token]);

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
