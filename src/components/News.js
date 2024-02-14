import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=> {
   const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    // document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;

  const updateNews = async () => {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json();
    props.setProgress(70)

    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)

    props.setProgress(100)
  };

  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  },[])
  

  const fetchMoreData = async () => {
      const nextPage = page + 1;
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
      
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles))
      setTotalResults(parsedData.totalResults)
      setPage(nextPage)
  };

    return (
      <>
          <h1 className="text-center" style={{ margin: "35px 0px", marginTop:"75px" }}>
            NewsMonkey - Top {capitalizeFirstLetter(props.category)}{" "}
            Headlines
          </h1>
          {loading && <Spinner/>}
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length !== totalResults}
            loader={<Spinner/>}
          >
            <div className="container my-3">
            <div className="row">
              {articles.map((element) => {
                  return (
                    <div className="col-md-4 my-3 " key={element.url}>
                      <NewsItem
                        title={element.title ? element.title.slice(0, 83) : ""}
                        description={
                          element.description
                            ? element.description.slice(0, 90)
                            : ""
                        }
                        imageUrl={
                          element.urlToImage
                            ? element.urlToImage
                            : "https://static.toiimg.com/thumb/msid-106774784,width-1070,height-580,imgsize-39892,resizemode-75,overlay-toi_sw,pt-32,y_pad-40/photo.jpg"
                        }
                        newsUrl={element.url}
                        author={element.author ? element.author : "Unknown"}
                        date={new Date(element.publishedAt).toGMTString()}
                        source={element.source.name}
                      />
                    </div>
                  );
                })}
            </div>
            </div>
          </InfiniteScroll>
      </>
    );
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

export default News;
