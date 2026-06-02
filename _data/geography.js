module.exports = [
  { id: "maine", name: "Maine", type: "state", parent: null, aliases: ["State of Maine"] },
  { id: "cumberland-county", name: "Cumberland County", type: "county", parent: "maine", aliases: ["Cumberland County", "Cumberland Cty"] },
  { id: "south-portland", name: "South Portland", type: "municipality", parent: "cumberland-county", aliases: [] },
  { id: "portland", name: "Portland", type: "municipality", parent: "cumberland-county", aliases: [] },
  { id: "cape-elizabeth", name: "Cape Elizabeth", type: "municipality", parent: "cumberland-county", aliases: [] },
  { id: "westbrook", name: "Westbrook", type: "municipality", parent: "cumberland-county", aliases: [] }
];