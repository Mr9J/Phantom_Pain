function Comment() {
  return (
    <>
      <li>
        <div className="comment-main-level">
          <div className="comment-avatar">
            <img
              src="http://i9.photobucket.com/albums/a88/creaticode/avatar_2_zps7de12f8b.jpg"
              alt=""
            />
          </div>

          <div className="comment-box">
            <div className="comment-head">
              <h6 className="comment-name">
                <a href="http://creaticode.com/blog">Lorena Rojero</a>
              </h6>
              <span>hace 10 minutos</span>
              <i className="fa fa-reply"></i>
              <i className="fa fa-heart"></i>
            </div>
            <div className="comment-content">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit
              omnis animi et iure laudantium vitae, praesentium optio, sapiente
              distinctio illo?
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

export default Comment;
