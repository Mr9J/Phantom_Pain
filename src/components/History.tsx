// 引入React的useEffect Hook和react-cookies套件
import { ProjectCardDTO } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import cookie from 'react-cookies';


function History(){
const [data, setData] = useState<ProjectCardDTO[] | null>(null);
const useProjectHistory = (projectID) => {
    useEffect(() => {
      let history = cookie.load('projectHistory') || [];
      if (!Array.isArray(history)) {
        history = [history];
      }
      if (history.indexOf(projectID.toString()) === -1) {
        history.unshift(projectID.toString());
        history = history.slice(0, 5);
        cookie.save('projectHistory', history, { path: '/' });
      }
    }, [projectID]);
  };
  
  // 在Project組件中使用自定義的useProjectHistory Hook
  const Project = ({ match }) => {
    const projectID = parseInt(match.params.id, 10);
    useProjectHistory(projectID);
  
    // ...其他組件邏輯
  };
  
  function History() {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          let history = cookie.load('projectHistory') || [];
          history = history.map(id => parseInt(id, 10));
  
          const requests = history.map(id =>
            axios.get(`${URL}/Project/History/${id}`)
          );
          const responses = await Promise.all(requests);
          const projectsData = responses.map(response => response.data);
          setData(projectsData);
        } catch (error) {
          console.error('Error fetching project history:', error);
        }
      };
  
      fetchProjects();
    }, []);
  
    // ...渲染項目資料的邏輯
    return (
      <>
        {data.map((project, index) => (
          <div key={index}>
            {/* 渲染每個項目的資訊 */}
          </div>
        ))}
      </>
    );
  }
}

export default History;