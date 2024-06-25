// src/components/service/SignalRConnection.ts
import * as signalR from "@microsoft/signalr";

// 構建完整的 URL
const hubUrl = `${import.meta.env.VITE_BACK_URL}/ChatHub`;

console.log('Connecting to SignalR hub at:', hubUrl);

const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.start()
    .then(() => console.log('SignalR connection established'))
    .catch(err => console.error("Connection failed: ", err.toString()));

connection.onclose(error => {
    console.error('Connection closed due to error:', error);
    setTimeout(() => connection.start(), 5000); // 重連機制
});

export default connection;
