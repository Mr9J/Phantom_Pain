import Ad from "@/components/Ad";
import React from "react";

const home = () => {
  return (
    <>
      <Ad id={"1"}></Ad>
      <iframe
        id="online-alarm-kur-iframe"
        src="https://embed-countdown.onlinealarmkur.com/zh-tw/#2024-06-21T00:00:00@Asia%2FTaipei"
        width="1800"
        height="400"
        style={{
          display: "block",
          margin: "0px auto",
          border: "0px",
          overflow: "hidden",
        }}
      ></iframe>
      <div style={{ textAlign: "center" }}>
        <a href="/admin">
          <img
            src="https://img.4gamers.com.tw/puku-clone-version/a2879bf530207c11234fbba1864d1cc0703cd9b3.png"
            alt=""
            style={{ width: 800, height: "auto" }}
          />
        </a>
      </div>
    </>
  );
};

export default home;
