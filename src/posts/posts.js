/* 
Source: https://pusher.com/tutorials/consume-restful-api-react/
By Fiyaso Afolayan, March 29, 2019
Used tutorial for getting data from api
*/

import React from "react";
function functiontest(e) {
  console.log(e.currentTarget.value);
}

const Contacts = ({ contacts }) => {
  return (
    <div>
      {contacts.map((contact) => (
        <div class="card" onClick={functiontest}>
          <div class="card-body">
            <h5 class="card-title">
              {contact.title}, {contact.postId}
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">
              Published by {contact.authorId.displayName} on{" "}
              {contact.publishedOn}
            </h6>
            <p class="card-text">{contact.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contacts;
