import React from "react";
import Instance from "./instance";
import { fetchUserData } from "../../index";

const name = "Logic Puzzles";
const id = "logic";

function ListPreview() {
	return <div className="list-preview">Find all logic puzzles here</div>;
}

const instanceList = [
	{ instance: "wolfgoatcabbage", title: "Wolf, Goat, Cabbage" },
	{ instance: "torch", title: "Bridge & Torch" },
	{ instance: "goldboxes", title: "Find the Gold" },
	{ instance: "10coins", title: "10 Coins" },
	{ instance: "socks", title: "Cathy's Socks" },
	{
		instance: "childrenboat",
		title: "2 Adults, 2 Children, a Boat, and a River",
	},
	{ instance: "applesandoranges", title: "Apples & Oranges" },
	{ instance: "averybobbycam", title: "Avery, Bobby, & Cam" },
	{ instance: "bear", title: "Bear" },
	{ instance: "hats", title: "Hats" },
];

instanceList.fetchCompletionStatus = fetchUserData;

export { name, id, ListPreview, Instance, instanceList };
