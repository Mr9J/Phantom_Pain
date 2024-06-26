import axios from "axios";

const API_KEY = import.meta.env.VITE_MUMU_PROTECT;
const endpoint = "https://mumuprotect.cognitiveservices.azure.com/";

const AzureTextAnalyze = async (text: string) => {
  const res = await axios.post(
    `${endpoint}/contentsafety/text:analyze?api-version=2024-02-15-preview`,
    { text: text, categories: ["Hate"] },
    {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
    }
  );

  if (res.data.categoriesAnalysis[0].severity > 1) {
    return false;
  } else {
    return true;
  }
};

export default AzureTextAnalyze;
