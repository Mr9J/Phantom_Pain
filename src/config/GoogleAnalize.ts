import axios from "axios";

const API_KEY = "AIzaSyBrsOcVhb2UbNHqRkjb7zn5CFJDp8g0gJ8";
const API_URL =
  "https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment";

const GoogleAnalize = async (text: string) => {
  console.log(text);

  const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
    document: {
      type: "PLAIN_TEXT",
      content: text,
    },
  });

  response.data.entities.map((data) => {
    if (data.sentiment.score < 0) {
      console.log("false");
      return false;
    }

    console.log("false");
    return true;
  });
};

export default GoogleAnalize;
