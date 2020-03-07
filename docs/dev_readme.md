# AutoFocus Dev Readme

![CircleCI](https://img.shields.io/circleci/build/github/avidrucker/autofocus-exp/master) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/avidrucker/autofocus-exp) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/avidrucker/autofocus-exp/master)

## Tech

This app is written in the TypeScript language and is to be released as a (1) website, (2) a phone app, and (3) a command line, text-only app.

## Setup

To run this project locally, clone this repo then install using npm:

```shell
$ cd ../a-directory-of-your-chosing
$ npm install
$ npm run-script build
$ npm run-script run
```

Tests can be run via `npm test`. There are some convenience scripts as well -  run `npm run-script` to see in the terminal (or see the `package.json`).

## Contributing

- Install & run the app to get a feel for how it works
- Submit pull requests on [open dev issues](https://github.com/avidrucker/autofocus-exp/issues?utf8=✓&q=is%3Aopen+is%3Aissue+milestone%3Amvp-demo+label%3Adevelopment+)
- :bulb: ​Submit **new** suggestions for improvement (there is currently [an open issue for this](https://github.com/avidrucker/autofocus-exp/issues/176))
- Ask questions as new issues

## Successful Pull Requests How-To

- Pick an issue, create a new branch with the naming convention: `issue-789-short-title-like-this` (yours could be `issue-173-fix-spelling-mistakes`, for example)
- Commit often, using [conventional commits](#)
- Once your code runs **without any linting errors** & you have written **appropriate unit tests** (code coverage checks pending) for the code you have written, push to a remote branch with the same name as your local branch (eg. "`issue-173-fix-spelling-mistakes`")