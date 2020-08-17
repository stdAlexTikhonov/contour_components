/* eslint-env browser */
/* global requestAnimationFrame */

'use strict';

// This feature is responsible for column drag and drop reordering.
// This object is a mess and desperately needs a complete rewrite.....

var Feature = require('./Feature');

var GRAB = ['grab', '-moz-grab', '-webkit-grab'],
    GRABBING = ['grabbing', '-moz-grabbing', '-webkit-grabbing'],
    setName = function(name) { this.cursor = name; };

var columnAnimationTime = 150;
var dragger;
var draggerCTX;
var floatColumn;
var floatColumnCTX;

function translate(grid, x, y) {
    if (grid.isIE11) {
        var zoomFactor = grid.getBodyZoomFactor();
        x *= zoomFactor;
        y *= zoomFactor;
    }
    return 'translate(' + x + 'px, ' + y + 'px)';
}

/**
 * @constructor
 * @extends Feature
 */
var ColumnMoving = Feature.extend('ColumnMoving', {

    /**
     * queue up the animations that need to play so they are done synchronously
     * @type {Array}
     * @memberOf CellMoving.prototype
     */
    floaterAnimationQueue: [],

    columnDragAutoScrollingRight: false,
    columnDragAutoScrollingLeft: false,
    columnDragAutoScrollingTop: false,
    columnDragAutoScrollingBottom: false,

    /**
     * is the drag mechanism currently enabled ("armed")
     * @type {boolean}
     * @memberOf CellMoving.prototype
     */
    dragArmed: false,

    /**
     * am I dragging right now
     * @type {boolean}
     * @memberOf CellMoving.prototype
     */
    dragging: false,

    /**
     * the column index of the currently dragged column
     * @type {number}
     * @memberOf CellMoving.prototype
     */
    dragCol: -1,

    /**
     * an offset to position the dragged item from the cursor
     * @type {number}
     * @memberOf CellMoving.prototype
     */
    dragOffset: 0,

    /**
     * @memberOf CellMoving.prototype
     * @desc give me an opportunity to initialize stuff on the grid
     * @param {Hypergrid} grid
     */
    initializeOn: function(grid) {
        this.isFloatingNow = false;
        this.initializeAnimationSupport(grid);
        if (this.next) {
            this.next.initializeOn(grid);
        }
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc initialize animation support on the grid
     * @param {Hypergrid} grid
     */
    initializeAnimationSupport: function(grid) {
        if (!dragger) {
            dragger = document.createElement('canvas');
            dragger.setAttribute('width', '0px');
            dragger.setAttribute('height', '0px');
            dragger.style.position = 'fixed';

            document.body.appendChild(dragger);
            draggerCTX = dragger.getContext('2d', { alpha: false });
        }
        if (!floatColumn) {
            floatColumn = document.createElement('canvas');
            floatColumn.setAttribute('width', '0px');
            floatColumn.setAttribute('height', '0px');
            floatColumn.style.position = 'fixed';

            document.body.appendChild(floatColumn);
            floatColumnCTX = floatColumn.getContext('2d', { alpha: false });
        }

    },

    /**
     * @memberOf CellMoving.prototype
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleMouseDrag: function(grid, event) {
        var x;
        var y;

        if (this.dragging) {
            x = event.primitiveEvent.detail.mouse.x;
            y = event.primitiveEvent.detail.mouse.y;
            this.dragColumn(grid, x, y);
        }
        
        var distanceX = Math.abs(event.primitiveEvent.detail.dragstart.x - event.primitiveEvent.detail.mouse.x);
        var distanceY = Math.abs(event.primitiveEvent.detail.dragstart.y - event.primitiveEvent.detail.mouse.y);

        if (this.dragArmed && !this.dragging && (distanceX < 3 && distanceY < 3)) {
            this.dragging = true;
            this.dragOffset = event.mousePoint;
            x = event.primitiveEvent.detail.mouse.x - this.dragOffset.x;
            y = event.primitiveEvent.detail.mouse.y - this.dragOffset.y;
            this.createDragColumn(grid, x, y, event.bounds);
        } 
        if (this.next) {
            this.next.handleMouseDrag(grid, event);
        }
    },

    /**
     * @memberOf CellMoving.prototype
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleMouseDown: function(grid, event) {
        if (!event.primitiveEvent.detail.isRightClick
            && grid.properties.allowDrag === true
        ) {
            const v = grid.behavior.dataModel._axis._axis[event.dataCell.y].n ;
            this.dragValue = v ;
//            console.log(v[5]) ;
            this.dragArmed = true;
            this.cursor = GRABBING;
        } else if (this.next) {
            this.next.handleMouseDown(grid, event);
        }
    },

    /**
     * @memberOf CellMoving.prototype
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleMouseUp: function(grid, event) {
        //var col = event.gridCell.x;
        if (this.dragging) {
            this.cursor = null;
            this.endDragColumn(grid, event);
        }
        this.dragValue = null;
        this.dropValue = null;
        
        this.dragging = false;
        this.dragArmed = false;
        this.cursor = null;
        grid.repaint();

        if (this.next) {
            this.next.handleMouseUp(grid, event);
        }
    },

    /**
     * @memberOf CellMoving.prototype
     * @param {Hypergrid} grid
     * @param {Object} event - the event details
     */
    handleMouseMove: function(grid, event) {
        if (this.dragging) {
            const v = grid.behavior.dataModel._axis._axis[event.dataCell.y].n ;
            this.dropValue = v ;
            this.cursor = (v[1] == this.dragValue[1]) ? 'pointer' : 'move' ;
            
        }
        if (this.next) {
            this.next.handleMouseMove(grid, event);
        }
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc this is the main event handler that manages the dragging of the column
     * @param {Hypergrid} grid
     * @param {boolean} draggedToTheRight - are we moving to the right
     */
    floatColumnTo: function(grid, draggedToTheRight) {
        this.floatingNow = true;

        var visibleColumns = grid.renderer.visibleColumns;
        var scrollLeft = grid.getHScrollValue();
        var floaterIndex = grid.renderOverridesCache.floater.columnIndex;
        var draggerIndex = grid.renderOverridesCache.dragger.columnIndex;
        var hdpiratio = grid.renderOverridesCache.dragger.hdpiratio;

        var draggerStartX;
        var floaterStartX;
        var fixedColumnCount = grid.getFixedColumnCount();
        var draggerWidth = grid.getColumnWidth(draggerIndex);
        var floaterWidth = grid.getColumnWidth(floaterIndex);

        var max = grid.getVisibleColumnsCount();

        var doffset = 0;
        var foffset = 0;

        if (draggerIndex >= fixedColumnCount) {
            doffset = scrollLeft;
        }
        if (floaterIndex >= fixedColumnCount) {
            foffset = scrollLeft;
        }

        if (draggedToTheRight) {
            draggerStartX = visibleColumns[Math.min(max, draggerIndex - doffset)].left;
            floaterStartX = visibleColumns[Math.min(max, floaterIndex - foffset)].left;

            grid.renderOverridesCache.dragger.startX = (draggerStartX + floaterWidth) * hdpiratio;
            grid.renderOverridesCache.floater.startX = draggerStartX * hdpiratio;

        } else {
            floaterStartX = visibleColumns[Math.min(max, floaterIndex - foffset)].left;
            draggerStartX = floaterStartX + draggerWidth;

            grid.renderOverridesCache.dragger.startX = floaterStartX * hdpiratio;
            grid.renderOverridesCache.floater.startX = draggerStartX * hdpiratio;
        }
        grid.swapColumns(draggerIndex, floaterIndex);
        grid.renderOverridesCache.dragger.columnIndex = floaterIndex;
        grid.renderOverridesCache.floater.columnIndex = draggerIndex;


        this.floaterAnimationQueue.unshift(this.doColumnMoveAnimation(grid, floaterStartX, draggerStartX));

        this.doFloaterAnimation(grid);

    },

    /**
     * @memberOf CellMoving.prototype
     * @desc manifest the column drag and drop animation
     * @param {Hypergrid} grid
     * @param {number} floaterStartX - the x start coordinate of the column underneath that floats behind the dragged column
     * @param {number} draggerStartX - the x start coordinate of the dragged column
     */
    doColumnMoveAnimation: function(grid, floaterStartX, draggerStartX) {
        var self = this;
        return function() {
            var d = floatColumn;
            d.style.display = 'inline';
            self.setCrossBrowserProperty(d, 'transform', translate(grid, floaterStartX, 0));

            //d.style.webkit-webkit-Transform = 'translate(' + floaterStartX + 'px, ' + 0 + 'px)';
            //d.style.webkit-webkit-Transform = 'translate(' + floaterStartX + 'px, ' + 0 + 'px)';

            requestAnimationFrame(function() {
                self.setCrossBrowserProperty(d, 'transition', (self.isWebkit ? '-webkit-' : '') + 'transform ' + columnAnimationTime + 'ms ease');
                self.setCrossBrowserProperty(d, 'transform', translate(grid, draggerStartX, -2));
            });
            grid.repaint();
            //need to change this to key frames

            setTimeout(function() {
                self.setCrossBrowserProperty(d, 'transition', '');
                grid.renderOverridesCache.floater = null;
                grid.repaint();
                self.doFloaterAnimation(grid);
                requestAnimationFrame(function() {
                    d.style.display = 'none';
                    self.isFloatingNow = false;
                });
            }, columnAnimationTime + 50);
        };
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc manifest the floater animation
     * @param {Hypergrid} grid
     */
    doFloaterAnimation: function(grid) {
        if (this.floaterAnimationQueue.length === 0) {
            this.floatingNow = false;
            grid.repaint();
            return;
        }
        var animation = this.floaterAnimationQueue.pop();
        animation();
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc utility function for setting cross browser css properties
     * @param {HTMLElement} element - descripton
     * @param {string} property - the property
     * @param {string} value - the value to assign
     */
    setCrossBrowserProperty: function(element, property, value) {
        var uProperty = property[0].toUpperCase() + property.substr(1);
        this.setProp(element, 'webkit' + uProperty, value);
        this.setProp(element, 'Moz' + uProperty, value);
        this.setProp(element, 'ms' + uProperty, value);
        this.setProp(element, 'O' + uProperty, value);
        this.setProp(element, property, value);
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc utility function for setting properties on HTMLElements
     * @param {HTMLElement} element - descripton
     * @param {string} property - the property
     * @param {string} value - the value to assign
     */
    setProp: function(element, property, value) {
        if (property in element.style) {
            element.style[property] = value;
        }
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc create the dragged column at columnIndex above the floated column
     * @param {Hypergrid} grid
     * @param {number} x - the start position
     * @param {number} columnIndex - the index of the column that will be floating
     */
    createDragColumn: function(grid, x, y, bounds) {
        var hdpiRatio = grid.getHiDPI();
  
        var columnWidth = bounds.width ;
        var colHeight   = bounds.height ;
        
        var d = dragger;
        d.bounds = bounds ;
        
        var location = grid.div.getBoundingClientRect();
        var style = d.style;

        style.top  = location.top + 'px';
        style.left = location.left + 'px';
        style.opacity = 0.85;
        style.boxShadow = '4px 4px 8px rgba(0,0,0,0.5)';

        style.backgroundColor = grid.properties.backgroundColor;

        d.setAttribute('width',  Math.round(columnWidth * hdpiRatio));
        d.setAttribute('height', Math.round(colHeight   * hdpiRatio));
        d.style.setProperty('pointer-events', 'none') ;
                    
        var zoomFactor = grid.isIE11 ? grid.getBodyZoomFactor() : 1;
        style.width  = columnWidth * zoomFactor + 'px'; //Math.round(columnWidth / hdpiRatio) + 'px';
        style.height = colHeight   * zoomFactor + 'px'; //Math.round(colHeight / hdpiRatio) + 'px';

        draggerCTX.scale(hdpiRatio, hdpiRatio);

        grid.renderOverridesCache.dragger = {
            bounds: d.bounds,
            ctx: draggerCTX,
            hdpiratio: hdpiRatio
        };

        this.setCrossBrowserProperty(d, 'transform', translate(grid, x, y));
        style.zIndex = '5';
        GRABBING.forEach(setName, style);
        grid.repaint();
        grid.renderOverridesCache = {} ;
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc this function is the main dragging logic
     * @param {Hypergrid} grid
     * @param {number} x - the start position
     */
    dragColumn: function (grid, x, y) {
        var self = this;
        var d = dragger;

        this.setCrossBrowserProperty(d, 'transition', (self.isWebkit ? '-webkit-' : '') + 'transform ' + 0 + 'ms ease, box-shadow ' + columnAnimationTime + 'ms ease');
        this.setCrossBrowserProperty(d, 'transform', translate(grid, x, y));

        requestAnimationFrame(function () {
            d.style.display = 'inline';
        });

        var hdpiRatio = grid.getHiDPI();

        //------------------------------------------------------------------------------------------
        var minX = 0;
        var maxX = grid.renderer.visibleColumns[grid.renderer.visibleColumns.length - 1].left;
        x = Math.max(minX, Math.min(x, maxX)) ;
        
        const zx = grid.properties.minimumColumnWidth / 2 || 32 ;

        if (x < minX + zx)
            this.checkAutoScrollToLeft(grid);
        else
            this.columnDragAutoScrollingLeft = false;

        if (x + zx > maxX)
            this.checkAutoScrollToRight(grid);
        else
            this.columnDragAutoScrollingRight = false;
        //------------------------------------------------------------------------------------------
        var minY = 0;
        var maxY = grid.renderer.visibleRows[grid.renderer.visibleRows.length - 1].top;
        y = Math.max(minY, Math.min(y, maxY)) ;
        
        const zy = grid.properties.defaultRowHeight / 2 || 32 ;

        if (y < minY + zy)
            this.checkAutoScrollToTop(grid);
        else
            this.columnDragAutoScrollingTop = false;

        if (y + zy > maxY)
            this.checkAutoScrollToBottom(grid);
        else
            this.columnDragAutoScrollingBottom = false;
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc autoscroll to the right if necessary
     * @param {Hypergrid} grid
     * @param {number} x - the start position
     */
    checkAutoScrollToRight: function(grid) {
        if (this.columnDragAutoScrollingRight) {
            return;
        }
        this.columnDragAutoScrollingRight = true;
        this._checkAutoScrollToRight(grid);
    },

    _checkAutoScrollToRight: function(grid) {
        if (!this.columnDragAutoScrollingRight) {
            return;
        }
        var scroll = grid.getHScrollValue();
        if (!grid.dragging || scroll > (grid.sbHScroller.range.max - 1)) {
            return;
        }

        grid.scrollBy(1, 0);
        setTimeout(this._checkAutoScrollToRight.bind(this, grid), 100);
    },
    
    checkAutoScrollToBottom: function(grid) {
        if (this.columnDragAutoScrollingBottom) {
            return;
        }
        this.columnDragAutoScrollingBottom = true;
        this._checkAutoScrollToBottom(grid);
    },

    _checkAutoScrollToBottom: function(grid) {
        if (!this.columnDragAutoScrollingBottom) {
            return;
        }
        var scroll = grid.getVScrollValue();
        if (!grid.dragging || scroll > (grid.sbVScroller.range.max - 1)) {
            return;
        }

        grid.scrollBy(0, 1);
        setTimeout(this._checkAutoScrollToBottom.bind(this, grid), 100);
    },

    /**
     * @memberOf CellMoving.prototype
     * @desc autoscroll to the left if necessary
     * @param {Hypergrid} grid
     * @param {number} x - the start position
     */
    checkAutoScrollToLeft: function(grid) {
        if (this.columnDragAutoScrollingLeft) {
            return;
        }
        this.columnDragAutoScrollingLeft = true;
        this._checkAutoScrollToLeft(grid);
    },

    _checkAutoScrollToLeft: function(grid) {
        if (!this.columnDragAutoScrollingLeft) {
            return;
        }

        var scroll = grid.getHScrollValue();
        if (!grid.dragging || scroll < 1) {
            return;
        }
        grid.scrollBy(-1, 0);
        setTimeout(this._checkAutoScrollToLeft.bind(this, grid), 100);
    },

    checkAutoScrollToTop: function(grid) {
        if (this.columnDragAutoScrollingTop) {
            return;
        }
        this.columnDragAutoScrollingTop = true;
        this._checkAutoScrollToTop(grid);
    },

    _checkAutoScrollToTop: function(grid) {
        if (!this.columnDragAutoScrollingTop) {
            return;
        }

        var scroll = grid.getVScrollValue();
        if (!grid.dragging || scroll < 1) {
            return;
        }
        grid.scrollBy(0, -1);
        setTimeout(this._checkAutoScrollToTop.bind(this, grid), 100);
    },
    /**
     * @memberOf CellMoving.prototype
     * @desc a column drag has completed, update data and cleanup
     * @param {Hypergrid} grid
     */
    endDragColumn: function(grid, event) {
        var self = this;
        const d  = dragger ;
        var drag = this.dragValue;
        var drop = this.dropValue ;
        var changed = drag[0] != drop[0];
 
        self.setCrossBrowserProperty(d, 'transition', (self.isWebkit ? '-webkit-' : '') + 'transform ' + columnAnimationTime + 'ms ease, box-shadow ' + columnAnimationTime + 'ms ease');
        self.setCrossBrowserProperty(d, 'transform', translate(grid, event.bounds.x, event.bounds.y));
        d.style.boxShadow = '0px 0px 0px #888888';

        setTimeout(function() {
            grid.renderOverridesCache.dragger = null;
            grid.repaint();
            requestAnimationFrame(function() {
                d.style.display = 'none';
                grid.endDragColumnNotification(); //internal notification
                if (changed){
                    grid.fireSyntheticCellMoveEvent(drag, drop);
                }
            });
        }, columnAnimationTime + 50);

    }

});

module.exports = ColumnMoving;