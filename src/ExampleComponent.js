import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  grid: { display: 'flex' },
  cell: { flex: 1 },
  component: { color: '#444444', backgroundColor: '#efefef', padding: '10px', margin: '5px' },
  image: { width: '400px' }
};

export default class ExampleComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
  };

  render() {
    return (
      <div style={{ ...styles.grid, ...styles.component }}>
        <div style={styles.cell}>
          <h2 style={styles.title}>{this.props.title}</h2>
          <img style={styles.image} src={this.props.image} alt="great" />
          <p>{this.props.body}</p>
        </div>
      </div>
    );
  }
}
