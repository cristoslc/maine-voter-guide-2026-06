/** Office registry for elected positions. Required: id, title, type. Optional: aliases, extends, districtNote, officeDesc. */
module.exports = [
  {
    id: "us-senate",
    title: "US Senate",
    officerTitle: "US Senator",
    aliases: ["US Senate"],
    jurisdiction: "state-wide",
    termLength: "6 years",
    termLimit: null,
    seatsAvailable: null,
    officeDesc: "Creates federal law with the House. Votes on Supreme Court justices and federal judges. Approves treaties and cabinet officials. Controls federal spending — including directing dollars to Maine for roads, bridges, military installations, and healthcare. One senator can block legislation via holds and filibusters. Six-year term.",
    type: "partisan"
  },
  {
    id: "governor",
    title: "Governor",
    officerTitle: "Governor",
    aliases: ["Governor"],
    jurisdiction: "state-wide",
    termLength: "4 years",
    termLimit: "2 consecutive terms",
    seatsAvailable: 1,
    officeDesc: "Proposes and executes Maine's $10 billion state budget — that's your property taxes, your kid's school funding, your road paving, your healthcare. Appoints hundreds of officials who run state agencies. Signs or vetoes every bill passed by the Legislature. Commands the Maine National Guard. Declares emergencies. Four-year term. Incumbent Janet Mills (D) is term-limited after two consecutive terms.",
    type: "partisan"
  },
  {
    id: "us-representative",
    title: "US Representative",
    officerTitle: "US Representative",
    officeDesc: "Votes on federal laws and the federal budget. All spending bills originate in the House. Your representative votes on: healthcare, Social Security, taxes, immigration, foreign policy, and the federal budget that directly impacts Maine. Two-year term.",
    type: "partisan",
    termLength: "2 years",
    termLimit: null,
    seatsAvailable: null
  },
  {
    id: "us-representative-cd1",
    extends: "us-representative",
    title: "US Representative — Congressional District 1",
    aliases: ["US Representative"],
    jurisdiction: "state-wide",
    seatsAvailable: 1
  },
  {
    id: "state-senator",
    title: "State Senator",
    officerTitle: "State Senator",
    officeDesc: "One of 35 senators in Augusta. Votes on the two-year state budget and every state law. Your senator's vote determines: how much state money your schools receive, your property tax relief, environmental regulations, healthcare policy, and housing laws.",
    type: "partisan",
    termLength: "2 years",
    termLimit: null,
    seatsAvailable: 1
  },
  {
    id: "state-senator-29",
    extends: "state-senator",
    title: "State Senator — District 29",
    aliases: ["State Senator"],
    jurisdiction: "south-portland",
    districtNote: "District 29 covers Cape Elizabeth, South Portland, and part of Scarborough."
  },
  {
    id: "state-senate-27",
    extends: "state-senator",
    title: "State Senate District 27",
    aliases: ["State Senate District 27"],
    jurisdiction: "portland",
    districtNote: "Portland's southern Senate district (Peaks Island, West End, South Portland border)."
  },
  {
    id: "state-senate-28",
    extends: "state-senator",
    title: "State Senate District 28",
    aliases: ["State Senate District 28"],
    jurisdiction: "portland",
    districtNote: "Portland's northern Senate district (Bayside, East End, North Deering)."
  },
  {
    id: "state-senate-26",
    extends: "state-senator",
    title: "State Senate District 26",
    aliases: ["State Senate District 26"],
    jurisdiction: "westbrook",
    districtNote: "Westbrook's eastern Senate district (covers Westbrook, Windham, part of Gorham)."
  },
  {
    id: "state-representative",
    title: "State Representative",
    officerTitle: "State Representative",
    officeDesc: "One of 151 representatives in Augusta. Votes on every state law and the state budget. Your representative is your closest elected official — the one most likely to answer your call about a local issue. They vote on: the school funding formula, property tax relief programs, minimum wage and labor laws, environmental regulations, housing policy.",
    type: "partisan",
    termLength: "2 years",
    termLimit: null,
    seatsAvailable: null
  },
  {
    id: "state-representative-sp",
    extends: "state-representative",
    title: "State Representative — South Portland",
    aliases: ["State Representative"],
    jurisdiction: "south-portland",
    districtNote: "South Portland is split into three districts."
  },
  {
    id: "state-house-115",
    extends: "state-representative",
    title: "State House District 115",
    aliases: ["State House District 115"],
    jurisdiction: "portland",
    seatsAvailable: 1,
    districtNote: "Portland's East End / Munjoy Hill / Bayside district."
  },
  {
    id: "state-house-116",
    extends: "state-representative",
    title: "State House District 116",
    aliases: ["State House District 116"],
    jurisdiction: "portland",
    seatsAvailable: 1,
    districtNote: "Portland's Back Cove / North Deering district."
  },
  {
    id: "state-house-117",
    extends: "state-representative",
    title: "State House District 117",
    aliases: ["State House District 117"],
    jurisdiction: "portland",
    seatsAvailable: 1,
    districtNote: "Portland's Parkside / West End district."
  },
  {
    id: "state-house-118",
    extends: "state-representative",
    title: "State House District 118",
    aliases: ["State House District 118"],
    jurisdiction: "portland",
    seatsAvailable: 1,
    districtNote: "Portland's Riverton / Stroudwater district."
  },
  {
    id: "state-house-119",
    extends: "state-representative",
    title: "State House District 119",
    aliases: ["State House District 119"],
    jurisdiction: "portland",
    seatsAvailable: 1,
    districtNote: "Portland's Deering Center / North Deering district. Open seat — incumbent Mark BL Espling not running."
  },
  {
    id: "state-house-123",
    extends: "state-representative",
    title: "State House District 123",
    aliases: ["State House District 123"],
    jurisdiction: "cape-elizabeth",
    seatsAvailable: 1,
    districtNote: "Cape-Elizabeth-only district (Cape Elizabeth is split with HD 121)."
  },
  {
    id: "state-house-121",
    extends: "state-representative",
    title: "State House District 121",
    aliases: ["State House District 121"],
    jurisdiction: "cape-elizabeth",
    seatsAvailable: 1,
    districtNote: "Open seat — incumbent Rep. Christopher Kessler (D-South Portland) is term-limited."
  },
  {
    id: "state-house-126",
    extends: "state-representative",
    title: "State House District 126",
    aliases: ["State House District 126"],
    jurisdiction: "westbrook",
    seatsAvailable: 1,
    districtNote: "Westbrook district."
  },
  {
    id: "state-house-127",
    extends: "state-representative",
    title: "State House District 127",
    aliases: ["State House District 127"],
    jurisdiction: "westbrook",
    seatsAvailable: 1,
    districtNote: "Westbrook district."
  },
  {
    id: "state-house-128",
    extends: "state-representative",
    title: "State House District 128",
    aliases: ["State House District 128"],
    jurisdiction: "westbrook",
    seatsAvailable: 1,
    districtNote: "Westbrook district."
  },
  {
    id: "state-house-120",
    extends: "state-representative",
    title: "State House District 120",
    aliases: ["State House District 120"],
    jurisdiction: "south-portland",
    seatsAvailable: 1,
    districtNote: "South Portland District 120 (westside). Open seat — incumbent Rep. Deqa Dhalac is not seeking re-election."
  },
  {
    id: "state-house-122",
    extends: "state-representative",
    title: "State House District 122",
    aliases: ["State House District 122"],
    jurisdiction: "south-portland",
    seatsAvailable: 1,
    districtNote: "South Portland District 122 (eastside)."
  },
  {
    id: "county-commissioner",
    title: "County Commissioner",
    officerTitle: "County Commissioner",
    officeDesc: "One of three County Commissioners. Oversees the county budget, sheriff's office, regional jail, emergency management, and infrastructure.",
    type: "partisan",
    termLength: "4 years",
    termLimit: null,
    seatsAvailable: 1
  },
  {
    id: "cumberland-county-commissioner-4",
    extends: "county-commissioner",
    title: "Cumberland County Commissioner — District 4",
    aliases: ["Cumberland County Commissioner District 4"],
    jurisdiction: "cumberland-county",
    districtNote: "Covers Cape Elizabeth, South Portland, and part of Portland."
  }
];
