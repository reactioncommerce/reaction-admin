import React, { useState } from "react";
import startCase from "lodash/startCase";
import { Card, CardHeader, CardContent, Collapse, IconButton, makeStyles } from "@material-ui/core";
import AccountsTable from "./AccountsTable";
import GroupCardHeader from "./GroupCardHeader";

const useStyles = makeStyles(() => ({
  card: {
    overflow: "visible",
    marginBottom: "1rem"
  }
}));

/**
 * @summary Group card view
 * @name GroupCard
 * @returns {React.Component} A React component
 */
function GroupCard({ group, groups, isLoadingGroups }) {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={classes.card} key={group._id}>
      <CardHeader
        classes={{ root: classes.cardHeader }}
        component={(props) => <GroupCardHeader expanded={isExpanded} onExpandClick={setIsExpanded} {...props} />}
        title={startCase(group.name)}
      />
      <Collapse in={isExpanded} unmountOnExit>
        <CardContent>
          <AccountsTable group={group} groups={groups} isLoadingGroups={isLoadingGroups} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default GroupCard;
