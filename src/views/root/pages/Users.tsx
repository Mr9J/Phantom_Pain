import Footer from "@/components/section/Footer";
import { useGetUserInfo } from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Project, UserProfile } from "@/types";
import { ProfileMain, ProfileProjects } from "@/components/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, HeartHandshakeIcon, PhoneCallIcon } from "lucide-react";

const INITIAL_PROJECT: Project = {
  projectId: 0,
  projectName: "",
  projectDescription: "",
  projectGoal: 0,
  projectStartDate: new Date(),
  projectEndDate: new Date(),
  projectGroupId: 0,
  projectThumbnail: "",
  projectStatusId: 0,
};

const INITIAL_USERPROFILE: UserProfile = {
  id: 0,
  nickname: "",
  username: "",
  email: "",
  description: "",
  avatar: "",
  time: "",
  projects: [INITIAL_PROJECT],
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
    if (userData) {
      setUser(userData);
      console.log(user);
    }
  }, [userData]);

  return (
    <>
      <section className="overflow-hidden">
        <ProfileMain user={user} />

        <Tabs defaultValue="proposed" className="w-full">
          <TabsList className="flex justify-center items-center">
            <TabsTrigger value="proposed" className="text-3xl">
              <HistoryIcon className="w-[30px] h-[30px] pr-1" /> 發起計畫
            </TabsTrigger>
            <TabsTrigger value="sponsored" className="text-3xl">
              <HeartHandshakeIcon className="w-[30px] h-[30px] pr-1" />
              贊助計畫
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-3xl">
              <PhoneCallIcon className="w-[30px] h-[30px] pr-1" />
              聯絡與常見問答
            </TabsTrigger>
          </TabsList>
          <TabsContent value="proposed">
            <ProfileProjects user={user} />
          </TabsContent>
          <TabsContent value="sponsored">
            Change your password here.
          </TabsContent>
          <TabsContent value="contact">Change your password here.</TabsContent>
        </Tabs>

        <Footer />
      </section>
    </>
  );
};

export default Users;
