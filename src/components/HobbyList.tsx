import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";
import { Hobby } from "@/types";

interface HobbyListProps {
  onClose: () => void;
  fetchProjectCards: () => void;
}

function HobbyList({ onClose,fetchProjectCards }:HobbyListProps) {
  const { user } = useUserContext();
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Hobby[]>(`${URL}/Hobby`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching hobbies:", error);
      }
    };

    fetchData();
  }, [URL]);

  const handleSelection = (hobbyId: number) => {
    setSelectedHobbies((prevSelectedHobbies) => {
      if (prevSelectedHobbies.includes(hobbyId)) {
        return prevSelectedHobbies.filter((id) => id !== hobbyId);
      } else {
        return [...prevSelectedHobbies, hobbyId];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const userid = user.id;
      const response = await axios.post(`${URL}/Hobby`, {
        userId: userid,
        hobbyIds: selectedHobbies,
      });

      if (response.status === 200) {
        onClose?.(); // 提交成功後關閉興趣選擇界面
        fetchProjectCards(); // 更新推薦專案數據
      }
    } catch (error) {
      console.error("Error submitting hobbies:", error);
    }
  };

  return (
<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
  <div className="relative bg-white p-4 sm:p-6 rounded shadow-lg border-2 border-gray-800 w-full max-w-3xl mx-auto pb-16 text-base sm:text-xl md:text-2xl text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-600 overflow-y-auto max-h-[90vh]">
    <h2 className="mb-4 text-lg sm:text-xl md:text-2xl font-semibold">請問您對以下哪些類別有興趣?</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
      {data && data.length > 0 ? (
        data.map((item) => (
          <button
            key={item.hobbyId}
            className={`text-sm sm:text-base md:text-lg py-2 px-3 rounded-md transition-colors duration-300 border-2 ${
              selectedHobbies.includes(item.hobbyId)
                ? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600"
                : "bg-transparent text-gray-800 border-gray-300 hover:bg-gray-100 hover:border-gray-400 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
            }`}
            onClick={() => handleSelection(item.hobbyId)}
          >
            {item.hobbyName}
          </button>
        ))
      ) : (
        <p className="col-span-full">沒有可顯示的愛好。</p>
      )}
    </div>
    <button
      className="absolute bottom-4 right-4 p-2 text-base sm:text-lg bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
      onClick={handleSubmit}
    >
      送出
    </button>
  </div>
</div>
  );
}

export default HobbyList;
