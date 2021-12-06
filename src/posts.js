/* Copyright 2021 Warren Stix
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

import { client } from "./http";

const visCheck = async (postData, userId) => {
  // support foreign posts(because foreign posts we fetched are all PUBLIC)
  if (postData.foreignNodeId) {
    return true
  }
  const visibility = postData.visibility.toLowerCase();
  const authorIsYou = postData.author.id === userId;

  if (visibility.includes("friends")) {
    const authorId = postData.author.id;
    const result = await client.get(`author/${userId}/friends/${authorId}`);
    if (result.status === 200) {
      return result.data.isFriend || authorIsYou;
    } else {
      return false;
    }
  } else if (visibility.includes("author")) {
    return authorIsYou;
  }
  return true;
};

export default visCheck;
