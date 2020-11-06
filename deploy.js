const ghpages = require("gh-pages");

ghpages.publish("build", {
	repo: "git@github.com:kbrdsk/puzzle-app-student.git",
});
