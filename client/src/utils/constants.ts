/*
 * This file holds all the app-wide constants, such as the server address, and
 * sets them to be accessible globally without imports.
 */
const constants = {
  TBA_AUTH_KEY: atob("c3NsVlhkQ3NUWnBwTXFoZUJkN01NVlN4RHJJZFV1ZjFreUk0SEZwUjJSenNZaWJkSGhGUHZMeUtsdEtyNVhIeg=="),
  SERVER_ADDRESS: import.meta.env.VITE_SERVER_ADDRESS,
  EVENT_NAME: import.meta.env.VITE_EVENTNAME,
} as const;

for(const [name, value] of Object.entries(constants)) {
  globalThis[name] = value;
}
