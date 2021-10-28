/* 
Source: https://pusher.com/tutorials/consume-restful-api-react/
By Fiyaso Afolayan, March 29, 2019
Used tutorial for getting data from api
*/

import React from 'react'

const Contacts = ({ contacts }) => {
  return (
    <div>
      {contacts.map((contact) => (
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{contact.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Published by {contact.authorId.displayName} on {contact.publishedOn}</h6>
            <p class="card-text">{contact.post_text}</p>
          </div>
        </div>
      ))}
    </div>
  )
};

export default Contacts;