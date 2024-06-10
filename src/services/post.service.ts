import { PostDTO, NewPostDTO, UpdatePostDTO, NewUpdatePostDTO } from "@/types";
import { S3 } from "@/config/R2";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";

const URL = import.meta.env.VITE_API_URL;

export async function createPost(post: PostDTO) {
  try {
    const newPost: NewPostDTO = {
      caption: post.caption,
      location: post.location,
      tags: post.tags,
      file: "",
      userId: post.userId,
    };

    for (let index = 0; index < post.file.length; index++) {
      try {
        const img = post.file[index];
        const upload = await S3.send(
          new PutObjectCommand({
            Bucket: "Tests",
            Key: `${post.userId}/${post.id}/${index}.jpg`,
            Body: img,
            ContentType: "image/jpeg",
          })
        );

        if (upload.$metadata.httpStatusCode === 200) {
          newPost.file += `https://cdn.mumumsit158.com/Tests/${post.userId}/${post.id}/${index}.jpg,`;
        }
      } catch (error) {
        console.error(error);
      }
    }

    console.log(newPost);

    const jwt = localStorage.getItem("token");
    if (!jwt) throw Error;

    const response = await axios.post(`${URL}/post/create-post`, newPost, {
      headers: { Authorization: jwt },
    });

    if (response.status !== 200) throw Error;

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts() {
  try {
    const jwt = localStorage.getItem("token");

    const data = await axios.get(`${URL}/Post/get-posts`, {
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

export async function likePostCheck(postId: string, userId: string) {
  try {
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

export async function deleteSavePost(postId: string, userId: string) {
  try {
    const jwt = localStorage.getItem("token");

    const data = await axios.post(
      `${URL}/Post/delete-save-post`,
      { postId },
      {
        headers: { Authorization: jwt },
      }
    );

    console.log(data.data);

    return data.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId: string) {
  try {
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
      file: "",
      userId: post.userId,
      postId: parseInt(post.postId),
    };

    if (isNewImg) {
      for (let index = 0; index < post.file.length; index++) {
        try {
          const img = post.file[index];

          const upload = await S3.send(
            new PutObjectCommand({
              Bucket: "Tests",
              Key: `${post.userId}/${post.id}/${index}.jpg`,
              Body: img,
              ContentType: "image/jpeg",
            })
          );

          if (upload.$metadata.httpStatusCode === 200) {
            updatePost.file += `https://cdn.mumumsit158.com/Tests/${post.userId}/${post.id}/${index}.jpg,`;
          }
        } catch (error) {
          console.error(error);
        }
      }
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
    console.log(postId);
  } catch (error) {
    console.error(error);
  }
}
