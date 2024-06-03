import React, { useState } from "react";

const PlayGround = () => {
  const [index, setIndex] = useState<number>(1);

  return (
    <div className="flex w-full">
      <input
        type="number"
        onChange={(e) => {
          setIndex(Number(e.currentTarget.value));
        }}
      />
      <img
        src={`https://cdn.mumumsit158.com/member_thumbnail%2FMemberID-${index}-ThumbNail.jpg`}
        alt=""
        className="w-[500px]"
      />
    </div>
  );
};

export default PlayGround;
