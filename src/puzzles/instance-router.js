import React, { useState, useEffect, useContext, useCallback } from "react";
import { Route, Switch } from "react-router-dom";
import List from "./instance-list";
import { UserContext } from "../login/user-context";

export default function InstanceRouter(props) {
	const { match, Instance, Instructions, id, instanceSort, name } = props;
	const cachedList = sessionStorage.getItem(`${id}-instance-list`);
	const {
		user: { token },
	} = useContext(UserContext);
	const fixInstanceList = useCallback(
		(list) => {
			list.sort(instanceSort);
			if (Instructions) {
				list.unshift({
					instance: "instructions",
					title: "instructions",
				});
			}
			return list;
		},
		[Instructions, instanceSort]
	);
	const [instanceList, setInstanceList] = useState(
		cachedList ? fixInstanceList(JSON.parse(cachedList)) : []
	);

	useEffect(() => {
		if (!cachedList) {
			(async () => {
				const uri = `${process.env.REACT_APP_API_URL}/puzzles/${id}/`;
				const response = await fetch(uri, {
					method: "GET",
					headers: { authorization: token },
				});
				if (response.ok) {
					try {
						const list = await response.json();
						sessionStorage.setItem(
							`${id}-instance-list`,
							JSON.stringify(list)
						);
						setInstanceList(fixInstanceList(list));
					} catch (error) {
						console.log(error);
					}
				} else console.log("HTTP error, status = " + response.status);
			})();
		}
	}, [token, cachedList, id, fixInstanceList]);

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
