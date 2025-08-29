const NUM_ALLIANCES = 2;
const TEAMS_PER_ALLIANCE = 3;

function round(num : number, prec? : number = 3) {
  if(prec === undefined) {
    prec = 3;
  }
  return Math.round(num * 10 ** prec) / 10 ** prec;
}


export {
  NUM_ALLIANCES,
  TEAMS_PER_ALLIANCE,
  round,
};
