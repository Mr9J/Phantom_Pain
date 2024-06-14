import React, { useRef, useState } from 'react';
const frontUrl = import.meta.env.VITE_FRONT_URL;
const baseUrl = import.meta.env.VITE_API_URL;

interface ECPayComponentProps {
  projectName: string;
  totalAmount: number;
}

const PaymentForm: React.FC<ECPayComponentProps> = ({ projectName, totalAmount }: ECPayComponentProps) =>{
  const [checksum, setChecksum] = useState<string | null>(null);
  const [shouldSubmitForm, setShouldSubmitForm] = useState<boolean>(false);
  const [merchantTradeNo, setMerchantTradeNo] = useState<string>('');
  const [merchantTradeDate, setMerchantTradeDate] = useState<string>('');
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const returnURL = `${frontUrl}/ReturnURL`

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     const tempMerchantTradeNo = generateMerchantTradeNo();
  const tempMerchantTradeDate = getCurrentTime();
   await setMerchantTradeNo(tempMerchantTradeNo);
   await setMerchantTradeDate(tempMerchantTradeDate)

  // 只有当 MerchantTradeNo 和 MerchantTradeDate 都不为空时才提交表单
  if (tempMerchantTradeNo && tempMerchantTradeDate) {
    // 請求後端計算檢查碼
    try {

        const response = await fetch(`${baseUrl}/Order/CalculateChecksum`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                MerchantID: "3002607",
                MerchantTradeNo: tempMerchantTradeNo,
                MerchantTradeDate: tempMerchantTradeDate,
                PaymentType: "aio",
                TotalAmount: `${totalAmount}`, // 將數字轉換為字串
                TradeDesc: "Transaction description",
                ItemName: `贊助企劃:${projectName}`,
                ReturnURL: "http://test/ReturnURL",
                ClientBackURL: `${returnURL}`,
                ChoosePayment: "ALL",
                EncryptType: "1"
            })
        });

        const data = await response.json();
        
        setChecksum(data.checksum); // 修正為大寫的 Checksum
        setShouldSubmitForm(true); // 設置為應該提交表單
       
        console.log(tempMerchantTradeNo);
        console.log(tempMerchantTradeDate)
        console.log(data);
        
    } catch (error) {
        console.error('Error calculating checksum:', error);
    }
  }
  
};


React.useEffect(() => {
  console.log(merchantTradeNo);
  console.log(merchantTradeDate);
}, [merchantTradeNo, merchantTradeDate]);



  const generateMerchantTradeNo = () => {
    // 取得目前的日期時間
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
  
    // 生成特店交易編號，組合日期時間部分和隨機數字部分
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const merchantTradeNo = `${year}${month}${day}${hour}${minute}${second}${randomDigits}`;
    // 截取前20個字元
     return merchantTradeNo.substring(0, 20);
  };

  // 取得當前時間
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');


    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  };


  React.useEffect(() => {
    if (shouldSubmitForm && checksum) {
      const button = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      const form = document.getElementById('paymentForm') as HTMLFormElement | null;
      if (form) {
     
        // // 添加 ECPay 的 POST URL
        form.action = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
        // 指定方法為 POST
        form.method = "POST";
        // 設置 CheckMacValue 的值
        const checkMacValueInput = document.createElement('input');
        checkMacValueInput.type = 'hidden';
        checkMacValueInput.name = 'CheckMacValue';
        checkMacValueInput.value = checksum;
        form.appendChild(checkMacValueInput);
        // 提交表單
        form.submit();
        const formData = new FormData(form);
        const formDataObject: Record<string, string> = {};
        formData.forEach((value, key) => {
          formDataObject[key] = value as string;
        });
        console.log('Form submitted with data:', formDataObject);
        
      }
      button&&button.click();
    }
  }, [shouldSubmitForm, checksum]);



  
React. useEffect(() => {
  const timer = setTimeout(() => {
    const button = submitButtonRef.current;
    button && button.click();
  }, 1000);  

  return () => clearTimeout(timer); 
}, []); 

  // React.useLayoutEffect(() => {
  //   const timer = setTimeout(() => {
  //     const button = submitButtonRef.current;
  //     button && button.click();
  //   }, 1000);  

  //   return () => clearTimeout(timer); 
  // }, [submitButtonRef.current]);

  return (
    <form id="paymentForm" onSubmit={handleSubmit}>
      {/* 將檢查碼隱藏在表單中 */}
      {/* {checksum && <input type="hidden" name="CheckMacValue" value={checksum} />} */}
      {/* 將其他資料也添加到隱藏的 input 元素中 */}
      <input type="hidden" name="MerchantID" value="3002607" />
      <input type="hidden" name="MerchantTradeNo" value={merchantTradeNo} />
      <input type="hidden" name="MerchantTradeDate" value={merchantTradeDate} />
      <input type="hidden" name="PaymentType" value="aio" />
      <input type="hidden" name="TotalAmount" value={totalAmount} />
      <input type="hidden" name="TradeDesc" value="Transaction description" />
      <input type="hidden" name="ItemName" value={`贊助企劃:${projectName}`}/>
      <input type="hidden" name="ReturnURL" value="http://test/ReturnURL" />
      <input type="hidden" name="ClientBackURL" value={returnURL} />
      <input type="hidden" name="ChoosePayment" value="ALL" />
      <input type="hidden" name="EncryptType" value={1} />
      <button ref={submitButtonRef} type="submit" style={{ display: 'none' }}></button>
    </form>
  );
};

export default PaymentForm;
