import axios from "axios";

const API_KEY = import.meta.env.VITE_MUMU_PROTECT;
const endpoint = "https://mumuprotect.cognitiveservices.azure.com/";

const AzureImgAnalyze = async (textArray: string[]) => {
  const promises = textArray.map((text) =>
    axios.post(
      `${endpoint}/contentsafety/image:analyze?api-version=2024-02-15-preview`,
      {
        image: {
          content: text,
        },
        categories: ["Hate"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": API_KEY,
        },
      }
    )
  );

  const results = await Promise.all(promises);

  results.forEach((res) => {
    console.log(res.data.categoriesAnalysis[0].severity);
    if (res.data.categoriesAnalysis[0].severity >= 2) {
      return false;
    } else {
      return true;
    }
  });
};

export default AzureImgAnalyze;
