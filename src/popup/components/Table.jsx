import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataProcessing from '../../js/DataProcessing';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.defaultFavUrl = chrome.runtime.getURL('/assets/defaultFavicon16.png');
    this.imagesList = [];
  }

  componentWillMount() {
    // for (let key in this.refs) {
    //   const imageCell = this.refs[key];
    //   const image = document.createElement('img');

    //   image.classList.add('favImage');
    //   image.src = imageCell.dataset.src;
    //   delete imageCell.dataset.src;
    //   image.onerror = (ev) => ev.target.src = this.defaultUrl;
    //   imageCell.appendChild(image);
    // }
  }

  renderTableBody() {
    return this.props.tableData.map((item, index) => {
      return <tr key={index + 1}>
        <td>{ index + 1 }</td>
        <td>
          <LazyLoadImage className="favImage"
            src={ item[2] }
            ref={(reference) => this.imagesList.push(reference)}/></td>
        <td>{ item[0] }</td>
        <td className="spentTimeCell">{ DataProcessing.parseSecondsIntoTime(item[1]) }</td>
      </tr>;
    });
  }

  render() {
    return (
      <table className={ `table${ this.props.striped ? ' table-striped' : '' }` }>
        <tbody>{ this.renderTableBody() }</tbody>
      </table>
    );
  }
}

Table.propTypes = {
  striped: PropTypes.bool,
  tableData: PropTypes.array,
};
