import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { Hobby } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import axios from "axios";

function HobbyList({ onClose }) {
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>([]);
  const { user } = useUserContext();

 
//簡單來說React為了避免你的方法引用參數被改變 會建議你寫在內部
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/Hobby`);
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
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
        onClose?.();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded shadow-lg border-2 border-gray-800 max-w-3xl mx-auto pb-16 text-2xl dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        請問您對以下哪些類別有興趣?
        <ToggleGroup variant="outline" type="multiple">
          {data && data.length > 0 ? (
            data.map((item) => (
              <ToggleGroupItem
                className="text-2xl"
                key={item.hobbyId}
                value={item.hobbyName}
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
