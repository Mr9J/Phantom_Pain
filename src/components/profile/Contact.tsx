import { UserProfile } from "@/types";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Button } from "../ui/button";
import Directions from "../shared/Directions";
import { useToast } from "../ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { useSetContactInfo } from "@/lib/react-query/queriesAndMutation";
import { Input } from "../ui/input";

type ContactProps = {
  id: string;
  user?: UserProfile;
};

const Contact = ({ id, user }: ContactProps) => {
  const { user: currentUser } = useUserContext();
  const [search, setSearch] = useState("106台北市大安區復興南路一段390號");
  const [origin, setOrigin] = useState("106台北市大安區復興南路一段390號");
  const { toast } = useToast();
  const { mutateAsync: setContact } = useSetContactInfo();
  const submitHandler = () => {
    toast({
      className: "bg-green-500 text-white",
      title: "訊息已成功送出",
    });
  };
  const handleCheckbox = async () => {
    const session = setContact(user?.showContactInfo === "N" ? "Y" : "N");

    if (!session) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "伺服器錯誤，請稍後再試",
      });

      return;
    }

    toast({
      className: "bg-green-500 text-white",
      title: "更新完成",
    });
  };

  return (
    <div>
      <section className="body-font relative">
        <div className=" h-screen px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          {user?.showContactInfo === "N" ? (
            <div className="w-full text-center">此用戶已關閉聯絡方式</div>
          ) : (
            <>
              <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                <APIProvider
                  apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                  onLoad={() => console.log("Maps API has loaded.")}
                >
                  <Map
                    className="w-full h-full absolute inset-0"
                    defaultZoom={13}
                    defaultCenter={{ lat: 25.0740708, lng: 121.4713167 }}
                  >
                    <Directions address={user?.address || ""} origin={origin} />
                  </Map>
                </APIProvider>
                <div className="bg-white sm:relative flex flex-wrap py-6 rounded shadow-md">
                  <div className="lg:w-1/2 px-6">
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                      地址
                    </h2>
                    <p className="mt-1 text-gray-900">{user?.address || ""}</p>
                  </div>
                  <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                      EMAIL
                    </h2>
                    <p className="text-indigo-500 leading-relaxed">
                      {user?.email || ""}
                    </p>
                    <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                      PHONE
                    </h2>
                    <p className="leading-relaxed text-gray-900">
                      {user?.phone || ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="sm:hidden flex flex-wrap py-6 rounded shadow-md">
                <div className="lg:w-1/2 px-6">
                  <h2 className="title-font font-semibold tracking-widest text-xs">
                    地址
                  </h2>
                  <p className="mt-1">{user?.address || ""}</p>
                </div>
                <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                  <h2 className="title-font font-semiboldtracking-widest text-xs">
                    EMAIL
                  </h2>
                  <p className="text-indigo-500 leading-relaxed">
                    {user?.email || ""}
                  </p>
                  <h2 className="title-font font-semibold tracking-widest text-xs mt-4">
                    PHONE
                  </h2>
                  <p className="leading-relaxed">{user?.phone || ""}</p>
                </div>
              </div>
            </>
          )}

          <div className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <div className="w-full flex flex-col mb-4">
              {Number(currentUser?.id) === user?.id && (
                <Button onClick={handleCheckbox}>
                  {user?.showContactInfo === "N"
                    ? "顯示聯絡資訊"
                    : "隱藏聯絡資訊"}
                </Button>
              )}
              <div className="flex w-full justify-center items-center space-x-2 mt-4">
                <Input
                  type="text"
                  placeholder="搜尋出發地點"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Button type="submit" onClick={() => setOrigin(search)}>
                  Search
                </Button>
              </div>
            </div>
            <h2 className="text-lg mb-1 font-medium title-font">Feedback</h2>
            <p className="leading-relaxed mb-5 ">
              您可以透過以下表單與 {user?.nickname} 聯絡
            </p>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm ">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="選填"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="message" className="leading-7 text-sm ">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>
            <Button
              onClick={submitHandler}
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              送出
            </Button>
            <p className="text-xs  mt-3">
              請放心，這則訊息將會是以匿名方式傳遞。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
