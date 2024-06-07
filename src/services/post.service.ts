import { PostDTO, NewPostDTO } from "@/types";
import { S3 } from "@/config/R2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
