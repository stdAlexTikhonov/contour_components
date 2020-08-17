import React from 'react';

import Paper      from '@material-ui/core/Paper';
import CardMedia  from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon    from '@material-ui/core/SvgIcon';

import { ReactComponent as FilterIcon } from './001-cone.svg';

const styles = {
  root: {
    display: 'flex',
    cursor: 'grabbing',
    marginRight: '.125em',
    marginBottom: '.25em',
    border: '1px solid rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    backgroundColor: '#EFEEEE',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    margin: '0.25em',
    padding: 0,
    font: 'normal 400 12px Roboto',
  },
  cover: {
  }
};

class DimensionCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {} ;
    Object.assign(style, styles.root) ;

    if (this.props.tree === true) {
      style.marginLeft  = 'calc(' + (style.marginLeft  || '0px') + ' + ' + (this.props.ndx) * 1 + 'em)';
      style.marginRight = 'calc(' + (style.marginRight || '0px') + ' + ' + (this.props.count - 1 - this.props.ndx) * 1 + 'em)';
    }
    return (
            <Paper elevation={1} style={style} id={this.props.uuid + this.props.axis + this.props.ndx} style={style} index={this.props.dim}>
              <img width={32} height={32} src="./images/earth-globe-icon.png" style={styles.cover}/>
              <div style={styles.details} >
                <span style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.9)', width: this.props.minWidth === true ? 'min-content':'auto' }}>{this.props.data.text}</span>
              </div>
              <IconButton aria-label="delete" size='small'><SvgIcon component={FilterIcon} viewBox="0 0 512 512" style={{ fontSize: 18 }} /></IconButton>
            </Paper>
    );
  }
}

export default DimensionCard;