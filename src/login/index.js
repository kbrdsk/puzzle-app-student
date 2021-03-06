import React, { useState, useContext, useEffect, useCallback } from "react";
import jwt from "jsonwebtoken";
import { UserContext } from "./user-context";

export default function Login(props) {
	const [first, setFirst] = useState();
	const [last, setLast] = useState();
	const [fetching, setFetching] = useState(false);
	const [badLogin, setBadLogin] = useState(false);
	const { setUser } = useContext(UserContext);

	const updateName = (updater, event) => {
		updater((name) => {
			const newName = event.target.value.replace(/[^a-zA-Z\-']/, "");
			return newName.length < 20 ? newName : name;
		});
	};

	const login = useCallback(
		async (create) => {
			if (!(first && last)) {
				setBadLogin("missing name");
				return;
			}
			setFetching(create ? "create" : "login");
			const studentData = { first, last };
			const uri =
				`${process.env.REACT_APP_API_URL}/students` +
				(create ? "" : "/login");
			try {
				const response = await fetch(uri, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(studentData),
				});
				setFetching(false);
				if (response.ok) {
					setBadLogin(false);
					try {
						const token = (await response.json()).token;
						const { student } = jwt.decode(token);
						const user = { token, student };
						sessionStorage.setItem(
							"mcub-student-user",
							JSON.stringify(user)
						);
						setUser(user);
						props.history.push("/");
					} catch (error) {
						console.log(error);
					}
				} else {
					setBadLogin(response.status);
					console.log("HTTP error, status = " + response.status);
				}
			} catch (error) {
				setFetching(false);
				setBadLogin(500);
				console.log(error);
			}
		},
		[first, last, props.history, setUser]
	);

	const downHandler = useCallback(
		({ key }) => {
			if (key === "Enter") {
				login(false);
			}
		},
		[login]
	);

	useEffect(() => {
		window.addEventListener("keydown", downHandler);
		return () => window.removeEventListener("keydown", downHandler);
	}, [downHandler]);

	return (
		<div className="login-container">
			<div className="login-window">
				{fetching ? (
					<div className="fetching-indicator">
						{fetching === "create"
							? "Creating new user..."
							: "Logging in..."}
					</div>
				) : null}
				{badLogin ? (
					<p className="login-error">
						{badLogin === 404
							? "User not found. Please try again or create a new user."
							: badLogin === 403
							? "User already exists."
							: badLogin === "missing name"
							? "Please enter both your first and last name."
							: "An error occurred, please try again."}
					</p>
				) : null}
				<div className="name-container first">
					<label htmlFor="firstname">First Name:</label>
					<input
						type="text"
						name="firstname"
						id="firstname"
						value={first}
						onChange={updateName.bind(null, setFirst)}
					/>
				</div>
				<div className="name-container last">
					<label htmlFor="lastname">Last Name:</label>
					<input
						type="text"
						name="lastname"
						id="lastname"
						value={last}
						onChange={updateName.bind(null, setLast)}
					/>
				</div>
				<button className="create-student" onClick={() => login(true)}>
					Create
				</button>
				<button className="login-student" onClick={() => login(false)}>
					Log-In
				</button>
			</div>
		</div>
	);
}
