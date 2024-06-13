import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import "@/css/style.css";
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
    title: "M3",
    link: "https://app.powerbi.com/view?r=eyJrIjoiN2FkODA0MDctZjIwMS00NDRiLWEyZTItYTkwN2U5ZjdiM2QxIiwidCI6IjcwODk3ZDZmLTBhNDgtNDlkZS04ODBmLTI3ZDhhZDQ1ZDc2ZSIsImMiOjEwfQ%3D%3D",
  },
  {
    title: "M4",
    link: "https://app.powerbi.com/view?r=eyJrIjoiMGVlYzY3MjQtZjkyOS00ZWM3LTg0NjAtMjc4MjNmZDNlNzE5IiwidCI6IjcwODk3ZDZmLTBhNDgtNDlkZS04ODBmLTI3ZDhhZDQ1ZDc2ZSIsImMiOjEwfQ%3D%3D",
  },
  {
    title: "Mall",
    link: "https://app.powerbi.com/view?r=eyJrIjoiMTY0M2NmZGQtOWUxNi00YTUwLTk0NzktYTJiM2Y3NzEzMWI1IiwidCI6IjcwODk3ZDZmLTBhNDgtNDlkZS04ODBmLTI3ZDhhZDQ1ZDc2ZSIsImMiOjEwfQ%3D%3D",
  },
];

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, checkAuthUser } = useUserContext();
  const [isAuth, setIsAuth] = useState(true);
  const [memberPowerBI, setMemberPowerBI] = useState(null);
  useEffect(() => {
    checkAuthUser().then((res) => {
      setIsAuth(res);
    });
  }, []);
  useEffect(() => {
    if (isAuth) {
      const mId = parseInt(user.id, 10);
      if (mId > 0 && mId <= 4) {
        setMemberPowerBI(memberPowerBIText[mId - 1]);
      } else {
        setMemberPowerBI(memberPowerBIText[4]);
      }
    }
  }, [user.id, isAuth]);

  if (!memberPowerBI) {
    return <div>Loading...</div>;
  }
  return (
    <iframe
      title={memberPowerBI.title}
      width="1600"
      height="850"
      src={memberPowerBI.link}
      frameborder="0"
      allowFullScreen="true"
    ></iframe>
  );
};

export default Dashboard;
