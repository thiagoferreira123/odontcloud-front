import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

interface Props {
  source: string;
  avatar?: string
}

const ZoomImage = ({ source, avatar }: Props) => {
  // const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [imageError, setImageError] = useState(false)
  // const [isOpen, setIsOpen] = useState(false);
  // const images = [
  //   source
  // ];

  // const openLightbox = (index: number) => {
  //   setPhotoIndex(index);
  //   setIsOpen(true);
  // };

  return (
    <>
      <Row>
        <Col>
          <div>
            <img
              src={imageError ? avatar : source}
              className="card-img-top sh-50 cursor-pointer"
              alt="thumb"
              onError={() => setImageError(true)}
              loading="lazy"
              // onClick={() => openLightbox(0)}
            />
          </div>
        </Col>
      </Row>
      {/* {isOpen && (
        <>
        <Lightbox
          mainSrc={images[photoIndex]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          wrapperClassName="rounded-lg"
          zoomInLabel='max'
          />
          </>
      )} */}
    </>
  );
};

export default ZoomImage;
