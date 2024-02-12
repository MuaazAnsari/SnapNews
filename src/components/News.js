import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - NewsMonkey`;
  }

  updateNews = async () => {
    this.props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=90bc1dd6e4004ca59635148d8d820d09&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data = await fetch(url);
    this.props.setProgress(30)
    let parsedData = await data.json();
    this.props.setProgress(70)
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading:false
    });
    this.props.setProgress(100)
  };

  async componentDidMount() {
    this.updateNews();
  }

  // handlePrevClick = async () => {
  //   this.setState({
  //     page: this.state.page - 1,
  //   });
  //   this.updateNews();
  // };

  // handleNextClick = async () => {
  //   this.setState({
  //     page: this.state.page + 1,
  //   });

  //   this.updateNews();
  // };


  fetchMoreData = async () => {
    try {
      const nextPage = this.state.page + 1;
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=90bc1dd6e4004ca59635148d8d820d09&page=${nextPage}&pageSize=${this.props.pageSize}`;
      
      let data = await fetch(url);
      let parsedData = await data.json();
  
      // Calculate the total number of articles after fetching more data
      const totalArticles = this.state.articles.length + parsedData.articles.length;
  
      this.setState((prevState) => ({
        articles: prevState.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,
        page: nextPage,
        hasMore: totalArticles < parsedData.totalResults,
        loading: false  // Uncomment this if needed
      }));
    } catch (error) {
      console.error("Error fetching more data:", error);
      // Handle errors appropriately (e.g., set an error state)
    }
  };
  
  
  render() {
    return (
      <>
          <h1 className="text-center" style={{ margin: "35px 0px" }}>
            NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)}{" "}
            Headlines
          </h1>
          {this.state.loading && <Spinner/>}
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={<Spinner/>}
          >
            <div className="container my-3">
            <div className="row">
              {this.state.articles.map((element) => {
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
}
export default News;
