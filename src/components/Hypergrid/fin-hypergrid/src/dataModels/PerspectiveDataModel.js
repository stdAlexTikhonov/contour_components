import format from './../lib/format.js'

function get_rect(nrows) {
    if (!this.dataWindow) {
        return [];
    }
    const dw = this.dataWindow;
    return this.grid.newRectangle(dw.left, dw.top, dw.width, nrows ? Math.min(nrows - dw.top, dw.height) : dw.height); // convert from InclusiveRect
}

function find_row(rows, index) {
    for (let ridx in rows) {
        if (rows[ridx].__ID__ === index) {
            return parseInt(ridx);
        }
    }
    return -1;
}

const _wrapper = function(f) {
    return async function(_, resolve) {
        try {
            await f.call(this);
        } catch (e) {
            resolve(e);
            return;
        }
        resolve(false);
    };
};

export default require("./datasaur-local").extend("PerspectiveDataModel", {

    getValue: function(x, y) {
        var row = this.data[y];
        return row ? row[x] : null;
    },

    getRowCount: function() {
        return this._nrows || 0;
    },

    setRowCount: function(count) {
        this._nrows = count;
        this._grid.synchronizeScrollingBoundaries();
        this.setDirty() ;
    },

    setDirty: function() {
        this._dirty = true;
    },
    
    rowsAxisChanged : function() {
            this.setRowCount(this._axisV.validate());
            this._grid.behavior.setPSP(this)
            this._grid.computeCellsBounds();
            this._grid.canvas.paintNow();    
    },

    // Called when clicking on a row group expand
    toggleRow: async function(index, level, isShift, h) {
            let is_collapsed = this._axisV.isCollapsed(level, index, h);
            if (isShift) {
              this._axisV.setCollapsedLevel(level, !is_collapsed, h);
            } else {
              this._axisV.setCollapsed(level, index, !is_collapsed, h);
            }
            this.rowsAxisChanged() ;
            return true ;
    },
    
    toggleCol: async function(level, col, isShift) {
            var g = this._axisH._axis[col];

            if (g.l == -1)
              return false ; // main Total click

            var index = g.i[level];
            let is_collapsed = this._axisH.isCollapsed(level, index);

            if (isShift) {
                this._axisH.setCollapsedLevel(level, !is_collapsed);
            } else {
                this._axisH.setCollapsed(level, index, !is_collapsed);
            }
            this._axisH.validate();

            this.setDirty();
            this._grid.behavior.setPSP(this)
            this._grid.computeCellsBounds();
            this._grid.canvas.paintNow();
            return true ;
    },

    _update_select_index: function() {
        const has_cell_selections = this._grid.selectionModel.hasSelections();
        const has_row_selections = this._grid.selectionModel.hasRowSelections();
        if (has_cell_selections) {
            const row_data = this.data[this._grid.selectionModel.getLastSelection().origin.y];
            if (row_data) {
                this._selected_cell_index = row_data.__ID__;
            }
        }
        if (has_row_selections) {
            const row_data = this.data[this._grid.getSelectedRows()[0]];
            if (row_data) {
                this._selected_row_index = row_data.__ID__;
            }
        }
    },

    _update_editor: function(rect) {
        const editor = this._grid.cellEditor;
        let new_index;
        if (editor) {
            new_index = find_row(this.data, editor._index);
            if (new_index == -1) {
                editor.hideEditor() ;    
            } else {
                editor.event.resetGridXY(editor.event.dataCell.x, new_index - rect.origin.y);
                editor.moveEditor();
                editor.showEditor();
            }
        }
        return new_index;
    },

    _update_selection: function(new_index) {
/*        const has_cell_selections = this._grid.selectionModel.hasSelections();
        if (has_cell_selections) {
            new_index = new_index || find_row(this.data, this._selected_cell_index);
            if (new_index !== -1) {
                const col = this._grid.selectionModel.getLastSelection().origin.x;
                this._grid.selectionModel.select(col, new_index, 0, 0);
            }
        }
        if (this._selected_row_index) {
            this._grid.selectionModel.clearRowSelection();
            const row_index = new_index || find_row(this.data, this._selected_row_index);
            if (row_index !== -1) {
                this._grid.selectionModel.selectRow(row_index);
            }
        }
*/
    },

    getSelectedRowID() {
        if (this._grid.selectionModel.hasRowSelections()) {
            const row_data = this.data[this._grid.getSelectedRows()[0]];
            if (row_data) {
                return row_data.__ID__;
            }
        }
    },

    setSelectedRowID(index) {
        if (this._grid.properties.rowSelection) {
            this._selected_row_index = index;
            this._update_selection();
        }
    },

    makeChart: async function (value, grid, x, y) {
        if (value.num == null)
            return;

        var isCol = this.isShowChart.axis == 'col' ;
        var e = isCol ? this._axisH.childValues(x, this._axisV.position(y), isCol) :
                        this._axisV.childValues(y, this._axisH.position(x), isCol) ;

        var dataAxis = e ? e.l :  ['Январь', 'Февраль', 'Март', 'Апрель'] ;
        var data     = e ? e.v :  [220, 182, 191, 234] ;
        
        var isAllNull = true;
        for (var i = 0; i < data.length; ++i)
            if (data[i] != null) {
                isAllNull = false;
                break;
            }
        if (isAllNull)
            return;

        var option = grid.chartOption;
        var ndx = option.grid.length;
        var type ;
        switch (this.isShowChart.type) {
            case 'line': 
                type = 'line' ;
                break ;
            case 'bar':
                type = 'bar' ;
                break ;
            case 'spline':
                type ='line';
                break ;
        } ;
        var seria = {
            animation: false,
            xAxisIndex: ndx,
            yAxisIndex: ndx,
            animationDuration: 3000,
            barCategoryGap: 1,
            type: type,
            lineStyle: {
                width: 1
            } ,
            smooth: this.isShowChart.type == 'spline',
            itemStyle: {
                color: '#76A7FA'
            },
            data: data
        };

        var chartGrid = {
            left: 0,
            top:  0,
            width: this.grid.properties.chartWidth,
            height: 0,
            backgroundColor: 'transparent',
            show: false
        };
        option.grid.push(chartGrid);
        option.xAxis.push({
            animation: false,
            gridIndex: ndx,
            data: dataAxis,
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#aaa'
                }
            }
        });
        option.yAxis.push({
            animation: false,
            gridIndex: ndx,
            show: false
        });
        option.series.push(seria);

        value.option = option;
        value.chart  = chartGrid;
    },

    pspFetch: async function (rect) {
                if (!this._axisV) {
                    return ;
                }

                const self = this;
        
                const base = rect.top;
                const rows = this._axisV._axis.slice(base, base + rect.height);

                this.data = [];
                const data = this.data;
        
                const z = this.grid.properties.fixedColumnCount;
                const left = rect.left - z;
                const cols = this._axisH._axis.slice(left, left + rect.width);


                var option = this.grid.chartOption;
                if (option) {
                  option.grid   = [];
                  option.xAxis  = [];
                  option.yAxis  = [];
                  option.series = [];
                  this.grid.chartOptionSet = false ; 
                }

var d1 = new Date ;
                rows.forEach(function (row, offset) {
                    var row_line = {};
                    var right = Math.min(rect.right, rect.left + cols.length);
                    for (var i = rect.left; i < right; ++i) {
                        var col = cols[i - rect.left];
                        var value = {}
// FACT HERE
                        value.num = self._values[0].data[self._axisV.position(row)][self._axisH.position(col)] ;
                        value.isGrandTotal  = row.l === -1 && col.l === -1 ;
                        value.isTotalRow    = row.l === -1 ;
                        value.isTotalCol    = col.l === -1 ;
                        value.isSubTotalRow = row.l != self._axisV.width() - 1 ;
                        value.isSubTotalCol = col.l != self._axisH.width() - 1 ;
                        
                        if (option && self.isShowChart?.on)
                            self.makeChart(value, self.grid, col, row);

                        row_line[i] = value;
                        
                        if (self.isDataBar) {
                            var q1 = self._axisH.childPositions(col);
                            var q2 = self._axisV.childPositions(row);

                            var min = self._axisV.permutation._values[0].data[q2[0]]?.[q1[0]] ;
                            var max = min ;

                            q1.forEach(function (q1x) {
                                q2.forEach(function (q2x) {
                                    var v = self._axisV.permutation._values[0].data[q2x][q1x];
                                    if (v) {
                                        min = min < v ? min : v ; // Math.min is slow
                                        max = max > v ? max : v ; // Math.max is slow
                                    }
                                })
                            });
                            value.databar = (value.num - min) / (max - min);
                        }
                        
                        if (self.isDataBar2) {
                            var q1 = self._axisH.childPositions(col);
                            var q2 = self._axisV.childPositions(row);

                            var min = self._axisV.permutation._values[0].data[q2[0]]?.[q1[0]] ;
                            var max = min ;

                            q1.forEach(function (q1x) {
                                q2.forEach(function (q2x) {
                                    var v = self._axisV.permutation._values[0].data[q2x][q1x];
                                    if (v) {
                                        min = min < v ? min : v ; // Math.min is slow
                                        max = max > v ? max : v ; // Math.max is slow
                                    }
                                })
                            });
                            value.databar2 = (value.num - min) / (max - min);
                        }                        
                    }
                    row_line.__ID__ = row ;
                    data[base + offset] = row_line;
                });
var d2 = new Date ;
console.log("Elapsed: ", d2-d1) ;
    },

    fetchData: _wrapper(async function() {
        let rect = get_rect.call(this._grid.renderer);

        if (!this._dirty && !is_cache_miss(rect, this._data_window)) {
            return;
        }

        this._grid.renderer.needsComputeCellsBounds = true;

        this._dirty = false;
        const req = this.pspFetch(rect);
        this._data_window = rect;
        
        this._update_editor(rect)
//        this._update_selection();
//        this._update_select_index();
    }),

    getCellEditorAt: function(columnIndex, rowIndex, declaredEditorName, options) {
        const editor = this._grid.cellEditors.create(declaredEditorName, options);

        const offset  = this._grid.renderer.dataWindow.top;
        editor._data  = this.data;
        editor._index = this.data[rowIndex + offset].__ID__;
        return editor;
    },

    getCell: function(config, rendererName) {
        if (config.gridCell.x >= config.fixedColumnCount) {
            cellStyle.call(this, config, rendererName);
        } else {
          config._axisV = this._axisV ;
          config.visibleRows = this.grid.renderer.visibleRows ;
          config.headerRowsCount = this.grid.behavior.subgrids.lookup.header.getRowCount() ;
          config.model = this ;
        }
        return config.grid.cellRenderers.get(rendererName);
    },

    clearSelectionState: function() {
        this._selected_row_index = undefined;
        this._selected_cell_index = undefined;
        this._grid.selectionModel.clear();
    }
});

function is_cache_miss(req, cache) {
    return !cache || req.top !== cache.top || req.top + req.height !== cache.top + cache.height || req.left !== cache.left || req.left + req.width !== cache.left + cache.width;
}

function cellStyle(c) {
    c.backgroundColor = '#fff' ;
    c.halign = 'center';
    c.valign = 'center';

    c.val = c.value ;

    if (c.val.num === null || c.val.num === undefined) {
        c.halign = 'center';
        c.value = "-";
    } else {

            c.halign = 'right';
            c.value = format('# ###.00', c.val.num);
/*
            if (c.val.num > 0) {
                c.color = c.columnColorNumberPositive || "#1078d1";
                c.backgroundColor = c.columnBackgroundColorNumberPositive ? c.columnBackgroundColorNumberPositive : c.backgroundColor;
                c.borderBottom = c.borderBottomPositive ? c.borderBottomPositive : c.borderBottom;
                c.borderRight = c.borderRightPositive ? c.borderRightPositive : c.borderRight;
            } else {
                c.color = c.columnColorNumberNegative || "rgb(255,136,136)";
                c.backgroundColor = c.columnBackgroundColorNumberNegative ? c.columnBackgroundColorNumberNegative : c.backgroundColor;
                c.borderBottom = c.borderBottomNegative ? c.borderBottomNegative : c.borderBottom;
                c.borderRight = c.borderRightNegative ? c.borderRightNegative : c.borderRight;
            }
            if (c.val.num > 3000) {
              c.color = "#1078d1";
              c.rightIcon = 'trend_red_up_1' ;
            } else {
              c.color = "#008B3B";
              c.rightIcon = 'trend_green_down_1' ;
            }
*/
    }
    
    if (c.val.isGrandTotal) {
        c.backgroundColor = 'rgb(230, 230, 230)' ;
        c.font = 'normal 500 XXpx Roboto' ;
    } else if (c.val.isTotalRow) {
        c.backgroundColor = 'rgb(240, 240, 240)' ;
        c.font = 'normal 400 XXpx Roboto' ;        
    } else if (c.val.isTotalCol) {
        c.backgroundColor = 'rgb(245, 245, 245)' ;
        c.font = 'normal 400 XXpx Roboto' ;
    } else if (c.val.isSubTotalCol) {
        c.backgroundColor = 'rgb(250, 250, 250)' ;
        c.font = 'normal 400 XXpx Roboto' ;
    } else if (c.val.isSubTotalRow) {
        c.backgroundColor = 'rgb(250, 250, 250)' ;
        c.font = 'normal 400 XXpx Roboto' ;
    }
}

