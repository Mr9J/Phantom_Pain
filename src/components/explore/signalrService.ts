import * as signalR from "@microsoft/signalr";

const BACK_URL = import.meta.env.VITE_BACK_URL;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(BACK_URL + "/Comments", {
    accessTokenFactory: () => {
      const token = localStorage.getItem("token");
      // console.log("Token", token);
      return token ? token : "";
    },
  })
  .build();

connection
  .start()
  .then(() => console.log("Connection started", connection))
  .catch((err) => console.error(err.toString()));

export default connection;
