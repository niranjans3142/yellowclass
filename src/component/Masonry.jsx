import React, { Component } from "react";
import FloatingContainer from "./FloatingContainer";
import Splash from "./Splash";
import masonry from "../asset/css/masonry.css";

export default class Mansonry extends Component {
  render() {
    return (
      <>
        <div className="masonry-floating-heading">
          <FloatingContainer></FloatingContainer>
        </div>
        <div className="masonry-image-collection">
          <Splash></Splash>
        </div>
      </>
    );
  }
}
