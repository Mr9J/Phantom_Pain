import { useEffect, useState } from "react";
import { getLoadCartPage, deleteProductFromCart } from "@/services/Cart.service";

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
    const [memberCartData, setCartPageData] = useState<CartDetailDTO[]>();


    useEffect(() => {
        async function fetchCartData() {
            try {
                const data = await getLoadCartPage(testmemberId);
                const updatedData = data.map((item:CartDetailDTO) => ({
                    ...item,
                    products: item.products&&item.products.map(product => ({
                        ...product,
                        isVisible: true
                    }))
                }));
                setCartPageData(updatedData);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        }

        fetchCartData();
    }, [testmemberId]);

    const deleteProduct = async (productId:number) => {
        console.log(productId);
        try {
            await deleteProductFromCart(productId, testmemberId);
            // 更新 memberCartData 中对应产品的 isVisible 状态为 false
            const updatedData = memberCartData&&memberCartData.map(project => ({
                ...project,
                products: project.products&&project.products.map(product =>
                    product.productId === productId
                        ? { ...product, isVisible: false }
                        : product
                )
            }));
            setCartPageData(updatedData);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
        if (!memberCartData || memberCartData.length === 0) {
            return (
                <div className="container my-8 px-4 mb-8 ml-60">
                    <h1 className='text-3xl font-semibold mb-1'>購物車是空的</h1>
                </div>
            );
            }
    }

    return (
        <div className="container my-8 px-4 mb-8 ml-60">
            <div className='flex flex-col-reverse lgl:flex-row gap-5'>
                <div className='w-[92%] lgl:w-[74%] flex flex-col gap-6  lgl:my-10 mx-auto lgl:ml-5'>
                    <div className='w-full  bg-white py-7 px-5'>
                        <h1 className='text-3xl font-semibold mb-1'>Mumu 購物車</h1>
                        <hr />
                        {memberCartData && memberCartData.map((item) => {
                            const visibleProducts = item.products&&item.products.filter(product => product.isVisible);
                            if (visibleProducts&&visibleProducts.length === 0) {
                                return null; // 不渲染没有可见产品的项目
                            }
                            return (
                                <div key={item.projectId}>
                                    <div className="border-spacing-8 mx-7 my-6">
                                        <img className='mx-4 rounded-full float-start w-24' src={item.thumbnail?.toString()} alt="projectImage" />
                                        {item.projectName}
                                    </div>
                                    <br></br>
                                    {visibleProducts&&visibleProducts.map(product => (
                                        <div key={product.productId} className='w-full border-b-[2px] border-b-gray-100 p-4 flex gap-5 bg-slate-100 rounded-lg my-1'>
                                            <div className='float-left w-64'>
                                                <img className='mx-auto' src={product.thumbnail?.toString()} alt="productImage" />
                                            </div>
                                            <div className='w-4/5 flex flex-col -mt-5'>
                                                <br></br>
                                                <h2 className='text-[25px] font-medium -mt-2'>{product.productName}</h2>
                                                <p className='text-green-700 font-semibold text-[16px]'>有存貨</p>
                                                <div className='flex flex-row justify-between mt-2'>
                                                    <div className='flex items-center justify-center'>
                                                    <div className="flex items-center justify-center space-x-2 mb-4">
      <button className={`px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300`}>-</button>
      <span className="font-bold">

    {product.count}
  
        </span>  
      <button className={`px-3 py-2 bg-gray-200 rounded cursor-pointer font-black hover:bg-slate-300`}>+</button>
    </div>
                                                    </div>
                                                    <span className="flex flex-auto mx-2">NT$ {product.productPrice.toLocaleString()}</span>
                                                    <button className='text-blue-600' onClick={() => deleteProduct(product.productId)}>刪除</button>
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
