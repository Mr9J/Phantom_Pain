import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import "@/css/style.css";
import { Helmet } from "react-helmet-async";
const memberPowerBIText = [
  {
    title: "M1",
    link: "https://app.powerbi.com/view?r=eyJrIjoiNDNkNTJmNGYtOGJlYS00YTc4LThjYzUtY2YwZmMxNjE2ZjVjIiwidCI6IjcwODk3ZDZmLTBhNDgtNDlkZS04ODBmLTI3ZDhhZDQ1ZDc2ZSIsImMiOjEwfQ%3D%3D",
  },
  {
    title: "M2",
    link: "https://app.powerbi.com/view?r=eyJrIjoiZDg5OTIyNWEtYmFiMy00YTBjLTgzMGMtNzhiYzI3YjNjZWQ4IiwidCI6IjcwODk3ZDZmLTBhNDgtNDlkZS04ODBmLTI3ZDhhZDQ1ZDc2ZSIsImMiOjEwfQ%3D%3D",
  },
  {
    title: "Mall",
    link: "https://app.powerbi.com/view?r=eyJrIjoiMTY0M2NmZGQtOWUxNi00YTUwLTk0NzktYTJiM2Y3NzEzMWI1IiwidCI6IjcwODk3ZDZmLTBhNDgtNDlkZS04ODBmLTI3ZDhhZDQ1ZDc2ZSIsImMiOjEwfQ%3D%3D",
  },
];

const Dashboard: React.FC = () => {
  const { user, checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);
  const [memberPowerBI, setMemberPowerBI] = useState<{
    title: string;
    link: string;
  } | null>(null);
  useEffect(() => {
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, [checkAuthUser]);
  useEffect(() => {
    if (isAuth) {
      const mId = parseInt(user.id, 10);
      if (mId > 0 && mId <= 2) {
        setMemberPowerBI(memberPowerBIText[mId - 1]);
      } else {
        setMemberPowerBI(memberPowerBIText[2]);
      }
    }
  }, [user.id, isAuth]);

  if (!memberPowerBI) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Helmet>
        <title>Mumu | 儀錶板</title>
      </Helmet>
      <iframe
        title={memberPowerBI.title}
        width="1600"
        height="850"
        src={memberPowerBI.link}
        allowFullScreen
      ></iframe>
    </>
  );
};

export default Dashboard;
