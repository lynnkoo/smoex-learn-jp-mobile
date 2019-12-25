/*
 Copyright 2017 Skyscanner
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

module.exports = {
  env: {
    jest: true,
    es6: true,
  },
  parser: "babel-eslint",
  extends: ["airbnb"],
  plugins: ["react", "typescript", "react-hooks"],
  rules: {
    "import/no-extraneous-dependencies": [0],
    "valid-jsdoc": ["error"],
    "max-len": ["error", {
      "code": 100,
      "ignoreRegExpLiterals": true,
      "ignoreUrls": true
    }],
    "import/no-unresolved": "warn",

    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],

    // Disabled whilst incompatibilities still exist with react/jsx-closing-tag-location, react/jsx-indent & max-len.
    // See https://github.com/airbnb/javascript/issues/1584#issuecomment-335667272
    "function-paren-newline": 0,

    // Disabled whilst false positives still exist with custom propTypes + isRequired.
    // See https://github.com/yannickcr/eslint-plugin-react/issues/1389
    "react/no-typos": 0,

    // Added "to" as a specialLink property, which prevents react-router"s
    // "Link" component from triggering this rule.
    // See https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/339
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["to"],
      "aspects": ["noHref", "invalidHref", "preferButton"],
    }],
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/extensions": [0],
    "react/destructuring-assignment": 1,
    "no-nested-ternary": [0]
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
};
