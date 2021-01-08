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

export function useUpdateWork(puzzleName, puzzleId, setSaveStatus) {
	const {
		user: { token },
	} = useContext(UserContext);
	const sessionDataKey = `${puzzleName}-instance-data-${puzzleId}`;
	const apiurl =
		`${process.env.REACT_APP_API_URL}/puzzles/` +
		`${puzzleName}/${puzzleId}`;
	return async (work) => {
		setSaveStatus("saving");
		const response = await fetch(apiurl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				authorization: token,
			},
			body: JSON.stringify({ puzzleData: work }),
		});

		const newSessionData = JSON.parse(
			sessionStorage.getItem(sessionDataKey)
		);
		newSessionData.work = work;
		newSessionData.workPosition = work.length;
		sessionStorage.setItem(sessionDataKey, JSON.stringify(newSessionData));

		if (response.ok) setSaveStatus("saved");
		else setSaveStatus("error");
	};
}

export function useFetchPuzzleData(puzzleName, puzzleId) {
	const {
		user: { token },
	} = useContext(UserContext);
	const sessionDataKey = `${puzzleName}-instance-data-${puzzleId}`;
	const apiurl =
		`${process.env.REACT_APP_API_URL}/puzzles/` +
		`${puzzleName}/${puzzleId}`;
	return async () => {
		const response = await fetch(apiurl, {
			method: "GET",
			header: { authorization: token },
		});
		if (response.ok) {
			const data = await response.json();
			sessionStorage.setItem(sessionDataKey, JSON.stringify(data));
		} else {
			throw new Error(`HTTP error, status = ${response.status}`);
		}
	};
}

export async function fetchUserData({ token }) {
	const url = `${process.env.REACT_APP_API_URL}/data`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			authorization: token,
		},
	});
	if (response.ok) {
		const data = await response.json();
		for (let puzzleName in data) {
			for (let puzzle of data[puzzleName]) {
				const { puzzleId } = puzzle;
				const instanceKey = `${puzzleName}-instance-data-${puzzleId}`;
				sessionStorage.setItem(instanceKey, JSON.stringify(puzzle));
			}
		}
	} else {
		console.log(`HTTP error, status = ${response.status}`);
	}
}