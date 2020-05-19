import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { getData } from "../../utils/api";
import { ITEMS } from "../../utils/constants";
import { IProps } from "./types";
import { makeStyles } from "@material-ui/core/styles";

//something wrong with styles
export const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
    paddingTop: 65,
  },
});

//

export const TreeComponent: React.FC<IProps> = ({
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
