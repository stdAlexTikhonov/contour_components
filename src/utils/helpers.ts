export const transform_languages_data = (langs: []) => {
  const hash = {};
  langs.forEach((item) => {
    hash[item[0]] = item[1];
  });
  return hash;
};

export const generateUID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const formatGeometry = (dashboard: any) => {
  const {
    grid: {
      geometry: { vertical, horizontal },
    },
    cells,
  } = dashboard;

  const { type: v_type, size: v_size, cells: v_cells } = vertical;
  const { type: h_type, size: h_size, cells: h_cells } = horizontal;

  let rows = {
    items: [],
    cu: "px",
  };

  if (v_size && v_type === "fixed") {
    rows.items = v_cells.map((item: any) => (item.size / 100) * v_size);
    rows.cu = "px";
  } else if (v_type === "window") {
    rows.items = v_cells.map((item: any) => item.size);
    rows.cu = "%";
  } else if (v_type === "fixed" || v_type === "content") {
    rows.items = v_cells.map((item: any) => item.size);
    rows.cu = "px";
  } else {
    console.log("Unknown type ", v_cells, v_type);
    return null;
  }

  let cols = {
    items: [],
    cu: "px",
  };

  if (h_size && h_type === "fixed") {
    cols.items = h_cells.map((item: any) => (item.size / 100) * h_size);
    cols.cu = "px";
  } else if (h_type === "window") {
    cols.items = h_cells.map((item: any) => item.size);
    cols.cu = "%";
  } else if (h_type === "fixed" || h_type === "content") {
    cols.items = h_cells.map((item: any) => item.size);
    cols.cu = "px";
  } else {
    console.log("Unknown type ", h_cells, h_type);
    return null;
  }

  let grid: never[] = [];

  const mid = cols.items.length / 2;

  cells.sort((a: any, b: any) =>
    a.row === b.row ? a.col - b.col : a.row - b.row
  );

  const sum = (a: number, b: number): number => a + b;

  const data = cells.map((elem: any, i: number) => {
    const w_: any[] = cols.items.slice(elem.col, elem.col + elem.colspan);
    let w = 0;
    for (let i = 0; i < w_.length; i++) w += w_[i];

    if (cols.cu === "%") {
      elem.w = (w / 100) * window.innerWidth + "px";
      const val = (w / 100) * 12;
      const frac = val - parseInt(val.toString()) > 0.5 ? 1 : 0;
      elem.col_w = parseInt(val.toString()) + frac;
      elem.float = elem.col > mid ? "float-right" : "float-left";
    } else {
      elem.w = w + "px";
      const val = (w / window.innerWidth) * 12;
      const frac = val - parseInt(val.toString()) > 0.5 ? 1 : 0;
      elem.col_w = parseInt(val.toString()) + frac;
      elem.float = elem.col > mid ? "float-right" : "float-left";
    }

    const h_ = rows.items.slice(elem.row, elem.row + elem.rowspan);
    let h = 0;
    for (let i = 0; i < h_.length; i++) h += h_[i];

    elem.h = h;

    return {
      ...elem,
      hcu: rows.cu,
      id: "_" + generateUID(),
    };
  });

  const v_len = v_cells.length;
  for (let i = 0; i < v_len; i++) {
    const filtered_by_row = data
      .filter((item: any) => item.row === i)
      .map((item: any) => item.col_w);

    let max_value = Math.max(...filtered_by_row);

    const len_of_row = filtered_by_row.reduce((a: any, b: any) => a + b);

    if (len_of_row > 12) {
      const clip = len_of_row - 12; //на сколько уменьшить
      for (let j = 0; j < data.length; j++) {
        if (data[j].row === i && data[j].col_w === max_value) {
          data[j].col_w -= clip;
          break;
        }
      }
    }
  }

  return {
    grid,
    cells: data,
  };
};
