import React, { Component } from "react";
import Slider from "react-slick";
import moment from "moment";

export default class CenterMode extends Component {
  lookup = (type) => {
    if (type === "hair cut")
      return <div className="label label-large Cu">Cu</div>;
    else if (type === "protein treatment")
      return <div className="label label-large Pr">Pr</div>;
    else if (type === "hair color")
      return <div className="label label-large HC">HC</div>;
    else if (type === "deep conditioning")
      return <div className="label label-large DC">DC</div>;
    else if (type === "clarifying")
      return <div className="label label-large C">C</div>;
    else return "";
  };

  syntaxDate = (date) => {
    const d = date.substring(0, date.indexOf("T"));
    const day = moment(d, "YYYY-MM-DD");
    return day.format("DD MMMM");
  };

  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "40px",
      slidesToShow: 1,
      speed: 500,
      initialSlide: this.props.initialSlide,
    };
    const allPosts = this.props.allPosts;

    return (
      <div>
        <Slider {...settings}>
          {allPosts.map((post) => (
            <div className="post-card">
              <img
                src={post.media[0].mediaurl}
                alt=""
                className="post-card-pic"
              />
              <div className="post-card-body">
                <div className="post-card-labels">
                  {post.typeofday.map((t) => this.lookup(t))}
                </div>
                <div className="post-card-date">
                  {this.syntaxDate(post.calendardatetime)}
                </div>
                <div className="post-card-text">{post.text}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
