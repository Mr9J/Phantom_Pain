import PropTypes from 'prop-types';

function Projectcard(props) {
    const { projectData } = props;

  
    const listitem = projectData&&projectData.map(item => (
      // <div className="container"></div>
  <div key={item.projectName} className="border-2 border-t-emerald-50 border-b-emerald-50" >
    <div className="container flex flex-col lg:flex-row">
      <div className="float-left w-full lg:w-1/3 mr-4 h-full">
<img
//  src商品圖片
src={`${item.thumbnail}`}
alt="Description"
className="w-auto max-w-full"
/>
      </div>
      {/* 原本有flex-1 */}
      <div className="py-2 px-4">
        {/* 傳到project詳細頁面 */}
        <a href="/projects/koizumi-wirelessionfan">
          <a className="mt-1 font-bold mb-10 text-xl" href={`/project/${item.projectId}`}>{item.projectName}</a>
        </a>
        <div className="text-neutral-600 text-xs mb-4">
          <span className="mr-1 dark:text-white text-base">提案人</span>
          
           {/* a傳到提案人頁面 */}
          <a className="font-bold text-zec-blue text-sm mt-5 dark:text-cyan-400" href="/users/tw-irisohyama">
          {item.member.nickname}
          {/* 提案人 */}
          </a>
          <span className="mx-2 dark:text-white">|   預購式專案</span>
       
        </div>
        {/* 傳入目標金額跟總募款金額 */}
        <span className="font-bold text-lg">NT$ {item.total.toLocaleString()}</span>
        <span className="text-sm text-neutral-600 dark:text-white">
          / 目標 {item.projectGoal.toLocaleString()}
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
  