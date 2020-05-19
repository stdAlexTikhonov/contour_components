import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { AppState } from "../../store/config_store";
import { getData } from "../../utils/api";
import { DataForQuery } from "../../utils/types";
import { ITEMS } from "../../utils/constants";

export interface Props {}

export type IProps = Props & LinkStateToProps;

export interface LinkStateToProps {
  items: any;
  session: string | undefined;
  language: string;
}

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
    paddingTop: 65,
  },
});

export const FoldersNavigator: React.FC<IProps> = ({
  items,
  session,
  language,
}) => {
  const classes = useStyles();
  const [tree, setTree] = useState(items);
  const { solution, project } = useParams();

  const addToTree = async (item: any) => {
    const data = await getData({
      method: ITEMS,
      p_folder: item.code,
      solution,
      project,
      session,
      language,
    });

    item.items = data.items;
    const new_tree = tree.slice();
    setTree(new_tree);
  };

  const renderTree = (items: any) => {
    return items.map((item: any) => (
      <TreeItem
        nodeId={item.code}
        label={item.caption}
        key={item.code}
        onClick={() => item.type === "folder" && addToTree(item)}
      >
        {item.items && renderTree(item.items)}
      </TreeItem>
    ));
  };

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(tree)}
    </TreeView>
  );
};

const mapStateToProps = (state: AppState): LinkStateToProps => ({
  items: state.items,
  session: state.auth.session || undefined,
  language: state.languages.current,
});

export const Tree = connect(mapStateToProps)(FoldersNavigator);
