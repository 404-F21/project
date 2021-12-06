/* Copyright 2021 Nathan Drapeza, Xingjie He, Yifan Wu
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

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const loginReducer = (
  state = JSON.parse(localStorage.getItem("userinfo")),
  action
) => {
  switch (action.type) {
    case "loginSuccess":
      return action.payload;
    default:
      return state;
  }
};
const homeReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
const rootReducer = combineReducers({
  login: loginReducer,
  home: homeReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
