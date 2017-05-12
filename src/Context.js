import React from 'react';
import PropTypes from 'prop-types';
import jsonPointer from 'json-ptr';

export class ContextProvider extends React.Component {
  static childContextTypes = {
    getProps: PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      getProps: this.getProps.bind(this)
    };
  }

  getProps(pointer) {
    return pointer.get(this.props);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export const ContextComponent = (WrappedComponent, pointers = {}) => {
  const compiledPointers = Object.keys(pointers).reduce(
    (obj, key) => Object.assign(obj, { [key]: jsonPointer.create(pointers[key]) }),
    {}
  );

  return class ContextWrapper extends React.Component {
    static contextTypes = {
      getProps: PropTypes.func.isRequired
    };

    render() {
      const contextProps = Object.keys(compiledPointers).reduce(
        (obj, key) => Object.assign(obj, { [key]: this.context.getProps(compiledPointers[key]) }),
        {}
      );
      return <WrappedComponent {...Object.assign(contextProps, this.props)} />;
    }
  };
};
