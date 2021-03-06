var width = 375;
var height = 375;
var radius = width / 2;
var donutWidth = 40;

var data = [
	{category: "web", skills: [
		"HTML/CSS",
		"JavaScript",
		"Interactive data visualization",
		"D3.js"
	]},

	{category: "software", skills: [
		"Java",
		"C/C++",
		"Python",
		"OCaml",
		"JavaScript",
		"Git",
		"Object-oriented programming",
		"Functional programmming",
		"Data structures",
		"Assembly language",
		"Processor design",
		"Ranking and search algorithms"]},

	{category: "app", skills: [
		"iOS development",
		"Android development",
		"Swift",
		"Objective-C",
		"Xcode",
		"Android Studio",
		"CocoaPods",
		"Starscream",
		"ObjectMapper"]}
];

var htmlString = "";

function makeSkillString (category) {
	category.skills.forEach(function (skill) {
		htmlString += skill + "<br>";
	});
}

makeSkillString(data[2]);
makeSkillString(data[1]);
makeSkillString(data[0]);

d3.select("#skill_list")
.html(htmlString);

var arc = d3.arc()
.innerRadius(radius - donutWidth)
.outerRadius(radius);

var pie = d3.pie()
.value(function (d) { return d.skills.length; })
.sort(null);

var svg = d3.select("#donut")
.attr("width", width)
.attr("height", height);

function resetSkills () {
	d3.select("#skill_category")
	.text("All skills");

	d3.select("#skill_list")
	.html(htmlString);

	d3.select("#skill_list")
	.style("column-count", 2);
}

function getCategoryString (category) {
	if (category == "app")
		return "App development";
	if (category == "software")
		return "Software engineering";
	return "Web development";
}

function updateSkills (id) {
	var skillData = [];

	if (id == "app")
		skillData = data[2];
	if (id == "software")
		skillData = data[1];
	if (id == "web")
		skillData = data[0];

	d3.select("#skill_category")
	.text(getCategoryString(skillData.category));

	d3.select("#skill_list")
	.html(skillData.skills.toString().replace(/,/g, "<br>"));

	if (skillData.category != "software") {
		d3.select("#skill_list")
		.style("column-count", 1);
	}
}

labelGroup = svg.append("g")
.on("mouseleave", function () {
	resetSkills();
});

labelGroup.append("rect")
.attr("x", 107)
.attr("y", 152)
.attr("width", 168)
.attr("height", 68)
.attr("pointer-events", "all")
.style("cursor", "pointer")
.style("fill", "none");

function appendCircle (id, cx, cy, fill) {
	labelGroup.append("circle")
	.attr("id", id + "_circle")
	.attr("cx", cx)
	.attr("cy", cy)
	.attr("r", 8)
	.style("fill", fill)
	.on("mouseover", function () {
		d3.select(this)
		.style("cursor", "pointer")
		.style("opacity", 0.9);

		d3.select("#" + id + "_arc")
		.style("opacity", 0.9);

		updateSkills(id);
	})
	.on("mouseout", function () {
		d3.select(this)
		.style("opacity", 1.0);

		d3.select("#" + id + "_arc")
		.style("opacity", 1.0);

		//resetSkills();
	});
}

appendCircle("app", 115, 160, "#2dcad8");
appendCircle("software", 115, 185, "#fc7a23");
appendCircle("web", 115, 210, "#555555");

function appendText (id, x, y, text) {
	labelGroup.append("text")
	.attr("id", id + "_text")
	.attr("x", x)
	.attr("y", y)
	.style("text-anchor", "start")
	.style("alignment-baseline", "middle")
	.style("font-family", "'Raleway', sans-serif")
	.style("font-size", 14)
	.text(text)
	.on("mouseover", function () {
		d3.select(this)
		.style("cursor", "pointer");

		d3.select("#" + id + "_circle")
		.style("opacity", 0.9);

		d3.select("#" + id + "_arc")
		.style("opacity", 0.9);

		updateSkills(id);
	})
	.on("mouseout", function () {
		d3.select("#" + id + "_circle")
		.style("opacity", 1.0);

		d3.select("#" + id + "_arc")
		.style("opacity", 1.0);

		//resetSkills();
	});
}

appendText("app", 135, 160, "App development");
appendText("software", 135, 185, "Software engineering");
appendText("web", 135, 210, "Web development");

var path = svg.selectAll("path")
.data(pie(data))
.enter()
.append("path")
.attr("id", function (d) {
	if (d.data.category == "app")
		return "app_arc";
	if (d.data.category == "software")
		return "software_arc";
	return "web_arc";
})
.attr("d", arc)
.attr("transform", "translate(" + (width / 2) + ", " + (height / 2) + ")")
.attr("fill", function (d) {
	if (d.data.category == "app")
		return "#2dcad8";
	if (d.data.category == "software")
		return "#fc7a23";
	return "#555555";
})
.on("mouseover", function (d) {
	d3.select(this)
	.style("opacity", 0.9)
	.style("cursor", "pointer");

	if (d.data.category == "app")
		d3.select("#app_circle").style("opacity", 0.9);
	if (d.data.category == "software")
		d3.select("#software_circle").style("opacity", 0.9);
	else
		d3.select("#web_circle").style("opacity", 0.9);

	d3.select("#skill_category")
	.text(getCategoryString(d.data.category));

	d3.select("#skill_list")
	.html(d.data.skills.toString().replace(/,/g, "<br>"));

	if (d.data.category != "software") {
		d3.select("#skill_list")
		.style("column-count", 1);
	}
})
.on("mouseout", function () {
	d3.select(this)
	.style("opacity", 1.0);

	d3.selectAll("circle")
	.style("opacity", 1.0);

	resetSkills();
});
