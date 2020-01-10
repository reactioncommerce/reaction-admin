import React from "react";
import gql from "graphql-tag";
import i18next from "i18next";
import { useQuery } from "@apollo/react-hooks";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId.js";

const systemInfoQuery = gql`
  query systemInformationQuery($shopId: ID!) {
    systemInformation(shopId: $shopId) {
      apiVersion
      mongoVersion {
        version
      }
      plugins {
        name
        version
      }
    }
  }
`;

/**
 * SystemInformation
 * @param {Object} props Component props
 * @returns {Node} React component
 */
export default function SystemInformation() {
  const [shopId] = useCurrentShopId();

  const {
    data,
    loading
  } = useQuery(
    systemInfoQuery,
    {
      variables: {
        shopId
      }
    }
  );

  if (loading) return <Components.Loading />;

  const { systemInformation = {} } = data || {};

  return (
    <Card>
      <CardHeader title={i18next.t("shopSettings.systemInfo.title")} />
      <CardContent>
        <div>
          <span>{i18next.t("shopSettings.systemInfo.apiVersionLabel")}:</span> {systemInformation.apiVersion}
        </div>
        <div>
          <span>{i18next.t("shopSettings.systemInfo.mongoVersionLabel")}:</span> {systemInformation.mongoVersion && systemInformation.mongoVersion.version}
        </div>
        <div>
          <span>{i18next.t("shopSettings.systemInfo.installedPluginsLabel")}:</span>
        </div>
        <ul>
          {(systemInformation.plugins || []).map((plugin) => <li key={plugin.name}>{plugin.name} {plugin.version}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}
