import PropTypes from 'prop-types';

function Projectcard(props) {
    const { projectData } = props;
  
    const listitem = projectData&&projectData.map(item => (
      // <div className="container"></div>
  <div key={item.projectName} className="border-2 border-emerald-50" >
    <div className="container flex">
      <div className="float-left w-full lg:w-1/3 ml-64">
<img
//  src商品圖片
src={`${item.thumbnail}`}
alt="Description"
/>
      </div>
      {/* 原本有flex-1 */}
      <div className="py-2 px-4">
        {/* 傳到project詳細頁面 */}
        <a href="/projects/koizumi-wirelessionfan">
          <h2 className="mt-1 font-bold mb-1">{item.projectName}</h2>
        </a>
        <div className="text-neutral-600 text-xs mb-4">
          <span className="mr-1">提案人</span>
          
           {/* a傳到提案人頁面 */}
          <a className="font-bold text-zec-blue" href="/users/tw-irisohyama">
          {item.member.nickname}
          {/* 提案人 */}
          </a>
          <span className="mx-2">|</span>
          預購式專案
        </div>
        {/* 傳入目標金額跟總募款金額 */}
        <span className="font-bold">NT$ {item.total}</span>
        <span className="text-xs text-neutral-600">
          / 目標 {item.projectGoal}
        </span>
      </div>
    </div>
  </div>
  //<div key={item.id} className="container"></div> 
    ));
  
  
    return(
      <>
      {listitem}
      
  </>
    )
    
    
  
  }
  
Projectcard.propTypes = {
        projectData: PropTypes.array //類型檢查
      };
  export default  Projectcard;
  