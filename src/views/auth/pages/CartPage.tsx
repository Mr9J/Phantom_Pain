import { useEffect, useState } from "react";
import { getLoadCartPage, deleteProductFromCart,putProductFromCart } from "@/services/Cart.service";

interface CartDetailDTO {
    projectId: number;
    projectName?: string | null;
    thumbnail?: string | null;
    products?: ProductDataInCartDTO[] | null;
  }
  
  interface ProductDataInCartDTO {
    thumbnail?: string | null;
    productId: number;
    productName?: string | null;
    productPrice: number;
    currentStock: number;
    count?: number | null;
    isVisible: boolean;
  }
  

function CartPage() {
    const testmemberId = 6;
    const [memberCartData, setMemberCartData] = useState<CartDetailDTO[]>();


    useEffect(() => {
        fetchShoppingCart();
    }, []);



    const fetchShoppingCart = async () => {
        try {
            const data = await getLoadCartPage(testmemberId);
            setMemberCartData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleIncrement = async (projectId: number, productId: number , increment :string) => {
        try{      
            await putProductFromCart(productId,testmemberId,increment);
            await fetchShoppingCart();
        }
        catch (error) {
            console.error(error);
        }
        console.log(`projectId:${projectId}productId:${productId}`);
        
        // 发送增加数量的请求
    };

    const handleDecrement = async (projectId: number, productId: number,decrement:string) => {
        try{      
            await putProductFromCart(productId,testmemberId,decrement);
            await fetchShoppingCart();
        }
        catch (error) {
            console.error(error);
        }
        console.log(`projectId:${projectId}productId:${productId}`);
        
    };

   
    const handleDeleteProduct = async (productId: number) => {
        try {
            await deleteProductFromCart(productId, testmemberId);
            await fetchShoppingCart();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container my-8 px-4 mb-8 ml-60">
            <div className='flex flex-col-reverse lgl:flex-row gap-5'>
                <div className='w-[92%] lgl:w-[74%] flex flex-col gap-6  lgl:my-10 mx-auto lgl:ml-5'>
                    <div className='w-full  bg-white py-7 px-5'>
                        <h1 className='text-3xl font-semibold mb-1'>Mumu 購物車</h1>
                        <hr />
                        {memberCartData&&memberCartData.map((item) => {

                            return (
                                <div key={item.projectId}>
                                    <div className="border-spacing-8 mx-7 my-6">
                                        <img className='mx-4 rounded-full float-start w-24' src={item.thumbnail?.toString()} alt="projectImage" />
                                        {item.projectName}
                                    </div>
                                    <br></br>
                                    {item.products&&item.products.map(product => (
                                        <div key={product.productId} className='w-full border-b-[2px] border-b-gray-100 p-4 flex gap-5 bg-slate-100 rounded-lg my-1'>
                                            <div className='float-left w-64'>
                                                <img className='mx-auto' src={product.thumbnail?.toString()} alt="productImage" />
                                            </div>
                                            <div className='w-4/5 flex flex-col -mt-5'>
    <br />
    <h2 className='text-[25px] font-medium -mt-2'>{product.productName}</h2>
    <div className="flex items-center">
        <span className='text-green-700 font-semibold text-[16px] flex-2 mr-5'>有存貨</span>
        <div className="flex items-center justify-center space-x-2 mb-1">
            {Number(product.count) === 1 ? (
                <button className={`px-4 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300`}>-</button>
            ) : (
                <button className={`px-4 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300`} onClick={() => handleDecrement(item.projectId, product.productId ,"Decrement")}>-</button>
            )}
            <span className="font-bold">{product.count}</span>
            <button className={`px-4 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300`} onClick={() => handleIncrement(item.projectId, product.productId,"Increment")}>+</button>
        </div>
    </div>
    <div className='flex flex-row justify-between mt-2'>
        <span className="flex flex-auto mx-2 my-0">NT$ {(product.productPrice * Number(product.count)).toLocaleString()}</span>
        <button className='text-blue-600' onClick={() => handleDeleteProduct(product.productId)}>刪除</button>
    </div>
</div>

                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                    <div className='w-full hidden mdl:block bg-white h-16'>
                    </div>
                    <div className='xs:block mdl:hidden'>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
