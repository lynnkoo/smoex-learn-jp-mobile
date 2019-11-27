
## Quick links
- [Shark](./documents/SHARKSDK.md)
- [Jest](./documents/JEST.md)
- [Jest Coverage](./coverage/index.html)

## Usage

### Quick Start

```sh
# pre-requirements
npm install

# Launch Ctrip App (port 5389)
npm run ios

# Launch Trip App (port 5388)
npm run ios:trip

```
### Locally Development
1) `npm run start` or `npm run start:trip` - to start server
2) `npm run watch:ts` - to just-in-time compilation  typescript

### Locally Commands
* `npm run lint` - eslint check (standards by airbnb and skyscanner)
* `npm run lint:fix` - automatic fix eslint errors
* `npm run test` - run jest unit test    
* `npm run test:fix` - run jest unit test and update local snapshot cache

## Coding Standard

* `Package structure`
```sh
 --- rn_car_app
 ------ src
 --------- Index.tsx
 --------- Index.test.tsx
 --------- Components
 ------ package.json
```

* `src` - all lowercase
* `src/*` - *`folder`* - camel rules and capitalization of the initial letter 
* `src/*` - *`file`* - camel rules and capitalization of the initial letter 
* `*.test.*` - the test file should be at the same level as the master file

## Fork by Skycanner Hercules
- [hercules](http://git.dev.sh.ctripcorp.com/carosd/hercules)    

## Design Review
- [Design Review And Q&A](http://conf.ctripcorp.com/display/CAR/App-Three-In-One+Design+Review)    
