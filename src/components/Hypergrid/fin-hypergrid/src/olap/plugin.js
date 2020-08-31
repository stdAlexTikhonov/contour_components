module.exports = function(grid) {
    grid.addEventListener("fin-grid-rendered", async function(event) {
//      if (grid.chartOptionSet === false) {
//        grid.chartOptionSet = true ;
//        grid.chart.setOption(grid.chartOption, true) ;
//      }

    }) ;

    grid.addEventListener("fin-click", async function (event) {
        var eventP = event.detail.primitiveEvent;
        if (!(eventP.mousePoint.x > 3 && eventP.mousePoint.x < eventP.bounds.width - 3))
            return;
        if (eventP.isHeaderRow) {
            var row = eventP.dataCell.y - 1; // - expander

            if (row > grid.behavior.dataModel._axisH.currentWidth()) {
                if (grid.factClicked) {
                    grid.factClicked(0);
                }
            } else {
                var col = eventP.dataCell.x - grid.properties.fixedColumnCount;
                var level = Math.min(grid.behavior.dataModel._axisH._axis[col].i.length - 1, row);
                var isShift = event.detail.keys.indexOf('SHIFT') != -1;
                grid.behavior.dataModel.toggleCol(level, col, isShift);

                if (grid.dimClicked) {
                    grid.dimClicked(grid.behavior.dataModel._axisH.dim_number(level));
                }
                if (grid.colRowToggled) {
                    grid.colRowToggled() ;    
                }
                
            }
        } else {
            const axis = grid.behavior.dataModel._axisV ;
            let row    = event.detail.dataCell.y ;
            let level  = event.detail.dataCell.x ;

            const isShift = event.detail.keys.indexOf('SHIFT') != -1;
            const sr = event.detail.primitiveEvent.selectRect ;
            const mp = event.detail.gridPoint ;

            if (sr && sr.expand && mp.x > sr.expand.x1 && mp.x < sr.expand.x2) {   
                grid.behavior.dataModel.toggleRow(sr.value.i, sr.value.l, isShift, sr.value.h);
                if (grid.colRowToggled) {
                    grid.colRowToggled() ;    
                }
            }

            if (grid.dimClicked) {
                grid.dimClicked(axis.dim_number(level));
            }
        }
    });






    Object.getPrototypeOf(grid.behavior).getCursorAt = function(x, y, event) {
//        const rp_len = (this.dataModel.data[y - 1] && this.dataModel.data[y - 1][-1] && this.dataModel.data[y - 1][-1].rowPath) ? this.dataModel.data[y - 1][-1].rowPath.length : 0 ;
            if (y === 0) {
                // horizontal axis
                return "pointer";
            }
            if (y > 0 && x === -1 /* && rp_len <= this.dataModel._config.row_pivots.length && event?.gridPoint.x <= rp_len * 15 + 10*/) {
                return "pointer";
            }
    };

    function updateCursor(event) {
        var cursor = this.behavior.getCursorAt(-1, -1);
        var hoverCell = this.hoverCell;
        if (hoverCell) {
//console.log('hoverCell: ' + hoverCell.x + ', ' + hoverCell.y) ;
        }
        if (hoverCell && hoverCell.x > -2 && hoverCell.y > -1) {
            var x = hoverCell.x + this.getHScrollValue();
            cursor = this.behavior.getCursorAt(x, hoverCell.y + this.getVScrollValue(), event);
        }
        this.beCursor(cursor);
    }

    Object.getPrototypeOf(grid.behavior).onMouseMove = function(grid, event) {
        if (this.featureChain) {
            this.featureChain.handleMouseMove(grid, event);
            updateCursor.call(grid, event);
            this.featureChain.setCursor(grid);
        }
    };


//    Object.getPrototypeOf(grid.behavior).cellClicked = async function(event) {
//    };


}
