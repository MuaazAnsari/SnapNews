import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

export class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=90bc1dd6e4004ca59635148d8d820d09&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    let parsedData = await data.json();

    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading : false
    });
  }

  render() {
    let handlePrevClick = async () => {

      let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=90bc1dd6e4004ca59635148d8d820d09&page=${
        this.state.page - 1
      }&pageSize=${this.props.pageSize}`;
      this.setState({loading : true})
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        page: this.state.page - 1,
        articles: parsedData.articles,
        loading : false
      });
    };

    let handleNextClick = async () => {

      if(!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))){
          let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=90bc1dd6e4004ca59635148d8d820d09&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
          this.setState({loading : true})
          let data = await fetch(url);
          let parsedData = await data.json();
          this.setState({
            page: this.state.page + 1,
            articles: parsedData.articles,
            loading : false
          });

        }
    };

    return (
      <div>
        <div className="container my-3">
          <h1 className="text-center">NewsMonkey - Top Headlines</h1>
          {this.state.loading && <Spinner/>}
          <div className="row">
            {!this.state.loading && this.state.articles.map((element) => {
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
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="container d-flex justify-content-between">
          <button
            type="button"
            disabled={this.state.page <= 1}
            className="btn btn-dark"
            onClick={handlePrevClick}
          >
            &larr; Prev
          </button>
          <button
            type="button"
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            className="btn btn-dark"
            onClick={handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}
export default News;
