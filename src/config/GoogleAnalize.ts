import axios from "axios";

const API_KEY = "AIzaSyBrsOcVhb2UbNHqRkjb7zn5CFJDp8g0gJ8";
const API_URL =
  "https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment";

const GoogleAnalize = async (text: string) => {
  let validate = true;
  const res = await axios.post(`${API_URL}?key=${API_KEY}`, {
    document: {
      type: "PLAIN_TEXT",
      content: text,
    },
  });

  console.log(res.data.entities);
  console.log(res.data.entities.length);

  if (res.data.entities.length === 0) {
    validate = true;
    return validate;
  }

  res.data.entities.forEach((entity) => {
    if (entity.sentiment.score < 0) {
      validate = false;
    }
  });

  return validate;
};

export default GoogleAnalize;
