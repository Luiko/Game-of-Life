import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';
import AppContainer, { App, Board } from './index';

test('React application', t => {
  t.plan(4);
  const wrapper = shallow(<AppContainer/>);
  t.true(wrapper.exists(), 'React application exists');
  t.assert(Array.isArray(wrapper.state("board")), 'has a array');
  t.equal(wrapper.name(), 'App', 'is an app container');
  t.equal(wrapper.state('board').length, 64*64, 'array found');
});

test('Dumb React application', t => {
  t.plan(3);
  const wrapper = shallow(<App/>);
  t.equal(wrapper.name(), 'div', 'usin div container');
  t.assert(wrapper.find('#start').is('button'), 'found start button');
  t.equal(wrapper.find('button').length, 3, 'has three buttons');
});

const props = {
  board: [true, true, false, false],
  DIM: 2
}

test('Game Board', t => {
  t.plan(1);
  const wrapper = shallow(<Board {...props}/>);
  t.assert(wrapper.hasClass('gameBoard'), 'is the board');
});
