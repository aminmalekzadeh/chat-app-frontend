import PropTypes from 'prop-types';
import { useEffect } from 'react';
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";




LightboxModal.propTypes = {
  images: PropTypes.array.isRequired,
  photoIndex: PropTypes.number,
  setPhotoIndex: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};


export default function LightboxModal({ images, isOpen, onClose, ...other }) {

  return (
    <>
      {isOpen && (
        <SimpleReactLightbox>
          <SRLWrapper>
            <img src={images[0]} alt="" />
          </SRLWrapper>
        </SimpleReactLightbox>
      )}
    </>
  );
}
