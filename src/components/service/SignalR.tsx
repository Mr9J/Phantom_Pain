// src/components/service/SignalRConnection.ts
import * as signalR from "@microsoft/signalr";

// 使用環境變量設定 SignalR 連接 URL
const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_BACK_URL}ChatHub`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start().catch(err => console.error("Connection failed: ", err.toString()));

export default connection;
