import axios from "axios";

const GoogleImgAnalize = async (imgUrl: string) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
  const API_URL = "https://vision.googleapis.com/v1/images:annotate";

  console.log(imgUrl);

  const res = await axios.post(`${API_URL}?key=${API_KEY}`, {
    requests: [
      {
        image: {
          content: "gs://cloud-samples-data/vision/label/setagaya.jpeg",
        },
        features: [
          {
            maxResults: 3,
            type: "LABEL_DETECTION",
          },
        ],
      },
    ],
  });

  console.log(res.data);

  return null;
};

export default GoogleImgAnalize;
