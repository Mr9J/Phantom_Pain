import { useState, useEffect} from 'react';
import taiwan_districts from '@/constants/taiwan_districts.json'
import { getProjectfromProductId } from '@/services/projects.service';
import { createOrder } from '@/services/orders.service';
import { Link } from 'react-router-dom';
import Projectcard from '@/components/ProjectCard/projectcard.jsx';
//import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import IncreaseDecreaseButtons from './components/Header/button.jsx';




function Paypage() {

  
  //const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedproductId = searchParams.get('product');
  const projectId = searchParams.get('project')
  
  const  testmemberId = 6;

  const [selectedCity, setSelectedCity] = useState(''); // 用於存儲所選的縣市
  const [districtsName, setDistrictsName] = useState([]); // 用於存儲區域名稱列表
  const [isHidden, setIsHidden] = useState(false);
  const [projectAndproductsData, setProjectData] = useState();
  const [addToPurchase , setPrice] = useState(0);
  const [donationInfo , setDonationInfo] = useState({hasDonate:false,donationAmount:0});
  const [inputDonateValue, setInputValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [productCounts, setProductCounts] = useState(0);
  const [selectedProductCount , setSelectedProductCount] = useState(1)
  const [buttonDisabled, setButtonDisabled] = useState({}); //radio按鈕
  //購買資訊 未帶入memberID 
  const [orderData, setOrderData] = useState({
    memberID:testmemberId,
    paymentMethodID:1,
    projectID: projectId,
   productID: [selectedproductId],
    // count: 1,
    productdata:[{ productId: selectedproductId, count: selectedProductCount }],
    donate:0,
  });
   
  const handlePaymentMethodChange = async (event) =>{
    setPaymentMethod(event.target.value)
    setOrderData({ ...orderData, paymentMethod});
  }

 //測試POST
  const handleSubmit = async (event) => {
    event.preventDefault();
    await createOrder(orderData)
  };


//觀察orderData變化用
  useEffect(() => {
    console.log(orderData);
    console.log(buttonDisabled)
  }, [orderData,buttonDisabled]);

// 加購商品，加入集合及左方金額顯示變化
const AddToPurchase = async (e,price) => {

    const isChecked = e.target.checked;
    const productId = e.target.value;
    if(productCounts[productId]==undefined)
      {
        return;
      }
    //鎖定數量選擇
   await  setButtonDisabled(prevState => ({
      ...prevState,
      [productId]:!prevState[productId]
    }));
    console.log(buttonDisabled);

  await  setOrderData((orderData) => ({
      ...orderData,
      productdata: isChecked
        ? [...orderData.productdata, { productId, count: productCounts[productId] || 0 }]
        : orderData.productdata.filter(item => item.productId !== productId)
    }));

  await  setOrderData((orderData)=>({
      ...orderData,
      productID: orderData.productID.includes(productId)
      ?orderData.productID.filter((id)=>id !== productId)
      :[...orderData.productID,productId] 
    }))

 
    await setPrice(prevPrice => isChecked ? prevPrice+=price*productCounts[productId] : prevPrice-=price*productCounts[productId]); 

  };

  
  
// 載入頁面
useEffect(()=>{
    getProjectfromProductId(projectId,testmemberId)
    .then(data=>{
      setProjectData(data);
    })
    .catch(error=>{
      console.error('Error fetching project data:', error);
    });

  },[projectId,testmemberId]);



//主要商品更新數量
  useEffect(() => {
    // 篩選並更新 productdata 中對應的項目
    setOrderData((prevOrderData) => ({
      ...prevOrderData,
      productdata: prevOrderData.productdata.map(item => {
        if (item.productId === selectedproductId) {
          return { ...item, count: selectedProductCount };
        }
        return item;
      })
    }));


  }, [selectedProductCount, selectedproductId]);


//按下斗內
const EnterToDonate = (event) => {
  if (event.keyCode === 13){
    event.preventDefault();
    const {value } = event.target;
    if(value === "" || parseFloat(value) === 0) {
      setDonationInfo({
        hasDonate: false,
        donationAmount: 0
      });
      setOrderData(prevFormData => ({
        ...prevFormData,
        donate: 0 //如果沒有捐贈金額，則將捐贈金額設置為0
      }));
    } else {
      const donate = parseFloat(value);
      setOrderData(prevFormData => ({
        ...prevFormData,
        donate: donate //更新訂單中的捐贈金額
      }));
      setDonationInfo({
        hasDonate: true,
        donationAmount: donate
      });
    }
  }
};

//斗內輸入變化  
const DonateChange = (e) => {
  const parsedValue = parseFloat(e.target.value);
  setInputValue(isNaN(parsedValue) ? '' : parsedValue); //如果無法解析為數字，設置為空字符串
};


   const CityChange = (e) => {
    
    setSelectedCity(e.target.value); // 更新所選的縣市
    setDistrictsName(getDistrictsName(e.target.value)); // 根據新選擇的縣市更新區域名稱列表
};

// 根據選擇的縣市動態生成區域名稱列表
const getDistrictsName = (selectedCity) => {
    // 根據所選的縣市從數據源中獲取對應的區域名稱列表
    const filteredDistricts = taiwan_districts.filter((item) => item.name === selectedCity);
    return filteredDistricts.map((districts) => (
        districts.districts.map((item) => (
            <option key={item.name} value={item.name}>{item.name}</option>
        ))
    ));
};


  const ClickToHidden = () => {
    setIsHidden(!isHidden);
  };

//商品數量變更(排除主商品)
const handleDecrease = async (e, productId) => {
  e.stopPropagation(); 
  e.preventDefault();
  const updatedProductCounts = { ...productCounts };
  const currentCount = updatedProductCounts[productId] || 0;
  if (currentCount <= 0) {
      return;
  }
  updatedProductCounts[productId] = currentCount - 1;
  await setProductCounts(updatedProductCounts);
};

  const handleIncrease =async (e,productId) => {
    e.stopPropagation(); 
    event.preventDefault();
    const updatedProductCounts = { ...productCounts };
    updatedProductCounts[productId] = (updatedProductCounts[productId] || 0) + 1;
    await  setProductCounts(updatedProductCounts);
  };
  
  const poductlist =projectAndproductsData && projectAndproductsData.map(item=>(
    <div key={item.projectId} style={{ "display": "flex", "flexGrow": "1" }}>  
  {item.products.map(pjitem=>{
    if(pjitem.productId == selectedproductId)
      { return null;}
    ///////////////////
return(
  <div key={pjitem.productId} style={{"width":"300px"}} className="mx-1">
  <label className="bg-zinc-100 rounded-md p-4 leading-none block mb-0 mx-0.5">
    {/* value傳商品id */}
  <input className="mr-4" type="checkbox" value={pjitem.productId} onChange={(e)=>AddToPurchase(e,pjitem.productPrice)}/>
  選擇
  </label>
  {/* 點擊商品後 href顯示加購及結帳  */}
  <div className="p-4 border-2 border-inherit rounded mb-8 block">
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
  <span className="font-bold">{(pjitem.initialStock-pjitem.currentStock).toString()}</span>
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
  
  <div className="text-center text-xs text-gray-600 pt-4 mt-4 border-t">
  {/* <IncreaseDecreaseButtons
                productId={pjitem.productId}
                productCounts={productCounts}
                buttonDisabled={buttonDisabled}
                handleDecrease={handleDecrease}
                handleIncrease={handleIncrease}
              /> */}
  <div className="flex items-center justify-center space-x-2 mb-4">
      <button className={`px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 ${
    buttonDisabled[pjitem.productId] ? 'opacity-50 cursor-not-allowed pointer-events-none bg-slate-500' : ''
  }`}  disabled={buttonDisabled[pjitem.productId]} value={pjitem.productId} onClick={(e)=>handleDecrease(e,pjitem.productId)}>-</button>
      <span className="font-bold">

    {productCounts[pjitem.productId] || 0}
  
        </span>  
      <button className={`px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300 ${
    buttonDisabled[pjitem.productId] ? 'opacity-50 cursor-not-allowed pointer-events-none bg-slate-500' : ''
  }`}  disabled={buttonDisabled[pjitem.productId]} value={pjitem.productId}  onClick={(e)=>handleIncrease(e,pjitem.productId)}>+</button>
    </div>
  </div>
  {item.productInCart.includes(pjitem.productId) ? (
  <span className={`w-full float-right mb-1 rounded-full font-bold text-xs py-2 px-2 text-center leading-none ${item.productInCartCount[item.productInCart.indexOf(pjitem.productId)] <= productCounts[pjitem.productId] || 0
    ? "bg-lime-500 text-neutral-600"
    : 'bg-slate-500 text-neutral-300 '}`}>已在購物車內 : {item.productInCartCount[item.productInCart.indexOf(pjitem.productId)]}件</span>
) : (
  <></>
)}
</div>  
  </div>
  </div>)})}
  
  </div>
  ))
  
  const selectedProduct = projectAndproductsData && projectAndproductsData.map(item =>(
     <>
    {item.products.map(pjitem=>{
      if(pjitem.productId == selectedproductId)
        return(
      <>
    <div className="w-80 h-auto p-4 border-2 border-inherit rounded my-8 ml-4 block" key={pjitem.productId}>
      {/* 更改回饋回上頁 */}
      <Link className="float-right mb-3 rounded-full font-bold text-xs py-1 px-2 bg-neutral-200 text-center text-neutral-600 leading-none" to="#" onClick={() => window.history.back()}>更改回饋</Link>
      {/* 點擊商品後 href顯示加購及結帳 */}
      <img
        // src商品圖片
        // src={`src/assets/mumuThumbnail/Mumu projects&productsThumbnail/${item.thumbnail}`}
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
          <span className="font-bold">{(pjitem.initialStock - pjitem.currentStock).toString()}</span>
          /  {pjitem.initialStock} 次
        </span>
      </div>
  
      <div className="overflow-y-auto break-all">
        <div className="text-black text-sm space-y-4 leading-8">
          {/* 加入商品敘述 */}
          <p>
            {pjitem.productDescription}
          </p>
        </div>
 
      <div className="text-center text-xs text-gray-600 pt-4 mt-4 border-t">
      <div className="flex items-center justify-center space-x-2 mb-3">  
      <button className="px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300" value={pjitem.productId} onClick={(e)=>{e.stopPropagation(); e.preventDefault(); setSelectedProductCount(selectedProductCount-1)}}>-</button>
      <span className="font-black">{selectedProductCount}</span>
      <button className="px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300" value={pjitem.productId}  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); setSelectedProductCount(selectedProductCount+1)}}>+</button>
    </div>
      {item.productInCart.includes(pjitem.productId) ? (
  <span className={`w-full float-right mb-1 rounded-full font-bold text-xs py-2 px-2 text-center leading-none ${item.productInCartCount[item.productInCart.indexOf(pjitem.productId)] <= selectedProductCount
    ? "bg-lime-500 text-neutral-600"
    : 'bg-slate-500 text-neutral-300 '}`}>已在購物車內 : {item.productInCartCount[item.productInCart.indexOf(pjitem.productId)]}件</span>
) : (
  <></>
)}     </div>
      </div>
    </div>
    <div className="border-0 ml-6 w-80">
    <div className="flex items-start text-sm py-2 mt-4">
  <div className="whitespace-nowrap font-bold flex-auto">選項金額</div>
  <div className="whitespace-nowrap text-right">
  NT$ {(parseFloat(pjitem.productPrice) * selectedProductCount).toLocaleString()}
  <div>
  <div className="inline-block text-xs bg-zinc-100 mr-2 leading-none rounded-full px-2 py-1">加購</div>
  +
  NT$ {addToPurchase.toLocaleString()}
  </div>
  <div className={`whitespace-nowrap font-bold flex-auto ${donationInfo.hasDonate?'inline-block' : 'hidden'}`}>
加碼贊助 :  {(donationInfo.donationAmount).toLocaleString()}
</div>
  </div>
  </div>
  <div className="flex items-start text-xl pb-2 pt-4 border-t-4 border-gray-300">
  <div className="whitespace-nowrap font-bold flex-auto">總價</div>
  <div className="whitespace-nowrap text-right">
    {/* 金額正規化顯示.toLocaleString() */}
  NT$ {(parseFloat(pjitem.productPrice) * selectedProductCount + addToPurchase + donationInfo.donationAmount).toLocaleString()}
  
  </div>
  </div>
  </div>
  </>
  )})}
 </>
  ))
  
  const payment = (
    <div className={`px-4 lg:w-2/3 overflow-x-auto ${isHidden ? 'inline-block' : 'hidden'}`}>
      <button className={`h-auto border-2 border-current rounded p-4 w-full text-left text-neutral-400 hover:text-neutral-600 font-bold ${''}`} type="button" onClick={ClickToHidden}>
        <span className="align-middle text-sm mr-2"></span>
        顯示品項細節
        <span className="align-middle text-sm ml-2"></span>
      </button>
      {/* <PaymentMethod></PaymentMethod> */}
      <div className="mt-8">
        <label className="font-bold text-sm text-black mb-4">付款方式</label>
        <label className="mb-2 mt-2 rounded hover:bg-zinc-200 cursor-pointer bg-zinc-100 px-4 py-2 flex items-center min-h-14">
          {/* 兩個radio設定同樣name，達成單選效果 */}
          <input className="flex-initial" type="radio" value="1" checked={paymentMethod === "1"} name="paymentmethod" onChange={handlePaymentMethodChange}/>
          <h3 className="ml-2 flex-1">
            <span className="block font-bold">信用卡付款</span>
            <p className="flex text-xs text-gray-800 mt-1">
              <span>台新、玉山享 3 期 / 零利率</span>
              、
              <span>可用銀聯卡</span>
              、
              <span>可用國外卡</span>
            </p>
          </h3>
        </label>
        <label className="mb-2 rounded hover:bg-zinc-200 cursor-pointer bg-zinc-100 px-4 py-2 flex items-center min-h-14">
          <input className="zec js-payment-method flex-initial" type="radio" checked={paymentMethod === "3"} value="3" name="paymentmethod" onChange={handlePaymentMethodChange}/>
          <h3 className="ml-2 flex-1">
            <span className="block font-bold">ATM 轉帳或銀行臨櫃繳款</span>
            <span className="mt-2 text-xs text-gray-800">需於指定時間內完成付款，超過時限則會取消交易</span>
          </h3>
        </label>
  
        <div className="p-4 border mt-2 rounded border-slate-200">
          <ul className="list-disc m-0 pl-4 text-slate-600">
            <li>您了解您的贊助是支持創意專案的一種方式，也了解創意實踐過程中充滿變數，專案不一定能確保回饋。</li>
          </ul>
        </div>
        <div className="mb-2 mt-4">
          <label className="font-bold text-sm text-black mb-4">加碼贊助</label>
          （選擇）
        </div>
        <div className="flex rounded border border-neutral-200 focus-within:ring-1 mb-3">
          <div className="inline-flex items-center text-lg text-gray-500 rounded-l p-3 whitespace-nowrap">NT $</div>
          <input className="w-full flex-1 text-lg pr-2 mb-0 rounded border-transparent" type="number" name="price" value={inputDonateValue} onChange={DonateChange} onKeyDown={EnterToDonate} min="0"/>
        </div>
        <div className="flex">
          <div className="mt-4 flex-auto"> 
            <label className="font-bold text-sm text-black mb-4">縣市</label>
            <select className="h-12 px-2 mb-0 w-full rounded border-gray-300 bg-zinc-100" onChange={CityChange} value={selectedCity}>   
              <option selected='selected'>-選擇-</option>
              {taiwan_districts.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex-auto pl-4">
            <label className="font-bold text-sm text-black mb-4">鄉鎮市區</label>
            <select className="h-12 px-2 mb-0 w-full rounded border-gray-300 bg-zinc-100">
              <option selected='selected'>-選擇-</option>
              {districtsName}
            </select>
          </div>
        </div>
  
        <div className="flex mt-4">
          <div className="flex-auto">
            <label className="font-bold text-sm text-black mb-4">地址</label>
            <input required="required" autoComplete="street-address" className="my-2 h-9 text-base mb-4 w-full rounded border border-gray-300 focus:outline-none focus:ring-1" type="text" name="order[address]"/>
          </div>
          <div className="flex-auto pl-10">
            <label className="font-bold text-sm text-black mb-4">郵遞區號</label>
            <input required="required" autoComplete="postal-code" className="my-3 h-9 text-base mb-4 w-full rounded border border-gray-300 focus:outline-none focus:ring-1" type="text" name="order[postcode]"/>
          </div>
        </div>
        <label className="font-bold text-sm text-black mb-4">收件人</label>
        <input required="required" placeholder="請輸入真實姓名，以利出貨作業進行" className="my-3 h-9 text-base w-full rounded border border-gray-300 focus:outline-none focus:ring-1 placeholder-gray-500" type="text" name="order[recipient]"/>
        <label className="font-bold text-sm text-black mb-4">連絡電話</label>
        <input required="required" placeholder="請填寫真實手機號碼，以利取貨或聯繫收貨" maxLength="20" minLength="8" pattern="[+]{0,1}[0-9]+" autoComplete="tel-national" className="my-2 h-9 text-base w-full rounded border border-gray-300 focus:outline-none focus:ring-1 placeholder-gray-500" size="20" type="text" name="order[phone]"/>
        <button className="block lg:inline-block font-bold border-2 mt-4 rounded px-16 py-2  hover:text-white hover:bg-sky-500" type="submit">
          立即預購
        </button>
      </div>
    </div>
  );

  return (
    <>
 {/* <header className="py-2 px-4">MuMu</header> */}
      <Projectcard projectData={projectAndproductsData}></Projectcard>
{/* 原本是px-4 mb-8有另外的div */}
<div className="container my-8 px-4 mb-8 ml-60">

<form method="post" onSubmit={handleSubmit}>
  <div className="flex mb-10 text-sm -mx-4">
<div className="px-4 lg:w-1/3">

  {selectedProduct}
  

</div>

{/* 輸入交易資料畫面 */}
{payment}

<div className={`flex px-4 lg:w-2/3 overflow-x-auto ${isHidden ? 'hidden' : ''}`}>
<div style={{ "display": "flex", "flexGrow": "1" }}>  

{/* MAP顯示加購商品 */}
{poductlist}
 
</div>
</div>
</div>
<button className={`border-2 rounded p-4 text-left font-bold w-full lg:w-1/4 ${isHidden ? 'hidden' : ''}`}
 type="button" 
onClick={ClickToHidden}>
選擇付款方式
</button>
</form>  
</div>
    </>
      
  );
  
}



export default Paypage;
