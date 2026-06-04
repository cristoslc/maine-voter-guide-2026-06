/** Jurisdiction registry for geographic governing areas. Required: id, name, geoRef. Optional: url, type. */
module.exports = [
  {
    id: "state-wide",
    slug: "state-wide",
    name: "State-wide",
    description: "State-wide races and ballot questions — all Maine voters",
    geoRef: "maine",
    geoScope: "state",
    county: null,
    stateSenateDistricts: [],
    stateHouseDistricts: []
  },
  {
    id: "cumberland-county",
    slug: "cumberland-county",
    name: "Cumberland County",
    description: "Cumberland County — county-level races including county commissioner",
    geoRef: "cumberland-county",
    geoScope: "county",
    county: "Cumberland",
    stateSenateDistricts: [],
    stateHouseDistricts: []
  },
  {
    id: "south-portland",
    slug: "south-portland",
    name: "South Portland",
    description: "City of South Portland, Maine",
    geoRef: "south-portland",
    geoScope: "municipal",
    county: "Cumberland",
    stateSenateDistricts: [29],
    stateHouseDistricts: [120, 121, 122]
  },
  {
    id: "portland",
    slug: "portland",
    name: "Portland",
    description: "City of Portland, Maine",
    geoRef: "portland",
    geoScope: "municipal",
    county: "Cumberland",
    stateSenateDistricts: [27, 28],
    stateHouseDistricts: [115, 116, 117, 118, 119]
  },
  {
    id: "cape-elizabeth",
    slug: "cape-elizabeth",
    name: "Cape Elizabeth",
    description: "Town of Cape Elizabeth, Maine",
    geoRef: "cape-elizabeth",
    geoScope: "municipal",
    county: "Cumberland",
    stateSenateDistricts: [],
    stateHouseDistricts: [121, 123]
  },
  {
    id: "westbrook",
    slug: "westbrook",
    name: "Westbrook",
    description: "City of Westbrook, Maine",
    geoRef: "westbrook",
    geoScope: "municipal",
    county: "Cumberland",
    stateSenateDistricts: [26, 27],
    stateHouseDistricts: [126, 127, 128]
  }
];
