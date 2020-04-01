import React, { useState } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useDropzone } from "react-dropzone";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { useMutation } from "@apollo/react-hooks";
import Button from "@reactioncommerce/catalyst/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { FileRecord } from "@reactioncommerce/file-collections";
import { registerComponent } from "@reactioncommerce/reaction-components";
import _ from "lodash";
import { i18next, Logger } from "/client/api";

const createMediaRecordMutation = gql`
  mutation CreateMediaRecord($input: CreateMediaRecordInput!) {
    createMediaRecord(input: $input) {
      mediaRecord {
        _id
      }
    }
  }
`;

/**
 * MediaUploader
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function MediaUploader(props) {
  const { canUploadMultiple, metadata, onError, onFiles, refetchProduct, shopId } = props;

  const [isUploading, setIsUploading] = useState(false);
  const [createMediaRecord] = useMutation(createMediaRecordMutation, { ignoreResults: true });

  const uploadFiles = (acceptedFiles) => {
    const filesArray = Array.from(acceptedFiles);
    setIsUploading(true);

    const promises = filesArray.map(async (browserFile) => {
      const fileRecord = FileRecord.fromFile(browserFile);

      if (metadata) {
        if (typeof metadata === "function") {
          fileRecord.metadata = metadata();
        } else {
          fileRecord.metadata = metadata;
        }
      }

      await fileRecord.upload();

      // We insert only AFTER the server has confirmed that all chunks were uploaded
      return createMediaRecord({
        variables: {
          input: {
            mediaRecord: fileRecord.document,
            shopId
          }
        }
      });
    });


    Promise.all(promises)
      .then((responses) => {
        // NOTE: This is a temporary workaround due to the fact that on the server,
        // the sharp library generates product images in an async manner.
        // A better solution would be to use subscriptions
        const uploadedMediaIds = responses.map((response) => response.data.createMediaRecord.mediaRecord._id);

        // Poll server every two seconds to determine if all media has been successfully processed
        let isAllMediaProcessed = false;
        const timerId = setInterval(async () => {
          const { data: { product } } = await refetchProduct();

          // Get media for product, variants and options
          let allMedia = [product.media];
          if (product.variants) {
            product.variants.forEach((variant) => {
              // Add variant media if set
              if (variant.media) {
                allMedia.push(variant.media);
              }

              // Add option media if set
              if (variant.options) {
                variant.options.forEach((option) => {
                  allMedia.push(option.media);
                });
              }
            });
          }

          allMedia = _.flatten(allMedia);

          const mediaItems = [];
          allMedia.forEach((media) => {
            const { id } = decodeOpaqueId(media._id);
            mediaItems.push({ id, thumbnailUrl: media.URLs.small });
          });

          isAllMediaProcessed = uploadedMediaIds.every((uploadedMediaId) => {
            const mediaItem = mediaItems.find((item) => item.id === uploadedMediaId);

            // If a url has been generated, then these media items has been processed successfully.
            return mediaItem && mediaItem.thumbnailUrl !== String(null);
          });

          if (isAllMediaProcessed) {
            setIsUploading(false);
            clearTimeout(timerId);
          }
        }, 2000);

        // Stop polling after 30 seconds
        setTimeout(() => {
          clearTimeout(timerId);
          setIsUploading(false);
        }, 30000);

        return null;
      })
      .catch((error) => {
        setIsUploading(false);
        if (onError) {
          onError(error);
        } else {
          Logger.error(error);
        }
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpg, image/png, image/jpeg",
    disableClick: true,
    disablePreview: true,
    multiple: canUploadMultiple,
    onDrop(files) {
      if (files.length === 0) return;

      // Pass onFiles func to circumvent default uploader
      if (onFiles) {
        onFiles(files);
      } else {
        uploadFiles(files);
      }
    }
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      {isUploading ?
        <LinearProgress />
        :
        <Button fullWidth size="large" variant="outlined">{i18next.t("reactionUI.components.mediaUploader.dropFiles")}</Button>
      }
    </div>
  );
}

MediaUploader.propTypes = {
  canUploadMultiple: PropTypes.bool,
  metadata: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onError: PropTypes.func,
  onFiles: PropTypes.func,
  refetchProduct: PropTypes.func,
  shopId: PropTypes.string
};

MediaUploader.defaultProps = {
  canUploadMultiple: false
};

registerComponent("MediaUploader", MediaUploader);

export default MediaUploader;
