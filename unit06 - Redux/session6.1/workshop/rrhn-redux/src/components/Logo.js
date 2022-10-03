import React from 'react';

export function Logo(props) {
  const title = props.title || "React-redux Hacker News"
  return  <div className="Logo">
    <div className="colored">RrHN</div>
    <div className="title">{title}</div>
  </div>
}
