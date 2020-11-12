import React, { useState, useContext, useEffect, useCallback } from "react";
import jwt from "jsonwebtoken";
import { UserContext } from "./user-context";

export default function Login(props) {
	const [first, setFirst] = useState();
	const [last, setLast] = useState();
	const [badLogin, setBadLogin] = useState(false);
	const { setUser } = useContext(UserContext);

	const updateName = (updater, event) => {
		updater(event.target.value);
	};

	const login = useCallback(
		async (create) => {
			const studentData = { first, last };
			const uri =
				`${process.env.REACT_APP_API_URL}/students` +
				(create ? "" : "/login");
			const response = await fetch(uri, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(studentData),
			});
			if (response.ok) {
				setBadLogin(false);
				try {
					const token = (await response.json()).token;
					const { student } = jwt.decode(token);
					setUser({ token, student });
					props.history.push("/");
				} catch (error) {
					console.log(error);
				}
			} else if (response.status === 404 || response.status === 403) {
				setBadLogin(response.status);
			} else console.log("HTTP error, status = " + response.status);
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
				{badLogin ? (
					<p className="login-error">
						{badLogin === 404
							? "User not found. Please try again or create a new user."
							: badLogin === 403
							? "User already exists."
							: "An error occurred while attempting to log in."}
					</p>
				) : null}
				<div className="name-container first">
					<label htmlFor="firstname">First Name:</label>
					<input
						type="text"
						name="firstname"
						id="firstname"
						onChange={updateName.bind(null, setFirst)}
					/>
				</div>
				<div className="name-container last">
					<label htmlFor="lastname">Last Name:</label>
					<input
						type="text"
						name="lasname"
						id="lasname"
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
