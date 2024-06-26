import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded shadow-lg border-2 border-gray-800 max-w-3xl mx-auto pb-16 text-2xl dark:bg-gray-800 dark:text-white dark:border-gray-600">
        請問您對以下哪些類別有興趣?
        <ToggleGroup variant="outline" type="multiple">
          {data && data.length > 0 ? (
            data.map((item) => (
              <ToggleGroupItem
                key={item.hobbyId}
                className={`text-2xl py-2 px-4 rounded-md transition-colors duration-300 bg-transparent border-2 ${
                  selectedHobbies.includes(item.hobbyId)
                    ? "bg-gray-800 text-white border-gray-600"
                    : "border-transparent hover:bg-gray-700 hover:text-white hover:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500"
                }`}
                value={item.hobbyId.toString()} // 這裡確保 value 是字串型態
                aria-label={item.hobbyName}
                onClick={() => handleSelection(item.hobbyId)}
              >
                {item.hobbyName}
              </ToggleGroupItem>
            ))
          ) : (
            <p>沒有可顯示的愛好。</p>
          )}
        </ToggleGroup>
        <button
          className="absolute bottom-0 right-0 p-2 text-xl bg-blue-500 text-white rounded"
          onClick={handleSubmit}
        >
          送出
        </button>
      </div>
    </div>
  );
}

export default HobbyList;
