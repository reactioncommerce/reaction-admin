import gql from "graphql-tag";

export default gql`
  query product($productId: ID!, $shopId: ID!) {
    product(productId: $productId, shopId: $shopId) {
      _id
      currentProductHash
      description
      isDeleted
      isVisible
      media {
        _id
        URLs {
          small
          medium
          large
          original
          thumbnail
        }
      }
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
      shouldAppearInSitemap
      slug
      socialMetadata {
        message
        service
      }
      supportedFulfillmentTypes
      tagIds
      tags {
        nodes {
          _id
          name
        }
      }
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
        media {
          _id
          URLs {
            small
            medium
            large
            original
            thumbnail
          }
        }
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
        isTaxable
        taxCode
        taxDescription
        options {
          _id
          attributeLabel
          barcode
          height
          index
          isDeleted
          isVisible
          length
          media {
            _id
            URLs {
              small
              medium
              large
              original
              thumbnail
            }
          }
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
          isTaxable
          taxCode
          taxDescription
        }
      }
    }
  }
`;
