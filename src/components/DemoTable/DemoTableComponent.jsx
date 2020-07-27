import React, { Component, Fragment } from "react";
import { Resizable } from "react-resizable";
import "./index.scss";
import ReactVirtualSizeTable from "../VirtualTable";
import { CustomCheckbox } from "../CustomDropdown/CustomCheckbox";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

function MinusSquare(props) {
  return (
    <SvgIcon
      fontSize="inherit"
      style={{ width: 13, height: 13, marginRight: 13 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon
      fontSize="inherit"
      style={{ width: 13, height: 13, marginRight: 13 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

export class DemoComponent extends Component {
  state = {
    widths: [],
    columnNames: [],
    tableData: [],
  };

  componentDidMount() {
    const { hierarchy } = this.props;
    const root = hierarchy[hierarchy.root];
    this.setState({
      columnNames: [
        { label: root.label, dataKey: hierarchy.root, count_expanded: 0 },
      ],
      tableData: root.Captions.map((item, i) => ({
        [`${hierarchy.root}`]: item,
        connected: root.join[root.next_level][i],
        expanded: false,
      })),
    });
  }
  onResize = (index, value) => {
    const { widths, columnNames } = this.state;
    widths[index] = value.size.width;
    this.setState({
      widths: { ...widths },
    });
  };
  clickOnRow = (columnIndex, rowIndex, text) => {
    const { hierarchy } = this.props;
    const { columnNames, tableData } = this.state;
    const currentKey = columnNames[columnIndex].dataKey;
    const current = hierarchy[currentKey];
    const next = current.next_level;
    const index = current.Captions.indexOf(text);
    console.log(current.Captions.length);
    console.log(hierarchy.nodes.length);

    const data = hierarchy[next];
    const isOpen = columnNames[columnIndex + 1];

    if (tableData[rowIndex].connected && !tableData[rowIndex].expanded) {
      const arr = tableData[rowIndex].connected.map((item, i) => ({
        [`${next}`]: data.Captions[item],
        connected: data.next_level && data.join[data.next_level][item],
        expanded: false,
      }));

      tableData.splice(rowIndex + 1, 0, ...arr);

      if (!isOpen)
        columnNames.push({
          label: hierarchy[next].label,
          dataKey: next,
          count_expanded: 1,
        });
      else columnNames[columnIndex + 1].count_expanded += 1;
    } else if (tableData[rowIndex].connected && tableData[rowIndex].expanded) {
      const shouldClose = columnNames[columnIndex + 1].count_expanded - 1 === 0;

      columnNames[columnIndex + 1].count_expanded -= 1;
      const new_cn = shouldClose
        ? columnNames.slice(0, columnIndex + 1)
        : columnNames.slice();

      this.setState({
        columnNames: new_cn,
      });

      tableData.splice(rowIndex + 1, tableData[rowIndex].connected.length);
    }

    tableData[rowIndex].expanded = !tableData[rowIndex].expanded;

    this.setState({
      tableData: tableData,
    });
  };
  renderCell = ({ columnIndex, key, rowIndex, style }) => {
    style.paddingLeft = "15px";
    const { widths, columnNames, tableData } = this.state;
    const field = columnNames[columnIndex].label;
    const dataKey = columnNames[columnIndex].dataKey;
    const text =
      rowIndex === 0
        ? field
        : tableData[rowIndex] && tableData[rowIndex][dataKey];
    const expanded = tableData[rowIndex] && tableData[rowIndex].expanded;

    return (
      <Fragment key={key}>
        {rowIndex === 0 ? (
          <Resizable
            width={widths[columnIndex] || 200}
            height={40}
            onResize={(e, value) => {
              this.onResize(columnIndex, value);
            }}
          >
            <div style={style} className="table-header">
              {text}
            </div>
          </Resizable>
        ) : (
          <div
            style={style}
            className="table-content"
            onClick={() => this.clickOnRow(columnIndex, rowIndex, text)}
          >
            {text && (
              <>
                {expanded ? <MinusSquare /> : <PlusSquare />}
                <CustomCheckbox
                  size="small"
                  edge="start"
                  onClick={() => alert(1)}
                  checked={false}
                  tabIndex={-1}
                  inputProps={{ "aria-labelledby": "labelId" }}
                  disabled={false}
                  style={{ marginRight: 3 }}
                />
                {text}
              </>
            )}
          </div>
        )}
      </Fragment>
    );
  };
  render() {
    const { widths, columnNames, tableData } = this.state;

    // 同步
    if (columnNames.length > 0) {
      const widthArray = columnNames.map(() => 200);
      for (let key in widths) {
        widthArray[key] = widths[key];
      }
      let width = window.innerWidth - 50;
      const totalWidths = widthArray.reduce((a, b) => a + b);
      if (totalWidths < width) {
        width = totalWidths - 1;
      }
      return (
        <div className={"res-table"}>
          <ReactVirtualSizeTable
            onCell={(value) => this.renderCell(value, columnNames, tableData)}
            columnCount={columnNames.length}
            widths={widthArray}
            height={250}
            rowCount={tableData.length}
            rowHeight={44}
            width={width}
            style={{ width: "100%", padding: "0 20px" }}
          />
        </div>
      );
    }
    return null;
  }
}
