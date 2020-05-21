import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { getData } from "../../utils/api";
import { ITEMS } from "../../utils/constants";
import { IProps } from "./types";
import { useStyles } from "./styles";

export const TreeComponent: React.FC<IProps> = ({
  items,
  session,
  language,
  handleReportClick,
}) => {
  const classes = useStyles();
  const [tree, setTree] = useState(items);
  const { solution, project } = useParams();

  const addToTree = async (item: any, elem: any) => {
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
    elem.click();
  };

  const renderTree = (items: any) => {
    return items.map((item: any) => (
      <TreeItem
        nodeId={item.code}
        label={item.caption}
        key={item.code}
        onClick={(e) =>
          item.type === "folder"
            ? !item.items && addToTree(item, e.target)
            : handleReportClick(item.code)
        }
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
