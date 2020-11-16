import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from "react-virtualized";
import ImageMeasurer from "react-virtualized-image-measurer";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

const keyMapper = (item, index) => item.image || index;
let OpenCarouselModal = false;
let columnWidth = window.outerWidth / 4;
let defaultHeight = 250;
let defaultWidth = columnWidth;

// Default sizes help Masonry decide how many images to batch-measure
const cache = new CellMeasurerCache({
  defaultHeight,
  defaultWidth,
  fixedWidth: true,
});
let MasonryWidth = 1000,
  MasonryHeight = window.outerHeight;
// Our masonry layout will use 3 columns with a 10px gutter between
let cellPositionerConfig = {
  cellMeasurerCache: cache,
  columnCount: 4,
  columnWidth,
  spacer: 10,
};
console.log("---1231231231231231231212312---");
if (window.outerWidth < 700) {
  console.log("--1--");

  MasonryWidth = window.outerWidth;
  MasonryHeight = window.outerHeight;
  columnWidth = window.outerWidth / 2;
  defaultHeight = 250;
  defaultWidth = columnWidth;
  cellPositionerConfig = {
    cellMeasurerCache: cache,
    columnCount: 2,
    columnWidth,
    spacer: 10,
  };
} else if (window.outerWidth > 700 && window.outerWidth < 1000) {
  console.log("--2--");

  MasonryWidth = window.outerWidth;
  MasonryHeight = window.outerHeight;
  columnWidth = window.outerWidth / 3;
  defaultHeight = 250;
  defaultWidth = columnWidth;
  cellPositionerConfig = {
    cellMeasurerCache: cache,
    columnCount: 3,
    columnWidth,
    spacer: 10,
  };
} else if (window.outerWidth > 1000 && window.outerWidth < 1500) {
  console.log("--3--");

  MasonryWidth = window.outerWidth;
  MasonryHeight = window.outerHeight;
  columnWidth = window.outerWidth / 4;
  defaultHeight = 250;
  defaultWidth = columnWidth;
  cellPositionerConfig = {
    cellMeasurerCache: cache,
    columnCount: 4,
    columnWidth,
    spacer: 10,
  };
} else {
  console.log("--4--");

  MasonryWidth = window.outerWidth;
  MasonryHeight = 600;
  columnWidth = window.outerWidth / 6;
  defaultHeight = 250;
  defaultWidth = columnWidth;
  cellPositionerConfig = {
    cellMeasurerCache: cache,
    columnCount: 6,
    columnWidth,
    spacer: 10,
  };
}

const cellPositioner = createMasonryCellPositioner(cellPositionerConfig);
const MasonryComponent = ({
  itemsWithSizes,
  setRef,
  openModal,
  imageInModal,
}) => {
  const openCarouselModal = (item, index) => {
    console.log(imageInModal);
    console.log("open modal");
    OpenCarouselModal = true;
    console.log(item);
    console.log(index);
    imageInModal = index;
    openModal(item, index);
    console.log(imageInModal);
    console.log("--end--");
  };

  const cellRenderer = ({ index, key, parent, style }) => {
    const { item, size } = itemsWithSizes[index];
    const height = columnWidth * (size.height / size.width) || defaultHeight;
    style.width = columnWidth;
    console.log(style);

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div
          style={style}
          className="masonry-container"
          onClick={() => {
            openCarouselModal(item, index);
          }}
        >
          {item.image && (
            <img
              className="masonry-image"
              src={item.image}
              alt={item.title}
              style={{
                height: height,
                width: columnWidth,
                display: "block",
              }}
            />
          )}
          <div className="masonry-text-description">{item.title}</div>
        </div>
      </CellMeasurer>
    );
  };

  return (
    <Masonry
      cellCount={itemsWithSizes.length}
      cellMeasurerCache={cache}
      cellPositioner={cellPositioner}
      cellRenderer={cellRenderer}
      height={MasonryHeight}
      width={MasonryWidth}
      keyMapper={keyMapper}
      ref={setRef}
    />
  );
};

export default function ImageVirtualize(props) {
  let [noCacheList, setNoCacheList] = useState([]);
  let [images, setImages] = useState([]);
  let [showCarouselModal, setShowCarouselModal] = useState(false);
  let [imageInModal, setImageInModal] = useState(0);

  let [masonryRef, setMasonryRef] = useState(null);

  const imageCache = () => {
    let cacheImage = props.listOfImages.map((item, index) => {
      return {
        title: item.alt_description,
        image: item.urls.raw,
      };
    });
    setNoCacheList(cacheImage.slice());
    setImages(cacheImage.slice());
  };

  useEffect(() => {
    imageCache();
    //shorten();
  }, []);

  const shorten = () => {
    cache.clearAll();
    cellPositioner.reset(cellPositionerConfig);
    masonryRef.clearCellPositions();
    setImages(images.slice(1));
  };

  const setMasonry = (node) => setMasonryRef(node);

  const openModal = (item, index) => {
    setShowCarouselModal(true);
  };

  const nextImage = () => {
    if(imageInModal<props.listOfImages.length){
      console.log("next")
      setImageInModal(imageInModal+1);
    }
    if(imageInModal==props.listOfImages.length-1){
      document.querySelector(".carousel-right-arrow").classList.add("non-clickable")
    }

    if(imageInModal==0){
      document.querySelector(".carousel-left-arrow").classList.remove("non-clickable")
    }
  }
  const previousImage = () => {
    if(imageInModal>0){
      console.log("previous")
      setImageInModal(imageInModal-1);
    }
    if(imageInModal<=1){
      document.querySelector(".carousel-left-arrow").classList.add("non-clickable")
    }

    if(imageInModal==props.listOfImages.length){
      document.querySelector(".carousel-right-arrow").classList.remove("non-clickable")
    }
  }

  return (
    <>
      <div>
        <ImageMeasurer
          items={images}
          image={(item) => item.image}
          keyMapper={keyMapper}
          onError={(error, item, src) => {
            console.error(
              "Cannot load image",
              src,
              "for item",
              item,
              "error",
              error
            );
          }}
          defaultHeight={defaultHeight}
          defaultWidth={defaultWidth}
        >
          {({ itemsWithSizes }) => (
            <MasonryComponent
              setRef={setMasonry}
              itemsWithSizes={itemsWithSizes}
              openModal={() => {
                openModal(undefined, undefined);
              }}
              imageInModal={imageInModal}
            />
          )}
        </ImageMeasurer>

        <Modal
          show={showCarouselModal}
          onHide={() => setShowCarouselModal(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header className="border-nonw-imp" closeButton>
          </Modal.Header>
          <Modal.Body className="padding-5-imp">
            <div className="carousel-container">
              <div className="carousel-left-arrow non-clickable" onClick={() => previousImage()}></div>
              <div className="carousel-data">
                <img className="modal-image" src={props.listOfImages[imageInModal].urls.raw} />
                <p className="modal-text">{props.listOfImages[imageInModal].alt_description}</p>
              </div>
              <div className="carousel-right-arrow"  onClick={() => nextImage()}></div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
