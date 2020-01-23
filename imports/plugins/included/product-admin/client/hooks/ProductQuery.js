import gql from "graphql-tag";

export default gql`
  query product($productId: ID!, $shopId: ID!) {
    product(productId: $productId, shopId: $shopId) {
      _id
      currentProductHash
      description
      isDeleted
      isVisible
      metaDescription
      metafields {
        key
        value
      }
      originCountry
      pageTitle
      productType
      publishedAt
      publishedProductHash
      shop {
        _id
      }
      slug
      socialMetadata {
        message
        service
      }
      supportedFulfillmentTypes
      tagIds
      title
      updatedAt
      vendor
      variants {
        _id
        attributeLabel
        barcode
        height
        index
        isDeleted
        isVisible
        length
        metafields {
          key
          value
        }
        minOrderQuantity
        optionTitle
        originCountry
        shop {
          _id
        }
        sku
        title
        updatedAt
        weight
        width
        options {
          _id
          attributeLabel
          barcode
          height
          index
          isDeleted
          isVisible
          length
          metafields {
            key
            value
          }
          minOrderQuantity
          optionTitle
          originCountry
          shop {
            _id
          }
          sku
          title
          updatedAt
          weight
          width
        }
      }
    }
  }
`;
