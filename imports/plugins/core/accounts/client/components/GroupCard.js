import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import startCase from "lodash/startCase";
import { Card, CardHeader, CardContent, Collapse, makeStyles } from "@material-ui/core";
import AccountsTable from "./AccountsTable";
import GroupCardHeader from "./GroupCardHeader";
import CreateOrEditGroupDialog from "./CreateOrEditGroupDialog";

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
function GroupCard({ group, groups, isLoadingGroups, refetchGroups, shopId }) {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditGroupDialogVisible, setEditGroupDialogVisibility] = useState(false);

  return (
    <Fragment>
      <CreateOrEditGroupDialog
        isOpen={isEditGroupDialogVisible}
        onSuccess={refetchGroups}
        onClose={() => setEditGroupDialogVisibility(false)}
        group={group}
        shopId={shopId}
      />
      <Card className={classes.card} key={group._id}>
        <CardHeader
          classes={{ root: classes.cardHeader }}
          component={(props) => (
            <GroupCardHeader
              isExpanded={isExpanded}
              onEdit={() => setEditGroupDialogVisibility(true)}
              onExpandClick={setIsExpanded}
              {...props}
            />
          )}
          title={startCase(group.name)}
        />
        <Collapse in={isExpanded} unmountOnExit>
          <CardContent>
            <AccountsTable
              group={group}
              groups={groups}
              isLoadingGroups={isLoadingGroups}
            />
          </CardContent>
        </Collapse>
      </Card>
    </Fragment>
  );
}

GroupCard.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  groups: PropTypes.arrayOf(PropTypes.object),
  isLoadingGroups: PropTypes.bool,
  refetchGroups: PropTypes.func,
  shopId: PropTypes.string
};

export default GroupCard;
