import Footer from "@/components/section/Footer";
import { useGetUserInfo } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const INITIAL_USERPROFILE: UserProfile = {
  id: "",
  nickname: "",
  username: "",
  email: "",
  description: "",
  avatar: "",
  time: "",
};

type UserProfile = {
  id: string;
  nickname: string;
  username: string;
  email: string;
  description: string;
  avatar: string;
  time: string;
};

const Users = () => {
  const { pathname } = useLocation();
  const [user, setUser] = useState<UserProfile>(INITIAL_USERPROFILE);
  const {
    data: userData,
    isPending: userInfoPending,
    isError: isErrorUserData,
    refetch: refetchUserData,
  } = useGetUserInfo(pathname);

  useEffect(() => {
    refetchUserData();
  }, []);

  return (
    <>
      <section className="overflow-hidden">
        <div className="h-screen w-full border-4 grid grid-cols-4 grid-rows-4 py-4 px-6 lg:px-12">
          <div className="bg-slate-500 col-start-1 col-end-5 row-start-1 row-end-2">
            <div className="flex justify-center items-center">
              <img
                src={userData ? userData.avatar : ""}
                alt="avatar"
                className="w-[150px] h-[150px] rounded-full"
              />
            </div>
            <div className="flex flex-1 justify-center items-center">
              <h2>{userData ? userData.description : ""}</h2>
            </div>
          </div>
        </div>

        <Footer />
      </section>
    </>
  );
};

export default Users;
