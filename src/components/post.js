import React from "react";

import "./style.css";

function lookup(type) {
  if (type === "hair cut") return <div className="Cu">Cu</div>;
  else if (type === "protein treatment")
    return <div className="label Pr">Pr</div>;
  else if (type === "hair color") return <div className="label HC">HC</div>;
  else if (type === "deep conditioning")
    return <div className="label DC">DC</div>;
  else if (type === "clarifying") return <div className="label C">C</div>;
  else return "";
}

export default function Post({ date, post, allPosts, modalOpener }) {
  if (post) {
    return (
      <div className="date-tile" onClick={() => modalOpener(post)}>
        <div className="date">{date}</div>
        <div className="post-elements">
          {post.rating}
          <img className="post-thumbnail" src={post.media[0].mediaurl} alt="" />
          {post.typeofday.map((t) => lookup(t))}
        </div>
      </div>
    );
  } else
    return (
      <div className="date-tile">
        <div className="date">{date}</div>
      </div>
    );
}
