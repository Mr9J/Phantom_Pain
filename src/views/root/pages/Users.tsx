import Footer from "@/components/section/Footer";
import { useGetUserInfo } from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";
import { Contact, ProfileMain, ProfileProjects } from "@/components/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryIcon, HeartHandshakeIcon, PhoneCallIcon } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import SponsoredProjects from "@/components/profile/SponsoredProjects";

const Users = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const {
    data: userData,
    isPending: userInfoLoading,
    refetch,
  } = useGetUserInfo(id || "");

  return (
    <>
      <section className="overflow-hidden">
        <ProfileMain
          user={userData}
          isLoading={userInfoLoading}
          refetch={refetch}
        />

        <Tabs defaultValue="proposed" className="w-full">
          <TabsList className="flex justify-center items-center">
            <TabsTrigger value="proposed" className="text-3xl">
              <HistoryIcon className="w-[30px] h-[30px] pr-1" />
              發起計畫
            </TabsTrigger>
            <TabsTrigger value="sponsored" className="text-3xl">
              <HeartHandshakeIcon className="w-[30px] h-[30px] pr-1" />
              贊助計畫
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-3xl">
              <PhoneCallIcon className="w-[30px] h-[30px] pr-1" />
              聯絡方式
            </TabsTrigger>
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
        </Tabs>

        <Footer />
      </section>
    </>
  );
};

export default Users;
