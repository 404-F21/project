/* Copyright 2021 Nathan Drapeza, Xingjie He, Yifan Wu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Button, Input, message } from "antd";
import "./index.css";
import { client } from "../../http";
import store from "../../store/store";
import { Remark } from "react-remark";
import remarkGemoji from "remark-gemoji";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const IndividualPost = (props) => {
  const [commentInput, setCommentInput] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  const history = useHistory();

  // Get user info
  const userinfoLocal = JSON.parse(localStorage.getItem("userinfo"));

  // send comment
  const comment = async (data) => {
    if (!postData) {
      message.warn("please waitting");
      return;
    }
    if (!commentInput) {
      message.warn("please input your comment");
      return;
    }
    if (userinfoLocal) {
      if (postData.foreignNodeId) {
        // social-dis
        if (postData.foreignNodeHost.indexOf("social-dis") !== -1) {
          const url = window.btoa(postData.comments);
          const result = await client.post(
            `foreign-data/${postData.foreignNodeId}/${url}`,
            {
              type: "comment",
              comment: commentInput,
              contentType: "text/plain",
              published: new Date().getTime() / 1000,
              author: {
                ...userinfoLocal,
                id: userinfoLocal.url,
                type: "author",
                password: "###",
              },
            }
          );
          if (result.status === 200 && result.data.id) {
            message.success("comment posted successfully!");
            setCommentInput("");
            updateCommentList();
          }
        }
      } else {
        const result = await client.post(`post/${postData.id}/comments/`, {
            authorId: store.getState().login.id,
            postId: postData.postId,
            text: commentInput,
        });

        if (result.status == 200) {
          message.success("comment posted successfully!");
          setCommentInput("");
          updateCommentList();
        }
      }
    } else {
      message.warn("Please login first");
    }
  };
  // post data state
  const [postData, setPostData] = useState(null);

  // fetch post data from server
  useEffect(async () => {
    let id = props.match?.params?.id;
    if (id) {
      const jsonString = localStorage.getItem(id);
      const item = JSON.parse(jsonString);
      setPostData(item);
      if (
        item.foreignNodeId &&
        item.foreignNodeHost.indexOf("linkedspace") !== -1
      ) {
        // get like count from linkedspace node
        const authorId = item.author.url.split("/").pop();
        const urlSplit = item.remoteId.split("/");
        urlSplit.pop();
        const postId = urlSplit.pop();
        const url = window.btoa(
          `https://linkedspace-staging.herokuapp.com/api/author/${authorId}/posts/${postId}/likes/`
        );
        const result = await client.get(
          `foreign-data/${item.foreignNodeId}/${url}`
        );
        if (result.status === 200) {
          setLikeCount(result.data.items.length);
        }
      } else {
        setLikeCount(item.likeCount);
      }
    }
  }, []);

  const [commentList, setCommentList] = useState([]);

  // update comment list function
  const updateCommentList = useCallback(async () => {
    if (postData) {
      let res = { status: 0 };
      if (postData.foreignNodeId) {
        let urlBase64;
        // linkedspace comments
        if (
          postData.foreignNodeHost.indexOf(
            "linkedspace-staging.herokuapp.com"
          ) !== -1
        ) {
          const url = postData.comments.replace(
            "linkedspace-staging.herokuapp.com/author",
            "linkedspace-staging.herokuapp.com/api/author"
          );
          urlBase64 = window.btoa(url);
        }
        if (
          postData.foreignNodeHost.indexOf("social-dis.herokuapp.com") !== -1
        ) {
          urlBase64 = window.btoa(postData.comments);
        }
        if (postData.foreignNodeHost.indexOf("project-api-404") !== -1) {
          urlBase64 = window.btoa(postData.comments);
        }
        res = await client.get(
          `foreign-data/${postData.foreignNodeId}/${urlBase64}`
        );
        if (res.status === 200) {
          // social-dis group comments
          setCommentList(res.data.comments);
        }
      } else {
        res = await client.get(`post/${postData.id}/comments/`);
        if (res.status === 200) {
          setCommentList(res.data);
        }
      }
    }
  }, [postData]);

  // fetch comments
  useEffect(async () => {
    await updateCommentList();
  }, [postData]);

  // need this or ordered lists render all screwy
  const customLi = (props) => <li style={{ marginLeft: "2em" }} {...props} />;

  const likePost = async () => {
    if (!postData) {
      message.success("please waitting!");
      return;
    }
    let result;
    if (postData.foreignNodeId) {
      // social-dis
      if (postData.foreignNodeHost.indexOf("social-dis") !== -1) {
        const postId = postData.remoteId.split("/").pop();
        const authorId = postData.author.url.split("/").pop();
        const url = window.btoa(
          `https://social-dis.herokuapp.com/author/${authorId}/posts/${postId}/likes`
        );
        result = await client.post(
          `foreign-data/${postData.foreignNodeId}/${url}`,
          {
            author: {
              ...userinfoLocal,
              id: userinfoLocal.url,
              type: "author",
              password: "###",
            },
          }
        );
        if (result.status === 200) {
          if (result.data.type === "Like") {
            message.success("liked!");
            setLikeCount(likeCount + 1);
          }
          if (result.data.message[0].indexOf("duplicate key") !== -1) {
            message.warn("already liked!");
          }
        } else {
          message.warn("something wrong!");
        }
      }
      // linked-space
      if (postData.foreignNodeHost.indexOf("linkedspace") !== -1) {
        const authorId = postData.author.url.split("/").pop();
        const url = window.btoa(
          `https://linkedspace-staging.herokuapp.com/api/author/${authorId}/inbox/`
        );
        const result = await client.post(
          `foreign-data/${postData.foreignNodeId}/${url}`,
          {
            type: "like",
            object: postData.remoteId,
            "@context": "https://www.w3.org/ns/activitystreams",
            author: {
              type: "author",
              ...userinfoLocal,
              // id: 'https://cmput404f21t17.herokuapp.com/service/author/4e9deafd-29bf-4f18-92d7-954c3322bd53',
              id: userinfoLocal.url,
              password: "###",
            },
          }
        );
        if (result.status === 200 && result.data.type === "inbox") {
          if (result.data.items.length === likeCount) {
            message.warn("already liked!");
          } else {
            message.success("liked!");
            setLikeCount(likeCount + 1);
          }
        } else {
          message.warn("something wrong!");
        }
      }
      // project-404-api
      if (postData.foreignNodeHost.indexOf("project-api-404") !== -1) {
        const authorId = postData.author.url.split("/").pop();
        const url = window.btoa(
          `https://project-api-404.herokuapp.com/api/author/${authorId}/inbox/`
        );
        const result = await client.post(
          `foreign-data/${postData.foreignNodeId}/${url}`,
          {
            type: "like",
            author: {
              type: "author",
              ...userinfoLocal,
              // id: 'https://cmput404f21t17.herokuapp.com/service/author/4e9deafd-29bf-4f18-92d7-954c3322bd53',
              id: userinfoLocal.url,
              password: "###",
            },
            object: postData.remoteId,
          }
        );
        if (result.status === 200) {
          message.success("liked!");
          setLikeCount(likeCount + 1);
        } else {
          message.warn("something wrong!");
        }
      }
    } else {
      result = await client.post(`post/${postData.id}/like/`, {
        authorId: store.getState().login.id,
      });
      if (result.status == 200) {
        let { succ, count } = result.data;
        if (succ) {
          message.success("liked!");
          setLikeCount(count);
        } else {
          message.warn("already liked!");
        }
      }
    }
  };

  const resharePost = async () => {
    let result;
    if (postData?.foreignNodeId) {
      let content = postData?.content;
      let contentType = postData?.contentType;
      if (contentType.indexOf("image") !== -1) {
        contentType = "image/png;base64";
        content = postData?.imgSrc;
      }
      result = await client.post(`foreign-post/reshare/${userinfoLocal.id}/`, {
        title: postData.title,
        content,
        contentType,
      });
    } else {
      result = await client.post(
        `author/${postData.author.id}/posts/${postData.id}/reshare/`,
        {
          shareAid: userinfoLocal.id,
        }
      );
    }
    if (result.status === 200) {
      if (result.data.code === 200) {
        message.success("Reshare successfully!");
      } else {
        message.error(result.data.message);
      }
    } else {
      message.error("Something wrong...");
    }
  };

  return (
    <div className="indi w1200">
      <div className="posts-box">
        <div className="posts bgw">
          <div className="comments p15 bgw mt10">
            <div className="comments-item">
              <div className="user-title">
                <img
                  style={{ width: 30, height: 30, borderRadius: "50%" }}
                  src={require("../../assets/default.png").default}
                />
                <div className="username">
                  {postData?.authorId?.displayName}
                </div>
              </div>
              <h3>{postData?.title}</h3>
              <p>
                {postData?.contentType === "image/png" ||
                postData?.contentType === "image/jpeg" ||
                postData?.contentType === "image/jpg" ||
                postData?.contentType === "image" ||
                postData?.contentType === "image/png;base64" ||
                postData?.contentType === "image/jpeg;base64" ? (
                  <img src={postData?.imgSrc} width={"100%"} />
                ) : postData?.contentType === "text/markdown" ? (
                  <Remark
                    remarkPlugins={[remarkGemoji]}
                    rehypeReactOptions={{
                      components: { li: customLi },
                    }}
                  >
                    {postData?.content}
                  </Remark>
                ) : (
                  postData?.content
                )}
              </p>
              <div className="like">
                <div>
                  <i className="iconfont icon-xiaoxi"></i>
                  <div
                    style={{
                      marginLeft: 5,
                      display: "inline-block",
                      width: 35,
                    }}
                  >
                    {commentList.length ?? 0}
                  </div>
                  <span className="like-btn" onClick={likePost}>
                    <i className="iconfont icon-dianzan"></i>
                    <div
                      style={{
                        marginLeft: 5,
                        display: "inline-block",
                        width: 35,
                      }}
                    >
                      {likeCount ?? 0}
                    </div>
                  </span>
                  <span onClick={resharePost}>
                    <i
                      className="iconfont icon-fenxiang"
                      style={{ marginLeft: "10px" }}
                    ></i>
                    <span style={{ marginLeft: 5 }}>Reshare</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="top-news bgw">
          <h3>Author Info</h3>
          <div>
            <b>Author Name: </b>
            <span>{postData?.author?.displayName}</span>
          </div>
          <div>
            <b>URL: </b>
            <span style={{ color: "blue" }}>
              {postData?.foreignNodeId ? (
                <a href={postData?.author.url} target={"_blank"}>
                  Click to visit
                </a>
              ) : (
                <span
                  onClick={() => {
                    history.push("/user/" + postData?.author.id);
                  }}
                >
                  Click to visit
                </span>
              )}
            </span>
          </div>
          <div>
            <b>Github: </b>
            <span>{postData?.author?.github}</span>
          </div>
          <div>
            <b>Host Comes From: </b>
            <span>{postData?.author?.host}</span>
          </div>
        </div>
      </div>

      <div className="comment-list">
        {commentList.map((item) => (
          <div className="comment-item" key={item.commentId}>
            {postData.foreignNodeId ? (
              postData.foreignNodeHost.indexOf(
                "linkedspace-staging.herokuapp.com"
              ) !== -1 ? (
                <>
                  {/* Foreign format(linkedspace) */}
                  <div>{item.content}</div>
                  <div>
                    {item.author.displayName} @ {item.author.host} @{" "}
                    {new Date(item.published).toLocaleString()}
                  </div>
                </>
              ) : postData.foreignNodeHost.indexOf(
                  "social-dis.herokuapp.com"
                ) !== -1 ? (
                <>
                  {/* Foreign format(social-dis) */}
                  <div>{item.comment}</div>
                  <div>
                    {item.author.displayName} @ {item.author.host} @{" "}
                    {new Date(item.published).toLocaleString()}
                  </div>
                </>
              ) : null
            ) : (
              <>
                {/* Internal format */}
                <div>{item.text}</div>
                <div>
                  {item.authorId.displayName} @{" "}
                  {new Date(item.publishedOn).toLocaleString()}
                </div>
              </>
            )}
          </div>
        ))}
        {commentList.length === 0 ? (
          <div style={{ color: "#999" }}>
            Oop! It seems that no one has commented
          </div>
        ) : null}
      </div>

      <div className="comment-input">
        <Input
          placeholder="please input friendly comment"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <Button type="primary" onClick={comment}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default IndividualPost;
