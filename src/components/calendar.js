import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import Modal from "react-modal";
import Post from "./post";
import CenterMode from "./slick";
import Slider from "react-slick";
import "./style.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export class calendar extends Component {
  state = {
    posts: [],
    cToken: null,
    value: moment("2020-08-5", "YYYY-MM-DD"),
    cal: [],
    currM: null,
    showModal: false,
    currPost: null,
  };

  handleOpenModal = (post) => {
    //console.log(post);
    this.setState({ currPost: post });
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestobjects: [
          {
            posts: {
              operationtype: "read",
              id: {
                return: true,
              },
              userid: {
                searchvalues: ["41329663-5834-11eb-8e6e-3ca82abc3dd4"],
                return: true,
              },
              iscalendarentry: {
                searchvalues: ["true"],
                return: true,
              },
              media: {
                return: true, //contains image url
              },
              rating: {
                return: true,
              },
              text: {
                return: true,
              },
              privacy: {
                searchvalues: [18],
                return: true,
              },
              typeofday: {
                return: true,
              },

              // Don't change anything above ^^
              //editable variables start below //

              calendardatetime: {
                // Date Time of a particular post
                return: true, // please note: there can be multiple posts on a single day
                sort: "ascending", // you can sort fetched dates by ascending/descending.
              },
              maxitemcount: "20", //you can ask between 1 to 50 posts (max) at a time.
              continuationtoken: null, //replace with the continuation token from response to get the next set
            },
          },
        ],
      }),
    };

    fetch("http://devapi.quinn.care/graph", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          posts: data.responseobjects[0].posts,
          cToken: data.responseobjects[0].continuationtoken,
        });
      });

    const startDay = this.state.value.clone().startOf("month").startOf("week");
    const endDay = this.state.value.clone().endOf("month").endOf("week");
    const day = startDay.clone().subtract(1, "day");
    while (day.isBefore(endDay, "day")) {
      this.state.cal.push(
        Array(7)
          .fill(0)
          .map(() => {
            var d = day.add(1, "day").clone();
            //console.log(d);
            return { post: null, day: d };
          })
      );
    }
  }

  fetchPosts = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestobjects: [
          {
            posts: {
              operationtype: "read",
              id: {
                return: true,
              },
              userid: {
                searchvalues: ["41329663-5834-11eb-8e6e-3ca82abc3dd4"],
                return: true,
              },
              iscalendarentry: {
                searchvalues: ["true"],
                return: true,
              },
              media: {
                return: true, //contains image url
              },
              rating: {
                return: true,
              },
              text: {
                return: true,
              },
              privacy: {
                searchvalues: [18],
                return: true,
              },
              typeofday: {
                return: true,
              },

              // Don't change anything above ^^
              //editable variables start below //

              calendardatetime: {
                // Date Time of a particular post
                return: true, // please note: there can be multiple posts on a single day
                sort: "ascending", // you can sort fetched dates by ascending/descending.
              },
              maxitemcount: "10", //you can ask between 1 to 50 posts (max) at a time.
              continuationtoken: null,
            },
          },
        ],
      }),
    };

    fetch("http://devapi.quinn.care/graph", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          posts: this.state.posts.concat(data.responseobjects[0].posts),
          cToken: data.responseobjects[0].continuationtoken,
        });
      });

    this.setState({ currM: this.state.value.clone().format("MMM-YYYY") });
    this.setState({
      value: this.state.value
        .clone()
        .endOf("month")
        .endOf("week")
        .add(1, "day"),
    });
    const endDay = this.state.value.clone().endOf("month").endOf("week");
    const day = this.state.value.clone().subtract(1, "day");
    const a = [];
    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => {
            var d = day.add(1, "day").clone();
            return { post: null, day: d };
          })
      );
    }
    this.setState({ cal: this.state.cal.concat(a) });
  };

  render() {
    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 1,
      speed: 500,
      initialSlide: 2,
    };
    //console.log(this.state);
    const customStyles = {
      content: {
        width: "100vw",
        height: "70vh",
        border: "0",
        backgroundColor: "rgb(0,0,0,0.75)",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
      },
    };
    const month = this.state.value.clone().format("MMM-YYYY");
    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          style={customStyles}
          contentLabel="Minimal Modal Example"
        >
          {this.state.currPost == null ? (
            <div></div>
          ) : (
            <div>
              <div>
                <CenterMode initialSlide={1} allPosts={this.state.posts} />
              </div>
            </div>
          )}
        </Modal>
        <div className="header">
          <p>my hair diary</p>
          <p>{this.state.currM == null ? month : this.state.currM}</p>
        </div>
        <div className="calendar">
          <InfiniteScroll
            dataLength={this.state.cal.length}
            next={this.fetchPosts}
            hasMore={true}
            loader={<h4>Loading ...</h4>}
          >
            {this.state.cal.map((week) => {
              //console.log(week);
              return (
                <div className="week-row">
                  {week.map((day) => {
                    //console.log(day);
                    var p;
                    // eslint-disable-next-line
                    this.state.posts.map((post) => {
                      if (
                        day.day.format("YYYY-MM-DD") ===
                        post.calendardatetime.substring(
                          0,
                          post.calendardatetime.indexOf("T")
                        )
                      ) {
                        p = post;
                      }
                    });
                    if (p)
                      return (
                        <Post
                          date={day.day.format("D")}
                          post={p}
                          allPosts={this.state.posts}
                          modalOpener={this.handleOpenModal}
                        />
                      );
                    else
                      return (
                        <Post
                          date={day.day.format("D")}
                          post={null}
                          allPosts={this.state.posts}
                          modalOpener={null}
                        />
                      );
                  })}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default calendar;
