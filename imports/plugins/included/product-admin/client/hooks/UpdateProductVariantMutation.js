import gql from "graphql-tag";

export default gql`
  mutation updateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      variant {
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
        isTaxable
        taxCode
        taxDescription
      }
    }
  }
`;
