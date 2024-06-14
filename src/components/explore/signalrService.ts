import * as signalR from "@microsoft/signalr";

const BACK_URL = import.meta.env.VITE_BACK_URL;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(BACK_URL + "/Comments")
  .withAutomaticReconnect()
  .build();

connection
  .start()
  .then(() => console.log("Connection started"))
  .catch((err) => console.error(err.toString()));

export default connection;
