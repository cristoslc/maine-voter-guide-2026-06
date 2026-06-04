/** Election metadata for the single election event definition. Required: date, type, name, jurisdiction. */
module.exports = {
  id: "2026-06-primary",
  title: "June 2026 State Primary Election & School Budget Referendum",
  date: new Date("2026-06-09T00:00:00-04:00"), // EDT — use explicit timezone to avoid UTC date offset
  type: "primary",
  keyDates: [
    { date: "2026-05-11", description: "Absentee ballots available; in-person absentee voting begins at City Hall", source: "South Portland City Clerk", type: "absentee-voting" },
    { date: "2026-05-19", description: "Last day to register online or by mail (by 5 PM)", source: "Maine Secretary of State", type: "registration" },
    { date: "2026-06-02", description: "Last day to register at BMV", source: "Maine Secretary of State", type: "registration" },
    { date: "2026-06-04", description: "Last day to request absentee ballot", source: "South Portland City Clerk", type: "absentee-request" },
    { date: "2026-06-09", description: "Election Day — polls open 7 AM to 8 PM", source: "South Portland City Clerk", type: "election-day" }
  ]
};
