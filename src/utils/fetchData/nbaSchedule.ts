// import { League } from './enum.ts';
// const venueTimezone = 'America/New_York';
// import { readableDate } from '../utils/date.js';
// let gameDates = [];

// export const getNBASchedule = async () => {
//   const scheduleEndpoint = 'https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json';
//   const fetchSchedule = await fetch(scheduleEndpoint);
//   const { leagueSchedule } = await fetchSchedule.json();
//   if (leagueSchedule.gameDates.length) {
//     gameDates = leagueSchedule.gameDates;
//   }
// };

// export const filterGamesByTeam = (team, value) => {
//   const teamTricodeMap = {
//     GS: 'GSW',
//     NO: 'NOP',
//     NY: 'NYK',
//     SA: 'SAS',
//     UTAH: 'UTA',
//     WSH: 'WAS',
//   };
//   const inverseTeamTricodeMap = {
//     GSW: 'GS',
//     NOP: 'NO',
//     NYK: 'NY',
//     SAS: 'SA',
//     UTA: 'UTAH',
//     WAS: 'WSH',
//   };

//   const teamTricode = teamTricodeMap[team] || team;

//   return gameDates
//     .map(({ gameDate, games }) => {
//       const filterGame = games.filter(
//         (game) => game.homeTeam.teamTricode === teamTricode || game.awayTeam.teamTricode === teamTricode
//       );
//       if (filterGame.length) {
//         const gameDateRead = readableDate(new Date(gameDate));
//         const { gameCode, arenaName, homeTeam, awayTeam } = filterGame[0];
//         const awayAbbrev = inverseTeamTricodeMap[awayTeam.teamTricode] || awayTeam.teamTricode;
//         const homeAbbrev = inverseTeamTricodeMap[homeTeam.teamTricode] || homeTeam.teamTricode;

//         const dateString = '2025-04-13T13:00:00Z';
//         const date = new Date(dateString);

//         const hourStart = date.getHours();
//         const minStart = date.getMinutes();

//         return {
//           uniqueId: `${value}${gameCode}`,
//           arenaName: arenaName || '',
//           awayTeamId: awayAbbrev,
//           awayTeam: `${awayTeam.teamCity} ${awayTeam.teamName}`,
//           awayTeamShort: awayAbbrev,
//           homeTeam: `${homeTeam.teamCity} ${homeTeam.teamName}`,
//           homeTeamId: homeAbbrev,
//           homeTeamShort: homeAbbrev,
//           gameDate: gameDateRead,
//           teamSelectedId: value,
//           show: homeAbbrev === team,
//           selectedTeam: homeAbbrev === team,
//           league: League.NBA,
//           venueTimezone,
//           timeStart: `${hourStart}:${minStart}`,
//         };
//       }
//     })
//     .filter((game) => game?.uniqueId
// };
