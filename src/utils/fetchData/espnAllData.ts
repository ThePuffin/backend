// import { writeJsonFile } from 'write-json-file';
// import allTeamsFileMLB from '../../temporaryData/allTeamsMLB.json';
// import allTeamsFileNBA from '../../temporaryData/allTeamsNBA.json';
// import allTeamsFileNFL from '../../temporaryData/allTeamsNFL.json';
// import type { GameFormatted } from '../interface/game';
// import type { MLBGameAPI } from '../interface/gameMLB';
// import type { NBAGameAPI } from '../interface/gameNBA';
// import type { NFLGameAPI } from '../interface/gameNFL';
import type { ESPNTeam, TeamESPN, TeamType } from '../interface/team';
// import { isExpiredData, readableDate } from '../utils/date.js';
import { League } from '../enum';
// import { getNBASchedule, filterGamesByTeam } from './nbaSchedule';
const { NODE_ENV } = process.env;

const leaguesData = {
  [League.MLB]: {
    leagueName: League.MLB,
    fetchTeam:
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams',
    fetchGames:
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/${id}/schedule',
    fetchDetails:
      'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/',
  },
  [League.NBA]: {
    leagueName: League.NBA,
    fetchTeam:
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams',
    fetchGames:
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/${id}/schedule',
    fetchDetails:
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/',
  },
  [League.NFL]: {
    leagueName: League.NFL,
    fetchTeam:
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams',
    fetchGames:
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${id}/schedule',
    fetchDetails:
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/',
  },
};

const getDivision = async (
  leagueName: string,
  id: string,
): Promise<{ conferenceName: string; divisionName: string }> => {
  const url = leaguesData[leagueName].fetchDetails + id;
  const fetchedTeams = await fetch(url);
  const fetchTeams = await fetchedTeams.json();
  const { standingSummary = '' } = fetchTeams.team;
  const cut = standingSummary.split(' ');
  if (leagueName === League.NFL) {
    return { conferenceName: cut[3] || '', divisionName: cut[2] || '' };
  } else if (leagueName === League.NBA) {
    const divisionName = cut[2] || '';
    const conference = {
      Atlantic: 'East',
      Central: 'East',
      Northwest: 'West',
      Pacific: 'West',
    };
    return { conferenceName: conference[divisionName] || '', divisionName };
  } else if (leagueName === League.MLB) {
    return { conferenceName: cut[3] || '', divisionName: cut[2] || '' };
  } else {
    return { conferenceName: '', divisionName: '' };
  }
};

export const getESPNTeams = async (leagueName: string): Promise<TeamType[]> => {
  try {
    let allTeams: ESPNTeam[];

    const fetchedTeams = await fetch(leaguesData[leagueName].fetchTeam);
    const fetchTeams: TeamESPN = await fetchedTeams.json();
    const { sports } = fetchTeams;
    const { leagues } = sports[0];
    allTeams = leagues[0].teams;

    const activeTeams: TeamType[] = allTeams
      .filter(({ team }) => team.isActive)
      .sort((a, b) => (a.team.slug > b.team.slug ? 1 : -1))
      .map(({ team }) => {
        const { abbreviation, displayName, logos, nickname, id } = team;
        const teamID = abbreviation;
        const uniqueId = `${leagueName}-${teamID}`;
        return {
          uniqueId,
          value: uniqueId,
          id: id,
          abbrev: teamID,
          label: displayName,
          teamLogo: logos[0].href,
          teamCommonName: nickname,
          conferenceName: '',
          divisionName: '',
          league: leagueName,
        };
      });

    for (const team of activeTeams) {
      const { conferenceName, divisionName } = await getDivision(
        leagueName,
        team.id,
      );
      team.conferenceName = conferenceName;
      team.divisionName = divisionName;
    }

    return activeTeams;
  } catch (error) {
    console.error('Error fetching data =>', error);
    return [];
  }
};

// export const getTeamsSchedule = async (leagueName) => {
//   const allGames = {};
//   const activeTeams: TeamType[] = await db.select().from(Teams).where(eq(Teams.league, leagueName));
//   await Promise.all(
//     activeTeams.map(async ({ id, abbrev, value }) => {
//       const leagueID = `${leagueName}-${id}`;
//       allGames[leagueID] = await getEachTeamSchedule({
//         id,
//         abbrev,
//         value,
//         leagueName,
//       });
//     })
//   );

//   if (NODE_ENV === 'development') {
//     const firstKey = activeTeams[0]?.id;

//     const teamgames = await db.select().from(Games).where(eq(Games.teamSelectedId, firstKey)).limit(1);

//     const updateDate = (firstKey && teamgames[0]?.updateDate) || new Date('2020-02-20');
//     const expiredData = isExpiredData(updateDate);
//     for (const team of Object.keys(allGames)) {
//       if (allGames[team].length === 0) {
//         delete allGames[team];
//       }
//     }

//     if (expiredData && Object.keys(allGames).length > 0) {
//       await writeJsonFile(`./temporaryData/updatecurrentSeason${leagueName}.json`, allGames);
//       console.log(`updated updatecurrentSeason${leagueName}.json`);
//     }
//   }
//   console.log(`updated ${leagueName}`);
//   return allGames;
// };

// const getEachTeamSchedule = async ({ id, abbrev, value, leagueName }) => {
//   try {
//     const teamGames = await db.select().from(Games).where(eq(Games.teamSelectedId, value));

//     if (teamGames.length && teamGames[0]?.updateDate && !isExpiredData(teamGames[0]?.updateDate)) {
//       return teamGames.map((game: GameFormatted) => {
//         delete game.updateDate;
//         return game;
//       });
//     }

//     let games;
//     try {
//       const link = leaguesData[leagueName].fetchGames.replace('${id}', id);
//       const fetchedGames = await fetch(link);
//       const fetchGames: MLBGameAPI | NBAGameAPI | NFLGameAPI = await fetchedGames.json();
//       games = fetchGames?.events?.length && fetchGames.events[0] ? fetchedGames : [];
//       console.log('yes', value);
//     } catch (error) {
//       console.log('no', value, error);
//       games = [];
//     }

//     let gamesData = [];
//     if (!games.length) {
//       if (leagueName === League.NBA) {
//         gamesData = filterGamesByTeam(abbrev, value);
//       }
//     } else {
//       let number = 0;
//       const now = new Date();

//       gamesData = games.map((game) => {
//         const { date, competitions } = game;

//         if (new Date(date) < now) return;
//         const { venue, competitors } = competitions[0];
//         const venueTimezone = 'America/New_York';
//         const gameDate = readableDate(new Date(date));
//         const currentDate = new Date(new Date(date).toLocaleString('en-US', { timeZone: venueTimezone }));
//         const hourStart = currentDate.getUTCHours().toString().padStart(2, '0');
//         const minStart = currentDate.getMinutes().toString().padStart(2, '0');
//         const timeStart = `${hourStart}:${minStart}`;

//         const awayTeam = competitors.find((team) => team.homeAway === 'away');
//         const homeTeam = competitors.find((team) => team.homeAway === 'home');
//         number++;
//         return {
//           uniqueIdleagueName}.${id}.${gameDate}.${number}`,
//           arenaName: venue?.fullName || '',
//           awayTeamId: awayTeam.team.abbreviation,
//           awayTeam: awayTeam.team.displayName,
//           awayTeamShort: awayTeam.team.abbreviation,
//           homeTeam: homeTeam.team.displayName,
//           homeTeamId: homeTeam.team.abbreviation,
//           homeTeamShort: homeTeam.team.abbreviation,
//           gameDate: gameDate,
//           teamSelectedId: value,
//           show: homeTeam.team.abbreviation === abbrev,
//           selectedTeam: homeTeam.team.abbreviation === abbrev,
//           league: leagueName,
//           venueTimezone,
//           timeStart,
//         };
//       });
//     }

//     gamesData = gamesData.filter((game) => game !== undefined && game !== null);
//     gamesData.forEach(async (gameTeam: GameFormatted) => {
//       const { uniqueIdgameData } = gameTeam;
//       await db
//         .insert(Games)
//         .values({ ...gameTeam })
//         .onConflictDoUpdate({
//           target: Games.uniqueId
//           set: {
//             ...gameData,
//           },
//         });
//     });

//     return gamesData;
//   } catch (error) {
//     console.log('Error fetching data', error);
//     return {};
//   }
// };
