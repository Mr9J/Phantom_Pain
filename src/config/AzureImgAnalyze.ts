import axios from "axios";

const API_KEY = import.meta.env.VITE_MUMU_PROTECT;
const endpoint = "https://mumuprotect.cognitiveservices.azure.com/";

const AzureImgAnalyze = async (text: string) => {
  const res = await axios.post(
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
  );

  if (res.data.categoriesAnalysis[0].severity >= 2) {
    return false;
  }

  if (res.data.categoriesAnalysis[1].severity >= 2) {
    return false;
  }

  if (res.data.categoriesAnalysis[2].severity >= 2) {
    return false;
  }
  if (res.data.categoriesAnalysis[3].severity >= 2) {
    return false;
  }

  return true;
};

export default AzureImgAnalyze;
