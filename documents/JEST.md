## ts-jest document
- [typescript with react native](https://facebook.github.io/react-native/blog/2018/05/07/using-typescript-with-react-native)
 - [ts-jest config](https://kulshekhar.github.io/ts-jest/user/react-native/#jest-config)
- [QA helper](https://segmentfault.com/a/1190000020387433)

`Errors`
* `Jest: Preset 'react-native' not found` - Jest upgrade to latest version


## Environment configration
- `package.json` dependencies
```javascript
    "@types/jest": "^24.0.23",
    "@types/react": "^16.9.13",
    "@types/react-native": "^0.60.23",
    "@types/react-test-renderer": "^16.9.1",
    "babel-jest": "^24.8.0",
    "babel-preset-react-native": "^5.0.1",
    "enzyme": "^3.10.0",
    "enzyme-adapter-react-16": "^1.14.0",
    "jest": "^24.8.0",
    "jest-junit": "^7.0.0",
    "jest-react-native": "^18.0.0",
    "react-addons-test-utils": "^15.6.2",
    "react-dom": "16.8.3",
    "react-native-typescript-transformer": "^1.2.13",
    "react-test-renderer": "16.8.3",
    "ts-jest": "^24.2.0",
    "typescript": "^3.7.2"
```

- `jest.config.js` - with `ts-jest`
- `rn-cli.config.js` - with typescript
- `babel.config.js` - with typescript