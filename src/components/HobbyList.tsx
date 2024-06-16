import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { Hobby } from "@/types";

function HobbyList() {
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState<Hobby[] | null>(null);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div className="relative bg-white p-6 rounded shadow-lg border-2 border-gray-800 max-w-3xl mx-auto pb-16 ">

      <ToggleGroup variant="outline" type="multiple">
        {data && data.length > 0 ? (
          data.map((item) => (
            <ToggleGroupItem
              className="text-2xl"
              key={item.hobbyId}
              value={item.hobbyName}
              aria-label={item.hobbyName}
            >
              {item.hobbyName}
            </ToggleGroupItem>
          ))
        ) : (
          <p>沒有可顯示的愛好。</p>
        )}
      
      </ToggleGroup>
      <button className="absolute bottom-0 right-0 p-2 text-xl bg-blue-500 text-white rounded">
        送出
      </button>
     
    </div>
    </div>
  );
}

export default HobbyList;
