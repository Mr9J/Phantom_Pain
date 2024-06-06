// import './App.css';
import '@/css/productcard.css'
// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// import { getProject } from './api/Project.js';
import { getProjectfromProductId } from '@/services/projects.service';
// import { addToCart } from './api/Project.js';
// import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Projectcard from '@/components/ProjectCard/projectcard.jsx';
import { useNavigate } from 'react-router-dom';

// import { data } from 'autoprefixer';
//寫死的參數
const  testProjectid = 25;
const  testmemberId = 6;

interface ProjectCardDTO {
  projectId: number;
  memberId: number;
  projectGoal: number;
  total: number;
  projectName?: string;
  projectDescription?: string;
  thumbnail?: string;
  member?: MemberDTO | null;
  products?: ProductCardDTO[] | null;
  productInCart?: number[] | null;
  productInCartCount?: number[] | null;
}

interface MemberDTO {
  memberId: number;
  username: string;
  nickname?: string | null;
  thumbnail?: string | null;
  email?: string | null;
  address?: string | null;
  memberIntroduction?: string | null;
  phone?: string | null;
  registrationTime?: Date | null;
}

interface ProductCardDTO {
  productId: number;
  productName?: string | null;
  productDescription?: string | null;
  initialStock: number;
  productPrice: number;
  currentStock: number;
  startDate: Date;
  endDate: Date;
  thumbnail?: string | null;
}

interface ProductsComponentProps {
  productsData: ProjectCardDTO[] | null;
  getSelectProductId: (productId: number) => void;
}


function ProductsComponent({ productsData, getSelectProductId }: ProductsComponentProps) {
  if (!productsData) return null;
// const {productsData,getSelectProductId} = props
// // const [productCount, setProductCount] = useState(1);


// ProductsComponent.propTypes = {
//   productsData: PropTypes.array //類型檢查
// };            

// ProductsComponent.propTypes = {
//   getSelectProductId : PropTypes.func.isRequired, // 必需的 onClick 屬性
//   // 其他 PropTypes 定義
// };

//測試加入購物車(成功)   
// const ClickaddToCart = (e) =>{
//   //e.stopPropagation 阻止事件向上傳播到外部 click 事件上
//   e.stopPropagation();
//   const productId = e.target.value;
//   e.target.style.backgroundColor = 'gray';
//   e.target.textContent = '已加入購物車';
//   e.target.disabled = true;
//   addToCart(productId , testProjectid , testmemberId )
// }

const listitem = productsData&&productsData.map(item=>(
  <div key={item.projectId} style={{ "display": "flex", "flexGrow": "1" }}>  
{item.products&&item.products.map(pjitem=>(
<div key={pjitem.productId} style={{"width":"380px"}} className="mx-1 cursor-pointer">
{/* 點擊商品後 href顯示加購及結帳  */}
{/* <a className="p-4 border-2 border-inherit rounded mb-8 block" href="/paypage"> */}
<div className="p-4 border-2 border-inherit rounded mb-8 block" onClick={()=>getSelectProductId(pjitem.productId)}>
<img
//  src商品圖片

src={`${pjitem.thumbnail}`}
alt="Description"
/>
<div className="text-gray-600 font-bold mt-4 mb-2">{pjitem.productName}</div>
<div className="text-black font-bold text-xl items-center">
{pjitem.productPrice}
<span className="inline-block text-xs font-bold text-black bg-yellow-300 leading-relaxed px-2 ml-2 rounded-sm">帶入幾折</span>
<p className="w-full text-gray-500 font-normal text-xs">
預定售價
<span className="line-through">帶入原價</span>
{/* 這裡要計算打折後省多少還未帶入數 */}
，現省 NT$ 6,100
</p>
</div>

<div className="text-xs my-2">
<span className="text-xs text-white px-2 py-1 bg-rose-700 font-bold inline-block">
剩餘 {pjitem.currentStock} 份
</span>
<span className="text-black px-2 py-1 bg-zinc-100 inline-block">
已被贊助
<span className="font-bold">{(pjitem.initialStock-pjitem.currentStock)}</span>
/ {pjitem.initialStock} 次
</span>
</div>

<div className="overflow-y-auto break-all">
{/* <div className="text-black text-sm flex flex-col space-y-4 leading-relaxed"> */}
<div className="text-black text-sm space-y-4 leading-8">
{/* 加入商品敘述 */}
<p>
{pjitem.productDescription}</p>
</div>

<div className="text-center text-xs text-gray-600 pt-4 mt-4 border-t" >

{/* {item.productInCart.includes(pjitem.productId) ? (
  <button className="float-right mb-1 rounded-full font-bold text-xs py-1 px-2 bg-gray-600 text-center text-neutral-400 leading-none" disabled value={pjitem.productId}>已加入購物車</button>
  
) : (
  <button className="float-right mb-1 rounded-full font-bold text-xs py-1 px-2 bg-orange-600 text-center text-neutral-300 leading-none" value={pjitem.productId} onClick={(e) => ClickaddToCart(e)}>加入購物車</button>
)} */}


</div>
</div>
</div>
</div>))}

</div>
))
  
  return( 
    <>       
    {listitem}
    </>

)
}



function Productpage() {


  const navigate = useNavigate();

  const ClickProductToPaypage = (productId:number) => {
    // 點擊按鈕後導航到其他路由
    console.log(productId);
    navigate(`/Paypage?project=${testProjectid}&product=${productId}`);
  };

//後面寫空陣列表示只渲染一次
  const [projectAndproductsData, setProjectData] = useState(null);


    useEffect(()=>{
      getProjectfromProductId(testProjectid,testmemberId)
      .then(data=>{
        setProjectData(data);
      })
      .catch(error=>{
        console.error('Error fetching project data:', error);
      });

    },[]);
  
// console.log(projectAndproductsData);


  
  return (
    <>

 {/* <header className="py-2 px-4">MuMu</header> */}



<Projectcard projectData={projectAndproductsData}></Projectcard>
{/* 原本是px-4 mb-8有另外的div */}
<div className="container my-8 px-4 mb-8 ml-60">
  
{/* 這邊有hidden */}
<div className="text-center text-xs rounded bg-zinc-100 p-2 font-bold tracking-widest">
    {/* material-icons*/}
<span className="material-icons"></span>
左右捲動看看更多選項
<span className="material-icons"></span>
</div>

{/* scrollbar-top */}
<div className="flex overflow-x-auto scrollbar-top">
  {/* 下面的div是每欄商品產生 */}

  <ProductsComponent productsData={projectAndproductsData} getSelectProductId={ClickProductToPaypage}></ProductsComponent>
 
</div>
</div>


    </>
  );
}

export default Productpage;
