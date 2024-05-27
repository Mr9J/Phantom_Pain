import React, { useState, useEffect } from "react";
import { getProjects } from "@/services/projects.service";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const projectUrl = import.meta.env.VITE_PROJECT_IMG_URL;
const productUrl = import.meta.env.VITE_PRODUCT_IMG_URL;
import "@/css/style.css";
import "@/css/backstageStyle.css";



const orders = () => {
  const [projects, setProjects] = useState(null);
  //載入api
 useEffect(() => {
  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjects();
      setProjects(
        fetchedProjects.map((project) => ({
          ...project,
          isEdit: false,
        }))
      );
      //console.log('fetchedProjects:', fetchedProjects); // 確認資料是否成功加載
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  fetchProjects();
}, []);
  const callouts = [
    {
      id:1,
      name: 'Desk and Office',
      description: 'Work from home accessories',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg',
      imageAlt: 'Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.',
      href: '/admin/orders/1',
    },
    {
      id:2,
      name: 'Self-Improvement',
      description: 'Journals and note-taking',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg',
      imageAlt: 'Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.',
      href: '/admin/orders/2',
    },
    {
      id:3,
      name: 'Travel',
      description: 'Daily commute essentials',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg',
      imageAlt: 'Collection of four insulated travel bottles on wooden shelf.',
      href: '/admin/orders/3',
    },
    
  ]
  return (
    <>
        <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none ">
          <h2 className="text-4xl font-bold">專案列表</h2>
          <div className='pt-3'>
          <button
            color="primary"
            onClick={() => {
            }}
            style={{ marginRight: '10px' }}
          >
            全部
          </button>
          <button
            color="primary"
            onClick={() => {
            }}
            style={{ marginRight: '10px' }}
          >
            進行中
          </button>
          <button
            color="primary"
            onClick={() => {
            }}
            style={{ marginRight: '10px' }}
          >
            已到期
          </button>
          </div>
          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {projects && projects.map((item) => (
              <div key={item.projectId} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-t-lg sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
                     src={projectUrl+item.thumbnail}
                     alt={item.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-6 text-sm">
                  <a href={item.projectId}>
                    <div style={{height:48}}>
                  <p className="text-base font-semibold line-clamp">{item.projectName}</p>
                  </div>
                  </a>
                </h3>
                <p className="text-base font-semibold">訂單數量</p><p className="text-base font-semibold">贊助人次</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default orders
