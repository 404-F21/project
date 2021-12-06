/* Copyright 2021 Nathan Drapeza
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *		http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from "react";
import { TextareaItem, Toast } from "antd-mobile";
import "./index.css";
const DialogueFooter = () => {
  const [textValue, setTextValue] = useState("");
  const send = () => {
    if (!textValue) {
      Toast.info("input comment", 3);
      return;
    }
  };
  return (
    <div className="dialogueFooter">
      <TextareaItem
        autoHeight
        count={50}
        value={textValue}
        onChange={(val) => setTextValue(val)}
        placeholder="Add a comment"
        labelNumber={5}
      />
      <div className="btns">
        <span onClick={send}>Apply</span>
      </div>
    </div>
  );
};

export default DialogueFooter;
