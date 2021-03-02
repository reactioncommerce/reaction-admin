import React, { useState } from "react";
import i18next from "i18next";
import ReactTable from "react-table";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import useEmailJobs from "../hooks/useEmailJobs.js";
import EmailTableColumn from "./emailTableColumn";

const DEFAULT_PAGE_SIZE = 20;

/**
 * @summary React component that renders a table listing all e-mail jobs for the current shop
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function EmailTable() {
  const [shopId] = useCurrentShopId();
  const [selectedPageSize, setSelectedPageSize] = useState(DEFAULT_PAGE_SIZE);

  const {
    emailJobs,
    fetchEmailJobs,
    isLoadingEmailJobs,
    totalEmailJobsCount
  } = useEmailJobs([shopId]);

  const columns = [{
    accessor: "data.to",
    Header: i18next.t("admin.logs.headers.data.to")
  }, {
    accessor: "updated",
    // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
    Cell: (row) => <EmailTableColumn row={row} />,
    Header: i18next.t("admin.logs.headers.updated")
  }, {
    accessor: "data.subject",
    Header: i18next.t("admin.logs.headers.data.subject")
  }, {
    accessor: "status",
    // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
    Cell: (row) => <EmailTableColumn row={row} />,
    Header: i18next.t("admin.logs.headers.status")
  }];

  return (
    <div>
      <Card>
        <CardHeader title={i18next.t("admin.logs.headers.emailLogs")} />
        <CardContent>
          <ReactTable
            className="-striped -highlight"
            columns={columns}
            data={emailJobs}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            loading={isLoadingEmailJobs}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={(state) => {
              setSelectedPageSize(state.pageSize);
              fetchEmailJobs({
                first: state.pageSize,
                offset: state.page * state.pageSize
              });
            }}
            pages={Math.ceil(totalEmailJobsCount / selectedPageSize)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
