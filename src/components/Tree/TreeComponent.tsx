import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  view,
  history,
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
    return items.map((item: any) =>
      view === "tree_only" && item.type === "report" ? (
        <div>
          <Link
            className={classes.link}
            to={history.location.pathname + "/report/" + item.code}
          >
            {item.caption}
          </Link>
        </div>
      ) : (
        <TreeItem
          key={item.code}
          nodeId={item.code}
          label={item.caption}
          onClick={(e) =>
            item.type === "folder"
              ? !item.items && addToTree(item, e.target)
              : handleReportClick(item.code)
          }
        >
          {item.items && item.type === "folder" && renderTree(item.items)}
        </TreeItem>
      )
    );
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
