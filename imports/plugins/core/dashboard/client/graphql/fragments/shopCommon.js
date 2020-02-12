import gql from "graphql-tag";

export default gql`
 fragment ShopCommon on Shop {
    _id
    addressBook {
      company
      fullName
      address1
      address2
      city
      region
      postal
      country
      phone
      isCommercial
    }
    description
    emails {
      address
    }
    keywords
    name
    slug
  }
`;


