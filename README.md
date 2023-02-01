# react-list-shuffle

Lightweight, easy to use component for animated shuffling and change order in lists

[React list shuffle.webm](https://user-images.githubusercontent.com/12416010/213731815-287dee79-1242-4c40-afe9-a52ada72cef2.webm)

## Installation
```shell
# with npm
npm install react-list-shuffle
```
```shell
# with yarn
yarn add react-list-shuffle
```

## Basic usage
```js
import ListShuffle from 'react-list-shuffle';

const anyListItemsArray = [0, 1, 2, 3, 4, 5];
```

```js
  <ListShuffle shuffle={ shuffleKey } duration={ 2 } restoreOrder={ restoreOrderKey }>
    { anyListItemsArray.map((item: number) => <div key={ item }>
      ITEM { item }
    </div>)}
  </ListShuffle>
```

## Props
| NAME          | TYPE    | DEFAULT              | DESCRIPTION              |
|---------------|---------|----------------------|--------------------------|
| id            | String  | listWrapper          | Component id             |
| duration      | Number  | 1                    | Animation duration (sec) |
| shuffle       | String, Number, Boolean | Date.now() | Change this prop for calling shuffling |
| shuffleOnInit | Boolean | false                | If true, shuffles list on first init|
| restoreOrder  | String, Number, Boolean | Date.now() | Change this prop for restoring initial list order |
|shuffledHandler | (args: number[]) => any | undefined | Optionally callback firing after shuffling animation. Receives  array with list items indexes on new positions. |
