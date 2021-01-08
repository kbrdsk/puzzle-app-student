//import * as Test from "./test/index";
import * as calcudoku from "./calcudoku/index";
import * as logic from "./logic/index";
import * as light from "./light/index";
import * as matchstick from "./matchstick/index";
import * as tangram from "./tangram/index";

export const puzzleList = [logic, calcudoku, light, matchstick, tangram];

export const potd = {
	uri: "/tangram/instructions",
	Preview: POTDPreview,
};

function POTDPreview() {
	return <div className="potd-preview">Tangrams!</div>;
}
