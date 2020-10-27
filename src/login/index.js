import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { Redirect } from "react-router-dom";

export default function Login() {
	const [first, setFirst] = useState();
	const [last, setLast] = useState();
	const [loginSuccess, setLoginSuccess] = useState(false);
	let token;

	const updateName = (updater, event) => {
		updater(event.target.value);
	};

	const login = async (create) => {
		const studentData = { first, last };
		const uri =
			`${process.env.REACT_APP_API_URI}/students` +
			(create ? "" : "/login");
		const response = await fetch(uri, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(studentData),
		});
		if (response.ok) {
			const token = (await response.json()).token;
			try {
				jwt.decode(token);
				setLoginSuccess(true);
			} catch (error) {
				console.log(error);
			}
		} else console.log("HTTP error, status = " + response.status);
	};

	return loginSuccess ? (
		<Redirect to={{ pathname: "/", state: { token } }} />
	) : (
		<div id="login-container">
			<div className="name-container">
				<label htmlFor="firstname">First Name:</label>
				<input
					type="text"
					name="firstname"
					id="firstname"
					onChange={updateName.bind(null, setFirst)}
				/>
			</div>
			<div className="name-container">
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
	);
}
