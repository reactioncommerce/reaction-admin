import { useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { setAccessToken } from "/imports/plugins/core/graphql/lib/helpers/initApollo";

const viewerQuery = gql`
query getViewer {
  viewer {
    _id
    firstName
    language
    lastName
    name
    primaryEmailAddress
    adminUIShops {
      _id
      brandAssets {
        navbarBrandImage {
          large
        }
      }
      name
      shopLogoUrls {
        primaryShopLogoUrl
      }
    }
  }
}
`;

/**
 * Hook to get user permissions for the App component
 * @return {Object} Permissions
 */
export default function useAuth() {
  const authToken = typeof window !== "undefined" ? window.localStorage.getItem("accounts:accessToken") : undefined;
  const { loading, error, data: viewerData, refetch } = useQuery(viewerQuery);

  if (error) {
    console.log(error); // eslint-disable-line no-console
  }

  // Perform a `viewer` query whenever we get a new access token
  useEffect(() => {
    setAccessToken(authToken);
    refetch();
  }, [authToken, refetch]);

  return {
    isViewerLoading: loading,
    refetchViewer: refetch,
    viewer: viewerData?.viewer
  };
}
