import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent } from "@material-ui/core";
import Button from "@reactioncommerce/catalyst/Button";
import NavigationItemForm from "./NavigationItemForm";
import NavigationTreeContainer from "./NavigationTreeContainer";
import NavigationItemList from "./NavigationItemList";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar";
import ContentViewPrimaryDetailLayout from "/imports/client/ui/layouts/ContentViewPrimaryDetailLayout";

class NavigationDashboard extends Component {
  static propTypes = {
    classes: PropTypes.object,
    createNavigationItem: PropTypes.func,
    deleteNavigationItem: PropTypes.func,
    navigationItems: PropTypes.array,
    onDiscardNavigationTreeChanges: PropTypes.func,
    onSetSortableNavigationTree: PropTypes.func,
    shopId: PropTypes.string,
    sortableNavigationTree: PropTypes.arrayOf(PropTypes.object),
    updateNavigationItem: PropTypes.func,
    updateNavigationTree: PropTypes.func
  }

  state = {
    draggingNavigationItemId: "",
    navigationItems: [],
    isModalOpen: false,
    modalMode: "create",
    navigationItem: null,
    overNavigationItemId: "",
    tags: []
  }

  addNavigationItem = () => {
    this.setState({ isModalOpen: true, modalMode: "create", navigationItem: null });
  }

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  }

  updateNavigationItem = (navigationItemDoc, sortableTreeNode) => {
    const { _id, draftData } = navigationItemDoc;
    const { content, url, isUrlRelative, shouldOpenInNewWindow, classNames } = draftData;
    const { value } = content.find((ct) => ct.language === "en");
    const navigationItem = {
      _id,
      name: value,
      url,
      isUrlRelative,
      shouldOpenInNewWindow,
      classNames
    };

    // Add visibility flags from the navigation tree node
    if (sortableTreeNode) {
      const { node: navigationTreeItem } = sortableTreeNode;
      navigationItem.isInNavigationTree = typeof navigationTreeItem === "object";
      navigationItem.isVisible = navigationTreeItem.isVisible;
      navigationItem.isPrivate = navigationTreeItem.isPrivate;
      navigationItem.isSecondary = navigationTreeItem.isSecondary;
    }

    this.setState({
      isModalOpen: true,
      navigationItem,
      sortableTreeNode,
      modalMode: "edit"
    });
  }

  render() {
    const {
      createNavigationItem,
      deleteNavigationItem,
      navigationItems,
      onSetSortableNavigationTree,
      shopId,
      sortableNavigationTree,
      onDiscardNavigationTreeChanges,
      updateNavigationItem,
      updateNavigationTree
    } = this.props;

    const {
      isModalOpen,
      modalMode,
      navigationItem,
      sortableTreeNode
    } = this.state;

    return (
      <>
        <ContentViewPrimaryDetailLayout
          AppBarComponent={
            <PrimaryAppBar title="Main Navigation">
              <Button color="primary" onClick={onDiscardNavigationTreeChanges}>Discard</Button>
              <Button color="primary" variant="contained" onClick={updateNavigationTree}>Save Changes</Button>
            </PrimaryAppBar>
          }
          PrimaryComponent={
            <NavigationItemList
              onClickAddNavigationItem={this.addNavigationItem}
              navigationItems={navigationItems}
              onClickUpdateNavigationItem={this.updateNavigationItem}
            />
          }
          DetailComponent={
            <NavigationTreeContainer
              sortableNavigationTree={sortableNavigationTree}
              onSetSortableNavigationTree={onSetSortableNavigationTree}
              onClickUpdateNavigationItem={this.updateNavigationItem}
            />
          }
        />
        <Dialog
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          fullWidth={true}
          maxWidth="sm"
          open={isModalOpen}
          onClose={this.handleCloseModal}
        >
          <DialogContent>
            <NavigationItemForm
              createNavigationItem={createNavigationItem}
              deleteNavigationItem={deleteNavigationItem}
              mode={modalMode}
              navigationItem={navigationItem}
              shopId={shopId}
              sortableTreeNode={sortableTreeNode}
              onCloseForm={this.handleCloseModal}
              updateNavigationItem={updateNavigationItem}
              onSetSortableNavigationTree={onSetSortableNavigationTree}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default NavigationDashboard;
