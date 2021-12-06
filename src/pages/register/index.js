/* Copyright 2021 Nathan Drapeza, Warren Stix
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

import React, { useState } from "react";
import "./login.css";
import { useHistory } from "react-router-dom";
import { Input, message } from "antd";
import { client } from "../../http";
const Register = (_) => {
  const history = useHistory();

  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [github, setGithub] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reg = async (event) => {
    event.preventDefault();

    if (
      judge(displayName, "Please input display name") &&
      judge(github, "Please input github address") &&
      judge(password, "Please input password") &&
      judge(
        password === confirmPassword,
        "The password is not equal to the confirmation password"
      ) &&
      judgePassword(password)
    ) {
      let user = { displayName, password, github };
      const ret = await client.post("authors/", user);
      if (ret.status >= 200 && ret.status < 400) {
        message.success("registered successfully!");
        history.replace("/login");
      }
    }
  };

  const judge = (cond, msg) => {
    !cond && message.warn(msg);
    return cond;
  };
  const judgePassword = (pass) => {
    if (pass.length < 8) {
      message.warn("Password length must larger than 8");
      return false;
    }
    return true;
  };
  return (
    <div className="bg">
      <div className="login">
        <div className="logincon">
          <div style={{ textAlign: "center", margin: "50px 0 30px" }}>
            <img src={require("../../assets/logo.png").default} alt="" />
          </div>
          <form className="loginform" onSubmit={reg}>
            <Input
              className="input"
              type="text"
              placeholder="display name"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Input
              type="password"
              className="input pwd"
              placeholder="password"
              name="pwd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              className="input pwd"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Input
              className="input"
              type="text"
              placeholder="github address"
              name="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />

            <button className="loginbtn" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
