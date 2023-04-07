# Notion EIP-712

Creates a form, signs it with EIP-712 and saves it to a Notion page.

Workflow: UI Form => sign it with EIP-712 => POST request to NextJS endpoint => Save it to Notion

## Contents

- [Requirements](#requirements)
- [Quickstart](#Quickstart)
- [Deploying your NextJS App](#Deploying-your-NextJS-App)
- [Disabling Type & Linting Error Checks](#Disabling-type-and-linting-error-checks)
  * [Disabling commit checks](#Disabling-commit-checks)
  * [Deploying to Vercel without any checks](#Deploying-to-Vercel-without-any-checks)
  * [Disabling Github Workflow](#Disabling-Github-Workflow)

## Requirements

Before you begin, you need to install the following tools:
- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-Eth 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/carletex/notion-eip712.git
cd notion-eip712
yarn install
```

2. Start your NextJS app:

```
yarn start
```
Visit your app on: `http://localhost:3000`.

- Edit your form / front-end in `packages/nextjs/pages/index.tsx`

## Deploying your NextJS App

Run `yarn vercel` and follow the steps to deploy to Vercel. Once you log in (email, github, etc), the default options should work. It'll give you a public URL.

If you want to redeploy to the same production URL you can run `yarn vercel --prod`. If you omit the `--prod` flag it will deploy it to a preview/test URL.

**Hint**: We recommend connecting the project GitHub repo to Vercel so you the gets automatically deployed when pushing to `main`

## Disabling type and linting error checks
> **Hint**
> Typescript helps you catch errors at compile time, which can save time and improve code quality, but can be challenging for those who are new to the language or who are used to the more dynamic nature of JavaScript. Below are the steps to disable type & lint check at different levels

### Disabling commit checks
We run `pre-commit` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) which lints the staged files and don't let you commit if there is an linting error.

To disable this, go to `.husky/pre-commit` file and comment out `yarn lint-staged --verbose`

```diff
- yarn lint-staged --verbose
+ # yarn lint-staged --verbose
```

### Deploying to Vercel without any checks
Vercel by default runs types and lint checks while developing `build` and deployment fails if there is a types or lint error.

To ignore types and lint error checks while deploying, use :
```shell
yarn vercel:yolo
```

### Disabling Github Workflow
We have github workflow setup checkout `.github/workflows/lint.yaml` which runs types and lint error checks every time code is __pushed__ to `main` branch or __pull request__ is made to `main` branch

To disable it, **delete `.github` directory**