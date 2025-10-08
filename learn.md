# React Rules

## React 组件重新渲染的时机主要有以下几种

- 组件的 props 发生变化
  父组件传递给子组件的 props 更新时，子组件会重新渲染。

- 组件的 state 发生变化
  通过 useState、setState 等方式更新 state 时，组件会重新渲染。

- context 发生变化
  组件订阅的 context 值发生变化时，组件会重新渲染。

- 强制更新
  调用 forceUpdate（类组件）或某些特殊场景下，React 会强制重新渲染组件

## 自定义hook——custom hook

React的hook要求必须以use开头
所有hook只能在函数组件或其他hook中调用
