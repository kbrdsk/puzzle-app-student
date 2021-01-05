import { useContext, useEffect } from "react";
import { UserContext } from "./login/user-context";

export function useUpdateActivePuzzle(puzzleName, puzzleId) {
	const {
		user: { token },
	} = useContext(UserContext);
	useEffect(() => {
		const apiurl = `${process.env.REACT_APP_API_URL}/activepuzzle`;
		(async () => {
			await fetch(apiurl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({
					puzzleName,
					puzzleId,
				}),
			});
		})();

		return () => {
			fetch(apiurl, {
				method: "DELETE",
				headers: {
					authorization: token,
				},
			});
		};
	}, [token, puzzleId, puzzleName]);
}

export function useUpdateCompleted(puzzleName, puzzleId, checkComplete) {
	const {
		user: { token },
	} = useContext(UserContext);
	const sessionDataKey = `${puzzleName}-instance-data-${puzzleId}`;
	const apiurl =
		`${process.env.REACT_APP_API_URL}/puzzles/` +
		`${puzzleName}/${puzzleId}`;

	useEffect(() => {
		const sessionData = JSON.parse(sessionStorage.getItem(sessionDataKey));
		if (sessionData.completed) return;
		else if (checkComplete()) {
			fetch(`${apiurl}/completed`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					authorization: token,
				},
				body: JSON.stringify({ completed: true }),
			});
			sessionData.completed = true;
			sessionStorage.setItem(sessionDataKey, JSON.stringify(sessionData));
		}
	}, [sessionDataKey, checkComplete, apiurl, token]);
}