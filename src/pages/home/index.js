/* Copyright 2021 Nathan Drapeza, Xingjie He, Warren Stix, Yifan Wu
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

import { Card } from "antd-mobile";
import { Button, Form, Input, message, Switch, Upload, Select } from "antd";
import "./index.css";
import { client } from "../../http";
import store from "../../store/store";
import visCheck from "../../posts";
import { Remark, useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";

const { Option } = Select;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const App = (_) => {
  const history = useHistory();

  const [isMd, setIsMd] = useState(false);

  const [postForm] = Form.useForm();

  // need this to get everything reset
  const [switchChecked, setSwitchChecked] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentEnable, setContentEnable] = useState(true);
  const [visibility, setVisibility] = useState("PUBLIC");

  // create a post
  const sendPost = async (data) => {
    setIsLoading(true);

    data["authorId"] = store.getState().login.id;
    if (isMd) {
      data["contentType"] = "text/markdown";
    }
    if (!contentEnable) {
      data["contentType"] = "image/png;base64";
    }
    data["visibility"] = visibility;

    const result = await client.post("posts", data);

    postForm.resetFields();
    setSwitchChecked(false);
    setIsMd(false);
    setHasContent(false);
    setIsLoading(false);

    if (result.status == 200) {
      message.success("Post successfully posted!");
      await getPostList();
    }
  };

  const [postList, setPostList] = useState([]);

  // need this or ordered lists render all screwy
  const customLi = (props) => <li style={{ marginLeft: "2em" }} {...props} />;

  const [previewText, setPreviewText] = useRemark({
    remarkPlugins: [remarkGemoji],
    rehypeReactOptions: {
      components: { li: customLi },
    },
  });
  const checkContent = (changedFields, _) => {
    for (let field of changedFields) {
      if (field.name[0] === "content") {
        if (field.value.length > 0) {
          setHasContent(true);
          setPreviewText(field.value);
        } else {
          setHasContent(false);
        }
      }
    }
  };

  // get post list function
  const getPostList = useCallback(async () => {
    const userLogin = JSON.parse(localStorage.getItem('userinfo'))
    const result = await client.get("posts?fid=" + userLogin.id);
    if (result.status === 200) {
      console.log(result.data);
      const myId = store.getState().login?.id;
      let filteredData = [];
      for (const item of result.data) {
        if (myId !== null && !(await visCheck(item, myId))) {
          break;
        }

        if (
          item.contentType === "image/png" ||
          item.contentType === "image/jpeg" ||
          item.contentType === "image/jpg"
        ) {
          const base64 = "data:image/png;base64," + item.content.split("'")[1];
          item.imgSrc = base64;
        }
        if (
          item.contentType === "image" ||
          item.contentType === "image/png;base64" ||
          item.contentType === "image/jpeg;base64"
        ) {
          item.imgSrc = item.content;
        }
        filteredData.push(item);
      }

      setPostList(filteredData);
    }
  }, []);

  // Get list on initialization
  useEffect(async () => {
    const loginUser = localStorage.getItem("userinfo");
    localStorage.clear();
    localStorage.setItem("userinfo", loginUser);
    await getPostList();
  }, []);

  // Upload image button clicked
  const selectImgUpload = () => {
    setContentEnable(false);
  };

  return (
    <div className="home w1200">
      <div className="today"></div>

      <Form
        {...layout}
        name="nest-messages"
        onFinish={sendPost}
        onFieldsChange={checkContent}
        form={postForm}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="please input your post's title" />
        </Form.Item>

        <Form.Item label="CommonMark?">
          <Switch
            style={{ marginLeft: "0.25em" }}
            onChange={() => {
              setIsMd(!isMd);
              setSwitchChecked(!switchChecked);
            }}
            checked={switchChecked}
            disabled={!contentEnable}
          />
          <Upload
            beforeUpload={(file) => {
              console.log(file);
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                postForm.setFieldsValue({
                  content: reader.result,
                });
              };
              return false;
            }}
          >
            <Button
              type={"primary"}
              style={{ width: "150px", marginLeft: "20px" }}
              onClick={selectImgUpload}
            >
              Upload image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="visibility" label="visibility">
          <Select defaultValue="PUBLIC" onChange={(v) => setVisibility(v)}>
            <Option value="PUBLIC">Public</Option>
            <Option value="FRIENDS ONLY">Friends Only</Option>
            <Option value="AUTHOR ONLY">Self</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="Post Text"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            placeholder="please input your post's text"
            disabled={!contentEnable}
          />
        </Form.Item>

        {isMd && hasContent ? (
          <Form.Item label="Preview">
            <Card>
              <div
                style={{
                  paddingTop: "0.2em",
                  paddingBottom: "0.2em",
                  paddingLeft: "0.4em",
                  paddingRight: "0.4em",
                }}
              >
                {previewText}
              </div>
            </Card>
          </Form.Item>
        ) : null}

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Post
          </Button>
        </Form.Item>
      </Form>

      <div>
        {postList.map((item) => (
          <Card
            style={{ marginTop: "10px", marginBottom: "10px" }}
            onClick={() => {
              localStorage.setItem(item.id, JSON.stringify(item));
              const param = item.id;
              history.push(`/individualpost/${param}`);
            }}
          >
            <Card.Header
              title={
                <div style={{ marginLeft: 10, fontSize: 14 }}>
                  {item.author.displayName}
                </div>
              }
              thumb={
                <img
                  style={{ width: 35, borderRadius: 10 }}
                  src={item.author.profilePic ? item.author.profilePic : require("../../assets/default.png").default}
                />}
              thumbStyle={{ width: 35, borderRadius: 10 }}
            />
            <Card.Body>
              <h4>{item.title}</h4>
              <div style={{ marginBottom: "3px" }}>
                {item.contentType === "image/png" ||
                item.contentType === "image/jpeg" ||
                item.contentType === "image/jpg" ||
                item.contentType === "image" ||
                item.contentType === "image/png;base64" ||
                item.contentType === "image/jpeg;base64" ? (
                  <img src={item.imgSrc} width={"100%"} />
                ) : item.contentType === "text/markdown" ? (
                  <Remark
                    remarkPlugins={[remarkGemoji]}
                    rehypeReactOptions={{
                      components: { li: customLi },
                    }}
                  >
                    {item.content}
                  </Remark>
                ) : (
                  item.content
                )}
              </div>
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
                    {item.commentCount}
                  </div>
                  <i className="iconfont icon-dianzan"></i>
                  <div
                    style={{
                      marginLeft: 5,
                      display: "inline-block",
                      width: 35,
                    }}
                  >
                    {item.likeCount}
                  </div>
                  <div style={{ marginLeft: 10, display: "inline-block" }}>
                    {item.foreignNodeId
                      ? `Source: ${item.foreignNodeHost}`
                      : null}{" "}
                    @ {new Date(item.published).toLocaleString()}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default App;
