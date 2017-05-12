import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  page: { fontFamily: 'sans-serif' },
  grid: { display: 'flex' },
  cell: (span = 1) => ({ flex: `0 0 ${span / 12 * 100}%` }),
  footer: { fontStyle: 'italic', fontSize: '0.8em' }
};

export default class PageComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    footer: PropTypes.string.isRequired
  };

  render() {
    return (
      <div style={styles.page}>
        <div style={styles.grid}>
          <div style={styles.cell(12)}>
            <h1>{this.props.title}</h1>
          </div>
        </div>
        <div style={styles.grid}>
          {this.props.children.map((child, i) => <div key={i} style={styles.cell(2)}>{child}</div>)}
        </div>
        <div style={styles.grid}>
          <div style={styles.cell(12)}>
            <p style={styles.footer}>{this.props.footer}</p>
          </div>
        </div>
      </div>
    );
  }
}
