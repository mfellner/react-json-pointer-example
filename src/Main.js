import React from 'react';
import PropTypes from 'prop-types';
import jsonPointer from 'json-ptr';
import { ContextProvider, ContextComponent } from './Context';
import PageComponent from './PageComponent';
import ExampleComponent from './ExampleComponent';

const props = {
  page: {
    title: 'Welcome to this example',
    footer: 'Copyright 2017 Zalando SE'
  },
  components: [
    {
      title: 'I am a nice component',
      image: 'https://upload.wikimedia.org/wikipedia/en/8/87/Keyboard_cat.jpg',
      body: 'This is a great example!'
    },
    {
      title: 'This is a great component',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg',
      body: 'Look at me, I am a pizza!'
    }
  ]
};

const PageContextComponent = ContextComponent(PageComponent, {
  title: '/page/title',
  footer: '/page/footer'
});

const ExampleContextComponent1 = ContextComponent(ExampleComponent, {
  title: '/components/0/title',
  image: '/components/0/image',
  body: '/components/0/body'
});

const ExampleContextComponent2 = ContextComponent(ExampleComponent, {
  title: '/components/1/title',
  image: '/components/1/image',
  body: '/components/1/body'
});

export default () => (
  <ContextProvider {...props}>
    <PageContextComponent>
      <ExampleContextComponent1 />
      <ExampleContextComponent2 />
    </PageContextComponent>
  </ContextProvider>
);
