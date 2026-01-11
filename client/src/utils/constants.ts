import type * as TbaApi from '../types/tbaApi';

const CONSTANTS = {
  TBA_AUTH_KEY: atob("c3NsVlhkQ3NUWnBwTXFoZUJkN01NVlN4RHJJZFV1ZjFreUk0SEZwUjJSenNZaWJkSGhGUHZMeUtsdEtyNVhIeg=="),
  SERVER_ADDRESS: import.meta.env.VITE_SERVER_ADDRESS as string,
	EVENT_KEY: import.meta.env.VITE_EVENT_KEY as TbaApi.EventKey,
	NUM_ALLIANCES: 2,
	TEAMS_PER_ALLIANCE: 3,
} as const;

export default CONSTANTS;
