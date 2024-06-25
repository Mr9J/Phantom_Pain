// src/components/service/SignalRConnection.ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://mumumsit158.azurewebsites.net/ChatHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start().catch(err => console.error("Connection failed: ", err.toString()));

export default connection;
