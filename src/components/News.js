import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'

export class News extends Component {

  static defaultProps = {
    country : 'in',
    pageSize : 8,
    category : 'general'
  }

  static propTypes = {
    country : PropTypes.string,
    pageSize : PropTypes.number,
    category : PropTypes.string
  }



  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  updateNews = async()=>{
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=90bc1dd6e4004ca59635148d8d820d09&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading : false
    });
  };

  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    
    this.setState({
      page: this.state.page - 1,
    });
    this.updateNews();
  }

    handleNextClick = async () => {
      this.setState({
        page: this.state.page + 1
      });

      this.updateNews();
  }

  render() {
    return (
      <div>
        <div className="container my-3">
          <h1 className="text-center" style={{margin:'35px 0px'}}>NewsMonkey - Top Headlines</h1>
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
                    author = {element.author?element.author:"Unknown"} date = {new Date(element.publishedAt).toGMTString()}
                    source = {element.source.name}
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
            className="btn btn-dark mb-3"
            onClick={this.handlePrevClick}
          >
            &larr; Prev
          </button>
          <button
            type="button"
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            className="btn btn-dark mb-3"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}
export default News;
