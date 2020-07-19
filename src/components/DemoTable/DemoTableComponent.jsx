import React, { Component, Fragment } from "react";
import { Resizable } from "react-resizable";
import "./index.scss";
import ReactVirtualSizeTable from "../VirtualTable";

const columnNames = [];
const tableData = [];
for (let i = 0; i < 3; i++) {
  columnNames.push(`column_${i}`);
  const row = {};
  for (let j = 0; j < 100; j++) {
    row[`column_${j}`] = i + j;
  }
  tableData.push(row);
}

export class DemoComponent extends Component {
  state = {
    widths: [],
  };
  onResize = (index, value) => {
    const { widths } = this.state;
    widths[index] = value.size.width;
    this.setState({
      widths: { ...widths },
    });
  };
  renderCell = ({ columnIndex, key, rowIndex, style }) => {
    const { widths } = this.state;
    const field = columnNames[columnIndex];
    const text =
      rowIndex === 0
        ? field
        : tableData[rowIndex] && tableData[rowIndex][field];

    console.log("Hello");
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
    const { widths } = this.state;
    // 同步
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
}
