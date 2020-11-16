//import fetch from "node-fetch";
//global.fetch = fetch;
import React, { Component } from "react";
import splash from "../asset/css/splash.css";
import Unsplash, { toJson } from "unsplash-js";
import ImageVirtualize from "./ImageVirtualize";

const APP_ACCESS_KEY = "HZJVN5EoLe7CPyWTaL1pImH_BGpzFISdDA6yy258YyY";

export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfImages: []
    }
  }

  componentDidMount() {
    const unsplash = new Unsplash({
      accessKey: APP_ACCESS_KEY,
      // Optionally you can also configure a custom header to be sent with every request
      headers: {
        "X-Custom-Header": "yellowclassmasonary",
      },
      // Optionally if using a node-fetch polyfill or a version of fetch which supports the timeout option, you can configure the request timeout for all requests
      timeout: 500, // values set in ms
    });

    unsplash.collections
      .getCollectionPhotos(881463, 1, 512, "portrait")
      .then(toJson)
      .then((json) => {
        this.setState({ listOfImages: json })
        console.log(this.state.listOfImages)
      });
  }

  render() {
    return (
      <>
        {this.state.listOfImages.length > 0 ?
          <div id="splash-container" className="splash-container">
            <ImageVirtualize listOfImages={this.state.listOfImages}></ImageVirtualize>
          </div>
          :
          <div></div>}
          
      </>
    );
  }
}
