import React from "react";

type TruncateTextProps = {
  content: string;
  maxLength: number;
  textStyles: string;
};

const TruncateText: React.FC<TruncateTextProps> = ({
  content,
  maxLength,
  textStyles,
}) => {
  const truncated =
    content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;

  return <p className={`${textStyles}`}>{truncated}</p>;
};

export default TruncateText;
