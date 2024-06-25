import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
const baseUrl = import.meta.env.VITE_API_URL;




export interface PurchaseHistoryDTO {
    projects: ProjectCardDTO[];
    orderDate: string;
    donate: number | null;
    discount : number;
}

export interface ProjectCardDTO {
    projectId: number;
    projectName?: string;
    thumbnail?: string;
    products: ProductCardDTO[];
}

export interface ProductCardDTO {
    productId: number;
    productName?: string;
    productPrice: number;
    thumbnail?: string;
    count: number;
}

  

function PurchasHistory() {

    const { user} = useUserContext();
    const [PurchasHistoryData, setPurchasHistoryData] = useState<PurchaseHistoryDTO[]>();
    

    // useEffect(()=>{
    //     fetchShoppingCart();   
    // },[user])   

    useEffect(()=>{
        const fetchPurchasehistory = async (memberId:number) => {
           return fetch(`${baseUrl}/OrderDetail/${memberId}`)
           .then(async response =>{
            if(response.ok){
                const result =  response.json();
                setPurchasHistoryData(await result);
                // console.log(result);
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            throw error; // 將錯誤向外傳遞
        });
  
      };
      fetchPurchasehistory(Number(user.id));
    },[user])
    


    return (
        <>
        {/* {!isAuth && <Navigate to="/sign-in" />} */}
        <div className="container px-4 mb-8">
            <div className='flex flex-col-reverse lgl:flex-row gap-5'>
                <div className='w-[92%] lgl:w-[74%] flex flex-col gap-6  lgl:my-10 mx-auto lgl:ml-5'>
                    <div className='w-full  bg-white py-10 dark:bg-slate-900'>
                        <h1 className='text-4xl font-semibold mb-1'>Mumu 贊助紀錄</h1>
                        <hr />
                        <div className="bg-white h-20 dark:bg-slate-900"></div>
                        {PurchasHistoryData?.length===0 ?    
                        
                        <div className="max-w-4xl mx-auto px-10 py-4 bg-white rounded-lg shadow-lg dark:bg-slate-500">
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-24 w-24 text-gray-400 mb-4"
        >
          <path
            d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"
          />
        </svg>
        <p className="text-gray-600 text-lg font-semibold mb-4">
          目前並無贊助紀錄.
        </p>
      </div>
    </div>:  <>{PurchasHistoryData&&PurchasHistoryData.map((item) => {
                          return item.projects.map((project)=>{   
                            let totalAmount = 0; 
                            return(   <>                       
                                    <div className="p-0.5 dark:bg-slate-600 bg-yellow-50 h-28 rounded-md">
                                       
                                        <img className='mx-4 mt-6 rounded-full float-start w-28  ' src={project.thumbnail?.toString()} alt="projectImage" />
                                        <a className="text-blue-500 dark:text-blue-200 mt-6 text-xl font-extrabold line-clamp-1" href={`/project/${project.projectId}`}>{project.projectName}</a> 
                                                                                             
                                      
                                     <span className="float-end mt-1 font-black mr-4">贊助日期:{item.orderDate}</span>  
                                   
                                     
                                    <br></br>
                                    <br></br>   
                                    </div>  
                                    <div key={project.projectId} className="w-full">     
                                    {project.products!.map(product => {
                                         totalAmount += product.productPrice * Number(product.count);
                                        return(
                                        <div key={product.productId} className='border-b-[2px] border-b-gray-400 p-4 flex gap-3 bg-slate-100 rounded-lg mt-1 my-2 dark:bg-slate-700 h-24'>
                                            <div className='float-left w-64'>
                                                <img className='mx-auto h-full w-56' src={product.thumbnail?.toString()} alt="productImage" />
                                            </div>
                                            <div className='w-4/5 flex flex-col -mt-5'>
    <br />
    <h2 className='text-[20px] font-semibold -mt-3'>{product.productName}</h2>
    <div className="float-end">
    <p className="text-sm">贊助數量:{product.count}</p>  
    <p className="text-sm float-start">品項單價:{product.productPrice}</p>
    <p className="float-end text-lg font-extrabold text-green-400">小計:${(product.productPrice * Number(product.count)).toLocaleString()}</p>
</div>

    
 
</div>


                                        </div>
                                    )})}
                                   
                                 <div className="mb-14 mt-4">
{/* <button className="float-end bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600">
前往結帳
</button> */}


    
<span className="font-bold float-end mr-5 text-2xl">總計消費金額: NT${item.donate!=0&&item.donate!=null?(totalAmount+item.donate-item.discount<0?0:totalAmount+item.donate-item.discount).toLocaleString():(totalAmount-item.discount<0?0:totalAmount-item.discount).toLocaleString()} </span>
{item.donate!=0&&item.donate!=null?  <span className="text-yellow-500 font-black mr-5 px-4 text-xl">加碼贊助:NT${item.donate}</span> : <></>}
{item.discount!=0?<span className="text-green-400 font-black mr-5 text-xl">折價卷折抵:NT${item.discount}</span>:<></>}
                                </div>
                                <hr className="mb-3 dark:border-gray-400 border-slate-400" /> 
                                <div className="container h-20"></div>
                              
                             
                                </div>
                                </>

                            )
                           })
                         
                        })}</>}
                      
                    </div>
                    <div className='w-full hidden mdl:block bg-white h-16'>
                    </div>
                    <div className='xs:block mdl:hidden'>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default PurchasHistory;
