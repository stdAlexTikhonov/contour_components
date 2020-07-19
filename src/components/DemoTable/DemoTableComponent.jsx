import React, { Component, Fragment } from "react";
import { Resizable } from "react-resizable";
import "./index.scss";
import ReactVirtualSizeTable from "../VirtualTable";
import { CustomCheckbox } from "../CustomDropdown/CustomCheckbox";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

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
    console.log(style);

    style.paddingLeft = "15px";
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
            onDoubleClick={() => this.onDoubleClick(tableData[rowIndex])}
          >
            <PlusSquare />
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
