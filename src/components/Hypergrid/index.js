import React, { FC, useState, forwardRef } from "react";

import DimensionCard        from './../DimensionCard'
import {Permutation, Axis}  from './../OlapEngine'

import Hypergrid            from "./fin-hypergrid";
import                           "./fin-hypergrid/css/style.css";

import Grid                 from '@material-ui/core/Grid';

import { ReactSortable }    from "react-sortablejs";

import format               from './fin-hypergrid/src/lib/format'
import ECharts              from 'echarts';

import PerspectiveDataModel from './fin-hypergrid/src/dataModels/PerspectiveDataModel';
import OLAP_Plugin          from './fin-hypergrid/src/olap/plugin';
import {grid_properties}    from "./fin-hypergrid/src/grid_style";

import ExpandIcon   from '@material-ui/icons/ExpandMore'
import CollapseIcon from '@material-ui/icons/ChevronRight'

import Button from "@material-ui/core/Button";
import { sleep } from "../../utils/helpers";

const CustomComponent = React.forwardRef((props, ref) => {
  return (
    <Grid
      container
      direction = {props.id === 'VDimsTree' ? 'column' : 'row'}
      axis      = {props.id === 'HDims' ? 'h' : (props.id === 'FDims' ? 'f' : 'v')}
      ref       = {ref}
      {...props}
    >
        {props.children}
    </Grid>
  )
});

const echart_option = {
  animation: false,
  grid: [],
  xAxis: [],
  yAxis: [],
  series: [],
  backgroundColor: 'transparent',

  textStyle: {
    fontFamily: 'Roboto',
    fontSize: 14
  },
  tooltip: {
    formatter: function f(params) {
      params = params[0];
      return '<b>' + params.name + '</b><br>' + (params.value == null ? '-' : format('# ###.00', params.value));
    },
    textStyle: {
      color: '#202124'
    },
    backgroundColor: 'rgba(255,255,255,1)',
    borderColor: 'rgba(204,204,204,1)',
    borderWidth: 1,
    extraCssText: 'box-shadow: rgba(0,0,0,0.25) 0px 2px 9px; border-radius: 0px',
    trigger: 'axis',
    axisPointer: {
      type: 'none' // 'line' | 'shadow'
    }
  }
};

const GridContainerStyle = {
  flex:          '1 0 auto',
  position:      'relative',
  paddingRight:  '0.2em',
};
const FilterDimStyle = {
  width:         '-webkit-fill-available',
  overflow:      'auto',
  flexWrap:      'wrap',
  paddingRight:  '0.2em',
  paddingBottom: '1.0em',
};
const VerticalDimStyle = {
  width:         'auto',
  position:      'absolute',
  overflow:      'auto',
  paddingRight:  '0.2em',
  paddingBottom: '0.0em',
};
const HorizontalDimStyle = {
  width:         '-webkit-fill-available',
  position:      'absolute',
  overflow:      'auto',
  flexWrap:      'wrap',
  paddingRight:  '0.2em',
  paddingBottom: '0.0em',
};

const generateUID = () => {
  return (
    "_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

class ReactHypergrid extends React.Component {
  constructor(props) {
    super(props);
    this.uuid    = generateUID() ;
    this.element     = null ;
    this.fDimElement = null ;
    this.hDimElement = null ;
    this.vDimElement = null ;

    this.grid = null ;
    this.af   = 0 ;

    this.state = {
      fDims : [],
      hDims : [],
      vDims : [],
      vAxisTree:  false,
      isDragging: false
    } ;
  }

  dnd = () => {
     const d = {
       group: { name: this.uuid },
       animation: 200,
       delayOnTouchStart: true,
       delay: 2,
       onStart: (function (evt) { this.startDrag(evt) ; }).bind(this),
       onEnd:   (function (evt) { this.endDrag(evt)   ; }).bind(this),
    }
    return d ;
  } ;
  startDrag = (evt) => {
    this.setState({ isDragging: true });
  }
  endDrag = (evt) => {
    this.setState({ isDragging: false });
    this.permute(evt)
  }

  permute = (evt) => {
    console.log("Permute: ", evt.to, evt.from, evt.oldIndex, evt.newIndex);

    const model = this.grid.behavior.dataModel;
    var axis_to   = evt.to.attributes.axis.value;
    var axis_from = evt.from.attributes.axis.value;

    model.dims[axis_from] = model.dims[axis_from] || [];
    model.dims[axis_to]   = model.dims[axis_to]   || [];

    model.dims[axis_from].splice(evt.oldIndex, 1);
    model.dims[axis_to].splice(evt.newIndex, 0, Number(evt.item.attributes.index.value));

    console.log(model.dims.h);
    console.log(model.dims.v);

    //  temporary for test
    this.putDimension(model, true);
  }

  getImage = (model, dim_num, val_ndx) => {
    const images = model.dimension[dim_num].images ;
    if (val_ndx == null || !images?.images)
      return ;
    console.log('GET IMAGE dim=' + dim_num + ' value=' + val_ndx) ;
    if (!model.images)
      model.images = [] ;
    if (!model.images[dim_num])
      model.images[dim_num] = [] ;
    model.images[dim_num][val_ndx] = true ;

    const path = images.images[val_ndx] ;
    if (path && path != '') {

      const image = document.createElement("img") ;
      image.onload = (function () {
        const ctx = document.createElement("canvas").getContext("2d");
        const r = 28 - 3 - 3;
        ctx.canvas.height = ctx.canvas.width = r ;
//ctx.fillStyle = "#f00";
//ctx.fillRect(0, 0, r, r) ;
//ctx.globalCompositeOperation = 'destination-in' ;
        const k = Math.min(r / image.naturalWidth, r / image.naturalHeight) ;
        ctx.drawImage(image, (r - image.naturalWidth * k) / 2, (r - image.naturalHeight * k) / 2, image.naturalWidth * k, image.naturalHeight * k) ;
        model.images[dim_num][val_ndx] = ctx.canvas ;
        this.grid.repaint() ;
      }).bind(this) ;
      image.src = 'https://stat.world/biportal/' + path;
//      image.src = 'https://www.svgrepo.com/show/25420/thermometer.svg'
    }
  }

  setData = (Result) => {
//    Result = window['result'];

    const model = this.grid.behavior.dataModel;
    model.getImage = this.getImage.bind(this, model) ;

    model.isShowChart = { on: false, type: 'spline', axis: 'row' };
    model.isDataBar = false;
    model.isDataBar2 = false;

    // Set dimension on axis's
    model.dims  = Result.dim;
    model.facts = Result.fact;
    model.dimension = Result.dimension;

    const permV = new Permutation(Result.axis.v);
    const permH = new Permutation(Result.axis.h);

    permV.dims_val = Result.dimension;
    permV._values = Result.data;

    permH.dims_val = Result.dimension;
    permH._values = Result.data;

    const axisV = new Axis(permV, Result.axis.size_v);
    axisV.isTree = true ;

    let state = this.state ;
    state.vAxisTree = axisV.isTree ;
    this.setState(state) ;

    axisV.isShowTotal = true;
    axisV.isShowGrandTotal = true;
    axisV.isTotalFirst = false;
    axisV.isInverseSort = false;
    axisV.isAllowCollapse = true;

    const axisH = new Axis(permH, Result.axis.size_h);
    axisH.isTree = false;
    axisH.isShowTotal = true;
    axisH.isShowGrandTotal = true;
    axisH.isTotalFirst = true;
    axisH.isInverseSort = false;
    axisH.isAllowCollapse = true;

    model._axisV = axisV;
    model._axisH = axisH;
    model._values = Result.data;

    axisH.setCollapsedLevel(-1, false);
    axisV.setCollapsedLevel(-1, false);

    axisH.validate();
    axisV.validate();

    model.setRowCount(axisV.size());
    model._grid.behavior.setPSP(model);

    this.putDimension(model, true);
  };

  updateVerticalAxisHeader = (reset) => {
    if (this.vDimElement?.current == null || this.hDimElement?.current == null)
      return ;

    const grid_dims_v = this.vDimElement.current;
    const grid_dims_h = this.hDimElement.current;
    const grid        = this.grid ;

    const gridLineV = (grid.properties.gridLinesRowHeaderV ? grid.properties.gridLinesVWidth : 0);
    const gridLineH = (grid.properties.gridLinesRowHeaderH ? grid.properties.gridLinesHWidth : 0);

    for (let i = 0; i <= grid.behavior.dataModel._axisV.currentWidth(); ++i) {
      const n = document.getElementById(this.uuid + 'v' + i);
      if (n==null)
        continue ;
      n.style.minWidth = 'auto' ;
    }

    if (grid.behavior.dataModel._axisV.isTree) {
        const n = grid_dims_v;
        const i = 0;

        const cs            = window.getComputedStyle(n) ;
        const margin_left   = parseFloat(cs.marginLeft);
        const margin_right  = parseFloat(cs.marginRight);
        const padding_left  = parseFloat(cs.paddingLeft);
        const paddinf_right = parseFloat(cs.paddingRight);
        const min_width     = n.getBoundingClientRect().width + margin_left + margin_right + padding_left + paddinf_right;

        if (reset || !grid.behavior.columns[i]._properties.minimumColumnWidthAxis) {
            grid.behavior.columns[i]._properties.minimumColumnWidthAxis = min_width + gridLineV + 1;
            grid.behavior.columns[i]._properties.columnAutosized = false;
            grid.behavior.columns[i]._properties.columnAutosizing = true;
        }
    } else {
        for (let i = 0; i <= grid.behavior.dataModel._axisV.currentWidth(); ++i) {
            const n = document.getElementById(this.uuid + 'v' + i);
            if (n==null)
              continue ;
  
            const cs            = window.getComputedStyle(n) ;
            const margin_left   = parseFloat(cs.marginLeft);
            const margin_right  = parseFloat(cs.marginRight);
            const padding_left  = parseFloat(cs.paddingLeft);
            const paddinf_right = parseFloat(cs.paddingRight);
            const min_width     = n.getBoundingClientRect().width + margin_left + margin_right + padding_left + paddinf_right;

            if (reset || !grid.behavior.columns[i]._properties.minimumColumnWidthAxis) {
                grid.behavior.columns[i]._properties.minimumColumnWidthAxis = min_width + gridLineV + 1;
                grid.behavior.columns[i]._properties.columnAutosized = false;
                grid.behavior.columns[i]._properties.columnAutosizing = true;
            }
        }
    }

    grid.renderer.computeCellsBounds(true);
    grid.repaint();

    var w = grid.behavior.getFixedColumnsWidth() - gridLineV;
    grid_dims_h.style.marginLeft = 'calc(' + w + 'px' + ' - ' + window.getComputedStyle(grid_dims_h).paddingLeft + ')';

    // second

    for (let i = 0; i <= grid.behavior.dataModel._axisV.currentWidth(); ++i) {
        const width = grid.behavior.getColumnWidth(grid.behavior.dataModel._axisV.isTree ? 0 : i) + gridLineV;
        const n = document.getElementById(this.uuid + 'v' + i) ;
        if (n==null)
          continue ;
        const cs = window.getComputedStyle(n) ;
        const margin_left  = cs.marginLeft;
        const margin_right = cs.marginRight;
        n.style.minWidth   = `calc(${width}px - ${cs.marginLeft} - ${cs.marginRight} - ${cs.borderLeftWidth} - ${cs.borderRightWidth})`;
    }


    const headerDataModel = grid.behavior.subgrids.lookup.header;
    let hAxisHeight = 0;
    for (let i = 1; i < headerDataModel.getRowCount(); ++i) {
        hAxisHeight += grid.getRowHeight(i, headerDataModel) + gridLineH;
    }

    const v_dim_height = grid_dims_v.getBoundingClientRect().height;
    const h_dim_height = grid_dims_h.getBoundingClientRect().height;

    grid.behavior.vDimHeaderHeight = v_dim_height;
    grid.behavior.hDimHeaderHeight = h_dim_height;

    const extend = Math.floor(Math.max(0, Math.max(h_dim_height, v_dim_height - hAxisHeight)));

    if (grid.getRowHeight(0, headerDataModel) != extend) {
        grid.setRowHeight(0, extend, headerDataModel);
    }

    grid_dims_h.style.marginTop = Math.max(0, extend - h_dim_height) + 'px';

    hAxisHeight += grid.getRowHeight(0, headerDataModel) + gridLineH;
    grid_dims_v.style.marginTop = 
        'calc(' +
        Math.max(0, hAxisHeight - grid_dims_v.getBoundingClientRect().height) + 'px' + ' + ' +
        window.getComputedStyle(grid_dims_v).paddingBottom + ' + ' +
        window.getComputedStyle(grid_dims_v).paddingTop    +
        ')';

    grid.renderer.needsComputeCellsBounds = true;
    grid.repaint();
} ;

  putDimension = (model, filter) => {
    let s_fDims = this.state.fDims;
    if (filter) {
      const fDim = Object.keys(model.dimension).filter(x => (!model.dims.v.includes(Number(x)) && !model.dims.h.includes(Number(x))));
      s_fDims.length = 0;
      fDim.forEach(x => { s_fDims.push({ 'key': x, 'text': model.dimension[x].text }) });
    }
    const hDim = model.dims.h.slice(0, model._axisH.currentWidth() + 1);
    let s_hDims = this.state.hDims;
    s_hDims.length = 0;
    hDim.forEach(x => { s_hDims.push({ 'key': x, 'text': model.dimension[x].text }) });

    const vDim = model.dims.v.slice(0, model._axisV.currentWidth() + 1);
    let s_vDims = this.state.vDims;
    s_vDims.length = 0;
    vDim.forEach(x => { s_vDims.push({ 'key': x, 'text': model.dimension[x].text }) });
    this.setState({ s_vDims, s_hDims, s_fDims });

    this.requestAF() ;
  };

  getInstance = () => {
    if (!this.grid) {
//        const elem = document.getElementById(this.props.gridData.id);
//        this.element.style.height = '500px';
//        document.body.appendChild(this.element);
//        sleep(10000).then(result => {
//          elem.innerHTML = '';
//          elem.appendChild(document.getElementById('hypergrid'));
//          document.querySelector("#hypergrid canvas").style.left = 0;
//        })
        this.grid = new Hypergrid(this.element, { DataModel: PerspectiveDataModel });
        this.grid.installPlugins([OLAP_Plugin]);
        this.grid.addProperties(grid_properties);
        this.grid.addProperties({ CollapseIcon: CollapseIcon.type.render().props.children.props.d,
                                  ExpandIcon:   ExpandIcon.type.render().props.children.props.d,
                                });
        const model = this.grid.behavior.dataModel;
        model._grid = this.grid;

        this.grid.colRowToggled = function () {
          this.putDimension(model, false);
        }.bind(this);

          // Chart
        var container = document.createElement('div');
        container.style.position = 'absolute';

        this.element.insertBefore(container, this.element.firstChild.nextSibling.nextSibling);

        const chart = ECharts.init(container);
        this.grid.chartDiv       = container;
        this.grid.chart          = chart;
        this.grid.chartOption    = {} ;
        this.grid.chartOptionSet = true;
        Object.assign(this.grid.chartOption, echart_option) ;

      const grid = this.grid;
      var resizeScrollbars = grid.resizeScrollbars;
      this.grid.resizeScrollbars = function () {
        resizeScrollbars.bind(grid).call();
        this.updateVerticalAxisHeader(false);
      }.bind(this);

      // Data
      this.setData(this.props.gridData);
    }
    return this.grid;
  };

  rerender = () => {
    this.getInstance() ;
    this.updateVerticalAxisHeader(true);
  };

  requestAF = () => {
    window.requestAnimationFrame(this.rerender.bind(this));
  }

  componentDidMount() {
    this.getInstance() ;
    document.fonts.load('normal 400 12px Roboto').then((function (a) { this.requestAF(); }).bind(this));
    this.requestAF() ;
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <Grid container direction="column" alignItems="flex-start" style={{ padding: '0.25em 0px 0px 0.25em', overflow: 'hidden' }} >
        {/* Filter dimensions */}
        <ReactSortable
          {... this.dnd() }
          className={this.state.isDragging ? "axis-in-drag" : ""}
          axis     ={'f'}
          tag      ={CustomComponent}
          list     ={this.state.fDims}
          setList  ={newState => this.setState({ fDims: newState })}
          id       ={'FDims'}
          ref      ={(e) => { if (e) this.fDimElement = e.ref; }}
          style    ={FilterDimStyle}
        >
        {this.state.fDims.map((value, ndx) => { return <DimensionCard axis='f' minWidth={false} data={value} key={value.key} dim={value.key} ndx={ndx} uuid={this.uuid}/> })}
        </ReactSortable>

        <Grid id='GridContainer' container direction="row" style={GridContainerStyle}>
          {/* Grid */}
          <div id='HyperGrid' ref={(e) => { this.element = e; }} id={this.props.id}/>

          {/* Vertical axis dimensions */}
          <ReactSortable {... this.dnd() } className={this.state.isDragging ? "axis-in-drag" : ""} axis={'v'} tag={CustomComponent} list={this.state.vDims} setList={newState => this.setState({ vDims: newState })} id={ this.state.vAxisTree ? 'VDimsTree' : 'VDims'} ref={(e) => { if (e) this.vDimElement = e.ref; }} style={VerticalDimStyle}>
          {this.state.vDims.map((value, ndx) => { return <DimensionCard axis='v' minWidth={true} data={value} key={value.key} tree={this.state.vAxisTree} dim={value.key} ndx={ndx} count={this.state.vDims.length} uuid={this.uuid} /> })}
          </ReactSortable>
          {/* Horizontal axis dimensions */}
          <ReactSortable {... this.dnd() } className={this.state.isDragging ? "axis-in-drag" : ""} axis={'h'} tag={CustomComponent} list={this.state.hDims} setList={newState => this.setState({ hDims: newState })} id='HDims' ref={(e) => { if (e) this.hDimElement = e.ref; }} style={HorizontalDimStyle}>
          {this.state.hDims.map((value, ndx) => { return <DimensionCard axis='h' minWidth={true} data={value} key={value.key} dim={value.key} ndx={ndx} uuid={this.uuid}/> })}
          </ReactSortable>
        </Grid>
      </Grid>
    );
  }

}

export default ReactHypergrid;
