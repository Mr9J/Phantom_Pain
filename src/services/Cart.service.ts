

const baseUrl = import.meta.env.VITE_API_URL;


export const addToCart = (productId:number, projectId:number, memberId:number) => {
    return fetch(`${baseUrl}/Cart/${productId}/${projectId}/${memberId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
          
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // 无需接收数据，直接返回成功
            return console.log("加入購物車成功");
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            throw error;
        });
};


export const getLoadCartPage = (memberId:number)=>{
    return fetch(`${baseUrl}/Cart/${memberId}`)
    .then(response =>{
        console.log(response)
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // 在這裡處理從 API 返回的數據
        return data;
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        throw error; // 將錯誤向外傳遞
    });


}


export const deleteProductFromCart = (productId:number,memberId:number) =>{
    return fetch(`${baseUrl}/Cart/${productId}/${memberId}`, {
        method: 'Delete',
        headers: {
            'Content-Type': 'application/json'
        },
      
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // 无需接收数据，直接返回成功
        return console.log("購物車商品刪除成功");
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        throw error;
    });

}



