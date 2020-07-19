import React, { Component, Fragment } from "react";
import { Resizable } from "react-resizable";
import "./index.scss";
import ReactVirtualSizeTable from "../VirtualTable";

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
      columnNames: [{ label: root.label, dataKey: hierarchy.root }],
      tableData: root.Captions.map((item) => ({
        [`${hierarchy.root}`]: item,
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
  renderCell = ({ columnIndex, key, rowIndex, style }) => {
    const { widths, columnNames, tableData } = this.state;
    const field = columnNames[columnIndex].label;
    const dataKey = columnNames[columnIndex].dataKey;
    const text =
      rowIndex === 0
        ? field
        : tableData[rowIndex] && tableData[rowIndex][dataKey];

    return (
      <Fragment key={key}>
        {rowIndex === 0 ? (
          <Resizable
            width={widths[columnIndex] || 140}
            height={36}
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
            onDoubleClick={() => this.onDoubleClick(tableData[rowIndex])}
          >
            {text}
          </div>
        )}
      </Fragment>
    );
  };
  render() {
    const { widths, columnNames, tableData } = this.state;

    // 同步
    if (columnNames.length > 0) {
      const widthArray = columnNames.map(() => 140);
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
            rowHeight={36}
            width={width}
            style={{ width: "100%", padding: "0 20px" }}
          />
        </div>
      );
    }
    return null;
  }
}
