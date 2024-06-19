import {
  PostDTO,
  NewPostDTO,
  UpdatePostDTO,
  NewUpdatePostDTO,
  ICommentPost,
  SearchTerm,
  PostImageDTO,
} from "@/types";
import { S3 } from "@/config/R2";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

export async function createPost(post: PostDTO) {
  try {
    const newPost: NewPostDTO = {
      caption: post.caption,
      location: post.location,
      tags: post.tags,
      file: post.userId + "/" + post.id,
      userId: post.userId,
    };

    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const promises = post.file.map(async (img, index) => {
      try {
        await S3.send(
          new PutObjectCommand({
            Bucket: "mumu",
            Key: `Posts/${post.userId}/${post.id}/${index}.jpg`,
            Body: img,
            ContentType: "image/jpeg",
          })
        );
      } catch (error) {
        console.error(`Error uploading file ${index}:`, error);
      }
    });

    await Promise.all(promises);

    const res = await axios.post(`${URL}/post/create-post`, newPost, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts(page: number) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const data = await axios.get(`${URL}/Post/get-posts/${page}`, {
      headers: { Authorization: jwt },
    });

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function likePost(postId: string, userId: string) {
  try {
    const jwt = localStorage.getItem("token");

    const data = await axios.post(
      `${URL}/Post/like-post`,
      { postId, userId },
      { params: { postId, userId }, headers: { Authorization: jwt } }
    );

    if (data.status !== 200) throw Error;

    return data.data;
  } catch (error) {
    console.error(error);
    if (error.response.data === "找不到該貼文") {
      return "找不到該貼文，請重新整理頁面";
    }
  }
}

export async function followUserCheck(followerId: string, followingId: string) {
  try {
    const res = await axios.get(
      `${URL}/Post/follow-check/${followerId}/${followingId}`
    );

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function likePostCheck(postId: string, userId: string) {
  try {
    if (postId === "" || userId === "")
      throw Error("postId or userId is empty");

    const jwt = localStorage.getItem("token");

    const res = await axios.get(
      `${URL}/Post/like-post-check/${postId}/${userId}`,
      {
        headers: { Authorization: jwt },
      }
    );

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function savePostCheck(postId: string, userId: string) {
  try {
    if (postId === "" || userId === "")
      throw Error("postId or userId is empty");

    const jwt = localStorage.getItem("token");

    const res = await axios.get(
      `${URL}/Post/save-post-check/${postId}/${userId}`,
      { headers: { Authorization: jwt } }
    );

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const jwt = localStorage.getItem("token");

    const data = await axios.post(
      `${URL}/Post/save-post`,
      { postId, userId },
      {
        params: { postId, userId },
        headers: { Authorization: jwt },
      }
    );

    if (data.status !== 200) throw Error;

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId: string) {
  try {
    if (postId === "") throw Error("postId is empty");

    const jwt = localStorage.getItem("token");

    const res = await axios.get(`${URL}/Post/get-post/${postId}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updatePost(post: UpdatePostDTO) {
  const isNewImg = post.file.length > 0;

  try {
    const updatePost: NewUpdatePostDTO = {
      caption: post.caption,
      location: post.location,
      tags: post.tags,
      file: post.id,
      userId: post.userId,
      postId: parseInt(post.postId),
    };

    if (isNewImg) {
      updatePost.file = post.userId + "/" + Date.now().toString() + post.userId;

      const promises = post.file.map(async (img, index) => {
        try {
          await S3.send(
            new PutObjectCommand({
              Bucket: "mumu",
              Key: `Posts/${updatePost.file}/${index}.jpg`,
              Body: img,
              ContentType: "image/jpeg",
            })
          );
        } catch (error) {
          console.error(`Error uploading file ${index}:`, error);
        }
      });

      await Promise.all(promises);
    }

    const jwt = localStorage.getItem("token");
    if (!jwt) throw Error;

    const response = await axios.patch(
      `${URL}/post/update-post/${post.postId}`,
      updatePost,
      {
        headers: { Authorization: jwt },
      }
    );
    if (response.status !== 200) throw Error;

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId: string) {
  try {
    const jwt = localStorage.getItem("token");

    const res = await axios.delete(`${URL}/post/delete-post/${postId}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
    if (error.response.data === "找不到該貼文或權限不足") {
      return "找不到該貼文或權限不足";
    }
  }
}

export async function commentPost(comment: ICommentPost) {
  try {
    const jwt = localStorage.getItem("token");

    const res = await axios.post(`${URL}/Post/comment-post`, comment, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCommentsPost(postId: string) {
  try {
    const jwt = localStorage.getItem("token");

    const res = await axios.get(`${URL}/Post/get-comments/${postId}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSavedPosts(page: number) {
  try {
    const jwt = localStorage.getItem("token");

    const res = await axios.get(`${URL}/Post/get-saved-posts/${page}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostImg(imgUrl: string) {
  try {
    const imgArr = await S3.send(
      new ListObjectsV2Command({
        Bucket: "mumu",
        Prefix: `Posts/${imgUrl}/`,
      })
    );

    if (imgArr.KeyCount === 0) throw Error;

    if (imgArr.$metadata.httpStatusCode !== 200) throw Error;

    return imgArr.Contents;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchPosts(searchTerm: SearchTerm) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const posts = await axios.post(`${URL}/Post/search-posts`, searchTerm, {
      headers: { Authorization: jwt },
    });

    if (posts.status !== 200) throw Error;

    return posts.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecent3Posts(id: string) {
  try {
    const data = await axios.get(`${URL}/Post/get-recent-posts/${id}`);

    if (data.status !== 200) throw Error;

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostsById(id: string) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error("jwt is empty");

    const data = await axios.get(`${URL}/Post/get-posts-by-id/${id}`, {
      headers: { Authorization: jwt },
    });

    if (data.status !== 200) throw Error;

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function postImage(post: PostImageDTO) {
  try {
    const imageUrls: string[] = [];

    for (let index = 0; index < post.file.length; index++) {
      try {
        const img = post.file[index];
        let key;
        if (post.projectId.length > 0) {
          if (post.productId.length > 0) {
            key = `project-${post.projectId}/product-${post.productId}.jpg`;
          } else {
            key = `project-${post.projectId}/Thumbnail.jpg`;
          }
        }
        const upload = await S3.send(
          new PutObjectCommand({
            Bucket: "Projects",
            Key: key,
            Body: img,
            ContentType: "image/jpeg",
          })
        );

        if (upload.$metadata.httpStatusCode === 200) {
          let imageUrl = "";
          if (post.productId.length > 0) {
            imageUrl = `https://cdn.mumumsit158.com/Projects/project-${post.projectId}/product-${post.productId}.jpg`;
          } else {
            imageUrl = `https://cdn.mumumsit158.com/Projects/project-${post.projectId}/Thumbnail.jpg`;
          }
          imageUrls.push(imageUrl);
        }
      } catch (error) {
        console.error(`Failed to upload image ${index}:`, error);
      }
    }

    return imageUrls;
  } catch (error) {
    console.error("Failed to upload images:", error);
    throw error;
  }
}

export async function followUser(userId: string) {
  try {
    const jwt = localStorage.getItem("token");

    if (!jwt) throw Error;

    const res = await axios.get(`${URL}/Post/follow/${userId}`, {
      headers: { Authorization: jwt },
    });

    if (res.status !== 200) throw Error;

    return res.data;
  } catch (error) {
    console.error(error);
  }
}
