import React from "react";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import {
  fade,
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import { List } from "react-virtualized";
import { VirtualizedList } from "./VirtualizedList";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";
// import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import { TransitionProps } from "@material-ui/core/transitions";
import { IProps } from "./type";
import { getFilterByCode } from "../../utils/api";
import "react-virtualized/styles.css";

function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = createStyles({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return <Collapse {...props} />;
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      "& .close": {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

const useStyles = makeStyles(
  createStyles({
    root: {
      maxHeight: 500,
      flexGrow: 1,
      maxWidth: 500,
      padding: 20,
    },
  })
);

const list = [
  { name: "Brian Vaughn", description: "Software engineer" },
  // And so on...
];

export const CustomizedTreeView: React.FC<IProps> = ({ hierarchy }) => {
  const classes = useStyles();
  const root_data = getFilterByCode(hierarchy.root);
  const root = hierarchy[hierarchy.root];
  const [list_of_filters, setFilters] = React.useState([hierarchy.root]);

  // const renderItems = (
  //   parent_index: number,
  //   next_level: any,
  //   constraint: any
  // ) => {
  //   const level = hierarchy[next_level];
  //   return level.Captions.map((item: any, j: number) =>
  //     level.next_level && constraint[next_level][j] === parent_index ? (
  //       <StyledTreeItem nodeId={item} label={item} key={item}>
  //         {renderItems(j, level.next_level, level.join)}
  //       </StyledTreeItem>
  //     ) : (
  //       constraint[next_level][j] === parent_index && (
  //         <StyledTreeItem nodeId={item} key={item} label={item} />
  //       )
  //     )
  //   );
  // };

  // return (
  //   <TreeView
  //     className={classes.root}
  //     defaultCollapseIcon={<MinusSquare />}
  //     defaultExpandIcon={<PlusSquare />}
  //     defaultEndIcon={<CloseSquare />}
  //   >
  //     {root.Captions.map((item: any, i: number) => (
  //       <StyledTreeItem nodeId={item} label={item} key={item}>
  //         {renderItems(i, root.next_level, root.join)}
  //       </StyledTreeItem>
  //     ))}
  //   </TreeView>
  // );

  const handleClick = (filter: string) => {
    if (list_of_filters.indexOf(filter) === -1)
      setFilters([...list_of_filters, filter]);
  };

  const renderColumn = (filter: string) => {
    const data = hierarchy[filter];
    return (
      <div onClick={() => handleClick(data.next_level)}>
        <h2 style={{ width: 260 }}>{data.label}</h2>
        <VirtualizedList items={data.Captions} />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", overflow: "auto" }}>
      {list_of_filters.map((item) => renderColumn(item))}
    </div>
  );
};
