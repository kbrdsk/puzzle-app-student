//import * as Test from "./test/index";
import * as calcudoku from "./calcudoku/index";
import * as logic from "./logic/index";
import * as light from "./light/index";
import * as matchstick from "./matchstick/index";

export const puzzleList = [logic, calcudoku, light /*matchstick*/];

export const potd = {
	uri: "/light/instructions",
	Preview: POTDPreview,
};

function POTDPreview() {
	return <div className="potd-preview">Light up all the lights!</div>;
}
