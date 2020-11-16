import React, { Component } from "react";
import Splash from "./Splash";
import floatingContainer from "../asset/css/floatingContainer.css";
import arrowAnimation from "../asset/css/arrowAnimation.css";

export default class FloatingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomOfPage: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // you're at the bottom of the page
        this.setState({
          bottomOfPage: true
        });
        if(document.getElementById("masonry-floating-wrapper")){
          document.getElementById("masonry-floating-wrapper").classList.remove("translate-bottom")
          document.getElementById("masonry-floating-wrapper").classList.add("translate-top")
        }
      }
      else if (window.innerHeight + window.scrollY >= document.body.offsetHeight-100) {
        if(this.state.bottomOfPage){
          if(document.getElementById("masonry-floating-wrapper")){
            document.getElementById("masonry-floating-wrapper").classList.remove("translate-top")
          }
          this.setState({
            bottomOfPage: false
          });
        }
      }
      else if(window.scrollY<10){
        this.setState({
          bottomOfPage: false
        });
      }
    })
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", () => {});
  }
  render() {
    return (
      <>
        <div id="masonry-floating-wrapper" className="masonry-floating-wrapper">
          <h1 className="masonry-floating-heading">Heading-Button</h1>
          <button className="masonry-floating-button">subscribe</button>
          <div className="arrow-container">
            {!this.state.bottomOfPage ? (
              <a href="#" className="arrow animate-down"></a>
            ) : (
                <a href="#" className="arrow animate-up"></a>
              )}
          </div>
        </div>
      </>
    );
  }
}
