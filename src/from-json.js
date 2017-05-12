import fs from 'mz/fs';
import path from 'path';
import jsonPointer from 'json-ptr';
import { camelCase } from 'change-case';

function getImportScript(module, imported) {
  const defaultImports = imported
    .filter(i => i.startsWith('default:'))
    .map(i => i.substring('default:'.length));
  const namedImports = imported.filter(i => !i.startsWith('default:'));
  const scripts = [];

  if (defaultImports.length === 1) {
    scripts.push(`import ${defaultImports[0]} from '${module}';`);
  } else if (defaultImports.length > 1) {
    throw new Error(`More than 1 default import for ${module}: ${defaultImports}`);
  }
  if (namedImports.length > 0) {
    scripts.push(`import { ${namedImports.join(', ')} } from '${module}';`);
  }
  return scripts.join('\n');
}

function getScript({ rootId, props, elementScript, imports }) {
  const script = `
  import React from 'react';
  import ReactDOM from 'react-dom';
  ${Object.keys(imports).map(name => getImportScript(name, imports[name])).join('\n')}

  export const Root = props => {
    const bundledProps = ${JSON.stringify(props)};
    const mergedProps = Object.assign({}, bundledProps, props);
    const getProps = pointerFn => pointerFn(mergedProps);

    return (
      <div id="${rootId}" data-props={JSON.stringify(props)}>
        {${elementScript}}
      </div>
    );
  };
  export default function render(element) {
    const root = document.getElementById('${rootId}');
    const props = root ? JSON.parse(root.getAttribute('data-props')) : {};
    ReactDOM.render(<Root {...props}/>, element);
  }
  `;
  return script.trim().replace(/^  /gm, '');
}

function resolveElementType(type) {
  // Try to match '<node-module-name>.<component-name>'
  const [moduleName, componentName] = type.split('.');

  if (moduleName && componentName) {
    // Add a module import based on the type.
    let className;
    const imports = {};

    if (componentName === 'default') {
      // Import is 'import <import-name> from <node-module-name>'
      const importName = camelCase(moduleName);
      imports[moduleName] = [`default:${importName}`];
      className = importName;
    } else {
      // Import is 'import { <component-name> } from '<node-module-name>'
      const [importName] = (componentName.match(/^([^\.]+)\.?(.+)?/) || []).slice(1);
      imports[moduleName] = [importName];
      className = componentName;
    }

    return { className, imports };
  } else if (moduleName) {
    // Type is a literal React component name (e.g. 'div')
    return { className: `'${moduleName}'`, imports: {} };
  } else {
    throw new Error(`Illegal element type ${type}`);
  }
}

function resolveReference(ref) {
  const pointerFn = jsonPointer.create(ref).get.toString();
  return `getProps(${pointerFn})`;
}

function resolvePropValue(prop) {
  if (typeof prop === 'object' && typeof prop.$ref === 'string') {
    return resolveReference(prop.$ref);
  } else {
    return prop;
  }
}

function resolveProps(props) {
  if (!props) return null;
  return Object.keys(props).reduce(
    (obj, key) => Object.assign(obj, { [key]: resolvePropValue(props[key]) }),
    {}
  );
}

function stringifyProps(props) {
  let s = '{';
  for (let key in props) {
    if (s !== '{') s += ', ';
    const val = props[key];
    if (typeof val === 'string' && val.startsWith('getProps(function')) {
      s += `"${key}": ${val}`;
    } else {
      s += `"${key}": ${JSON.stringify(val)}`;
    }
  }
  return s + '}';
}

function elementToScript(element) {
  if (typeof element !== 'object') {
    return { script: `\`${element}\``, imports: {} };
  }
  if (typeof element.$ref === 'string') {
    return { script: `${resolveReference(element.$ref)}.toString()`, imports: {} };
  }

  const { className, imports } = resolveElementType(element.type);
  const props = resolveProps(element.props);
  const children = (element.children || []).map(elementToScript);
  const childScripts = children.map(child => child.script);
  const childImports = children.map(child => child.imports);
  const mergedImports = {};

  // Merge all unique imports.
  for (let imp of [imports, ...childImports]) {
    for (let key in imp) {
      for (let value of imp[key]) {
        if (key in mergedImports) {
          if (!mergedImports[key].includes(value)) {
            mergedImports.push(value);
          }
        } else {
          mergedImports[key] = [value];
        }
      }
    }
  }

  const script = `
  React.createElement(
    ${className},
    ${stringifyProps(props)}${childScripts.length ? ', ' : ''}
    ${childScripts.join(', ')}
  )
  `;

  return { script, imports: mergedImports };
}

async function main(args) {
  const layoutJson = await fs.readFile(args[0]);
  const contentJson = await fs.readFile(args[1]);

  const { script, imports } = elementToScript(JSON.parse(layoutJson));
  const props = JSON.parse(contentJson);

  return getScript({ rootId: 'root', props, elementScript: script, imports });
}

main(process.argv.slice(2)).then(console.log).catch(console.error);
