/** Party registry with display names and standard US party color conventions. Required: id, tag, fullName, shortName. Optional: color. Colors sourced from Wikipedia "Political colour" conventions. */
module.exports = [
  {
    id: "democrat",
    tag: "d",
    fullName: "Democratic Party",
    shortName: "Democratic",
    color: "#0015BC"
  },
  {
    id: "republican",
    tag: "r",
    fullName: "Republican Party",
    shortName: "Republican",
    color: "#E81B23"
  },
  {
    id: "green",
    tag: "g",
    fullName: "Green Independent Party",
    shortName: "Green",
    color: "#17A81A"
  },
  {
    id: "libertarian",
    tag: "l",
    fullName: "Libertarian Party",
    shortName: "Libertarian",
    color: "#FFD700"
  }
];
