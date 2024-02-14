import React from "react";

const NewsItem = (props) => {
    let { title, description, imageUrl, newsUrl, author, date, source } = props;
    return (
      <div className="card">
        <div>
        <span className="position-absolute badge rounded-pill bg-danger" style={{right:'0', display:'flex'}}>
          {source}
          <span className="visually-hidden">unread messages</span>
        </span>
        </div>
        <img src={imageUrl} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{title}...</h5>
          <p className="card-text">{description}...</p>
          <p className="my-3 card-text">
            <small className="text-muted">
              By {author} on {date}
            </small>
          </p>
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-dark"
          >
            Read More
          </a>
        </div>
      </div>
    );
}

export default NewsItem