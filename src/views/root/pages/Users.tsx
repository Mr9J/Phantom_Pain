import Footer from "@/components/section/Footer";
import { useGetUserInfo } from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";
import { Contact, ProfileMain, ProfileProjects } from "@/components/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HistoryIcon,
  HeartHandshakeIcon,
  PhoneCallIcon,
  PenToolIcon,
} from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import SponsoredProjects from "@/components/profile/SponsoredProjects";
import Group from "@/components/profile/Group";

const Users = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const {
    data: userData,
    isPending: userInfoLoading,
    refetch,
  } = useGetUserInfo(id || "");

  return (
    <div className=" overflow-hidden">
      <section className="overflow-hidden">
        <ProfileMain
          user={userData}
          isLoading={userInfoLoading}
          refetch={refetch}
        />

        <Tabs defaultValue="proposed" className="w-full">
          <TabsList className="flex justify-center items-center">
            <TabsTrigger value="proposed">
              <HistoryIcon className="w-[30px] h-[30px] pr-1 hidden lg:block" />
              發起計畫
            </TabsTrigger>
            <TabsTrigger value="sponsored">
              <HeartHandshakeIcon className="w-[30px] h-[30px] pr-1 hidden lg:block" />
              贊助計畫
            </TabsTrigger>
            <TabsTrigger value="contact">
              <PhoneCallIcon className="w-[30px] h-[30px] pr-1 hidden lg:block" />
              聯絡方式
            </TabsTrigger>
            {user?.id === id && (
              <TabsTrigger value="group">
                <PenToolIcon className="w-[30px] h-[30px] pr-1 hidden lg:block" />
                權限管理
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="proposed">
            <ProfileProjects user={userData} isLoading={userInfoLoading} />
          </TabsContent>
          <TabsContent value="sponsored">
            <SponsoredProjects id={id || ""} />
          </TabsContent>
          <TabsContent value="contact">
            <Contact id={id || ""} user={userData} />
          </TabsContent>
          {user?.id === id && (
            <TabsContent value="group">
              <Group id={id || ""} userData={userData} />
            </TabsContent>
          )}
        </Tabs>
      </section>
      <Footer />
    </div>
  );
};

export default Users;
