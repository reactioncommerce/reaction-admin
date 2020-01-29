import gql from "graphql-tag";

export default gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
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
  }
`;
