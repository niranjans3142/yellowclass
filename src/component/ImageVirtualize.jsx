import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import classNames        from 'classnames';

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

/* REDUX */
import {useSelector,useDispatch} from 'react-redux';
import {increment} from '../actions/UIAction'

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
if (window.outerWidth < 700) {
  MasonryWidth = window.outerWidth;
  MasonryHeight = window.outerHeight;
  columnWidth = window.outerWidth / 2 - 10;
  defaultHeight = 250;
  defaultWidth = columnWidth;
  cellPositionerConfig = {
    cellMeasurerCache: cache,
    columnCount: 2,
    columnWidth,
    spacer: 10,
  };
} else if (window.outerWidth > 700 && window.outerWidth < 1000) {
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
  const dispatch = useDispatch();

  const openCarouselModal = (item, index) => {
    OpenCarouselModal = true;
    imageInModal = index;
    openModal(item, index);
  };

  const cellRenderer = ({ index, key, parent, style }) => {
    const { item, size } = itemsWithSizes[index];
    const height = columnWidth * (size.height / size.width) || defaultHeight;
    style.width = columnWidth;

    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div
          style={style}
          className="masonry-container"
          onClick={() => {
            dispatch(increment(index));openCarouselModal(item, index);
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
  const dispatch = useDispatch();


  const imageCache = () => {
    let cacheImage = props.listOfImages.map((item, index) => {
      return {
        title: item.alt_description,
        image: item.urls.raw,
      };
    });
    setNoCacheList(cacheImage.slice());
    setImages(cacheImage.slice());
    setImageInModal(props.counterReducerState)
    console.log("+++++++++++++++++++++++++++")
    console.log(imageInModal)
    console.log(props.counterReducerState)
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
    if(props.counterReducerState==props.listOfImages.length-2){
      document.querySelector(".carousel-right-arrow").classList.add("non-clickable")
    }

    if(props.counterReducerState==0){
      document.querySelector(".carousel-left-arrow").classList.remove("non-clickable")
    }
  }
  const previousImage = () => {
    if(props.counterReducerState<=1){
      document.querySelector(".carousel-left-arrow").classList.add("non-clickable")
    }

    if(props.counterReducerState<props.listOfImages.length){
      document.querySelector(".carousel-right-arrow").classList.remove("non-clickable")
    }
  }

  return (
    <>
      <div className="masonry-custom">
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
              <div className={classNames("carousel-left-arrow", {'non-clickable' : props.counterReducerState==0})}
              onClick={() => {previousImage();if(props.counterReducerState>0)dispatch(increment(props.counterReducerState-1));}}></div>
              <div className="carousel-data">
                <img className="modal-image" src={props.listOfImages[props.counterReducerState].urls.raw} />
                <p className="modal-text">{props.listOfImages[props.counterReducerState].alt_description}</p>
              </div>
              <div className={classNames("carousel-right-arrow", {'non-clickable' : props.counterReducerState==props.listOfImages.length-1})}
              className="carousel-right-arrow"  onClick={() => {nextImage();if(props.counterReducerState<props.listOfImages.length-1)dispatch(increment(props.counterReducerState+1));}}></div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
