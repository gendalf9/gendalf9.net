---
slug: giscus_detail
title: Docusaurus에 giscus 적용해보기
authors: [gendalf9]
tags: [docusaurus, comment, github, giscus]
---
# Docusaurus에 giscus 적용해보기
## giscus란
[giscus](https://giscus.app/ko)는 [github의 discussion](https://docs.github.com/ko/discussions)이란 기능을 통해 댓글을 저장/관리하는 댓글 시스템입니다. 
<!--truncate-->

Docusaurus에 적용을 해보면
1. Docusaurus에 포스트 작성
2. 해당 포스트의 url을 기준으로 github discussion의 지정된 discussion 카테고리에 새 discussion 생성
3. 포스트에 덧글 작성 시 2에서 생성된 discussion에 덧글 작성되고 저장됨. 실제로 불러올 때도 해당 discussion에서 덧글을 가져옴.

의 형식으로 동작을 합니다.

이 글을 기준으로 보면 https://gendalf9.net/giscus_detail 이라는 url로 포스트가 되고, 제가 설정한 giscus의 옵션이 url 매칭이므로, 제가 지정한 [제 저장소의 discussion의 docusaurus 카테고리](https://github.com/gendalf9/gendalf9.net/discussions/categories/docusaurus)에서 `https://www.gendalf9.net/giscus_detail`이라는 제목의 discussion이 생기고 이제 이 포스트에 댓글 또는 reaction을 남기면 그 discussion에 같이 남게 됩니다.

## 설정하기 전에
Docusaurus 자체는 설정이 되었고 테마는 theme-classic을 사용하고 거기에 더해 docusaurus를 블로그 모드로 설정한 상태를 가정하겠습니다.

Docusaurus의 블로그 포스트에 덧글을 추가하려면 블로그 포스트 컴포넌트를 수정해야합니다. 다만, 이는 docusaurus에서 관리해주는 코드를 기반으로 동작하므로, 우리가 마음대로 소스코드를 수정을 해버리면 추후 docusaurus쪽에서 블로그 포스트 컴포넌트를 수정하게 된 경우 conflict가 발생한다거나 혹은 기능에 아예 이상이 생기는 경우가 있을 수 있습니다.

이런 경우 사용을 하는 방법이 바로 [스위즐링](https://docusaurus.io/ko/docs/next/swizzling)입니다.

### 스위즐링
스위즐링에 대한 자세한 설명은 위에 링크 건 공식 문서를 참고하시고, 여기서 저희는 `감싸기`를 사용할겁니다.

아래의 커맨드로 테마에서 BlogPostItem을 추출합니다.
```sh
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --wrap
```
다만 내부 컴포넌트다 보니 아래처럼 나중에 변경될 수도 있는데 정말 할거냐 라는 질문을 받게 됩니다. 그래도, 공식 문서에서도 안전하지 않은 컴포넌트를 스위즐하는 것을 너무 두려워하지 말라곤 했고, 기왕 코드로 블로그 관리를 하기로 한 거 과감하게 수행해봅시다.
```sh
[WARNING] 
Swizzle action wrap is unsafe to perform on BlogPostItem.
It is more likely to be affected by breaking changes in the future
If you want to swizzle it, use the `--danger` flag, or confirm that you understand the risks.

? Do you really want to swizzle this unsafe internal component? › - Use arrow-keys. Return to submit.
    NO: cancel and stay safe
❯   YES: I know what I am doing!
    [Exit]
```
여기서 키보드 화살표로 YES를 선택 후 엔터를 입력하면
```sh
[SUCCESS] 
Created wrapper of BlogPostItem from @docusaurus/theme-classic in 
- "/{MyLocalGithubRepositoryPath}/src/theme/BlogPostItem/index.js"
```

요렇게 `src/theme/BlogPostItem/index.js` 로 래퍼가 생성됩니다. 래퍼 파일의 내용은 아래와 같습니다.

```js title="src/theme/BlogPostItem/index.js"
import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';

export default function BlogPostItemWrapper(props) {
  return (
    <>
      <BlogPostItem {...props} />
    </>
  );
}
```
Docusaurus쪽을 손 댈 준비는 이거로 일단 끝입니다. 

아까 github의 discussion 기능을 이용한다고 했으므로 그걸 사용할 수 있게 설정해야 합니다. [github 공식 문서](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository)에 나와있지만, 저장소의 `Settings`에 가서 `Features` 사이의 `Discussion`에 체크가 되어있지 않으면 체크를 해주면 됩니다.

그리고 저장소에 `Discussions`가 생성된게 확인이 되면 새 category를 생성합니다. giscus에서는 관리자만 수정할 수 있게 Announcements 타입을 사용하길 권장합니다.

정말 정말 마지막으로, giscus는 public 저장소에서만 지원되므로 혹시 내 저장소가 private인 경우 public으로 변경해줘야 합니다. 어짜피 블로그 내용만 있고 해당 포스트는 원래 공개가 될 내용일테니 부담없이 public으로 변경해봅시다.

이제 시작할 준비는 끝났습니다.

## giscus 본격 설정
이제 giscus를 본격 설정해봅시다.

### giscus 앱 사용을 저장소에 설정
github apps의 [giscus](https://github.com/apps/giscus)에 방문해서 우측 상단의 install로 설치를 합니다. 모든 저장소에 하는거 보다는 블로그가 올라가는 저장소만 지정해서 권한을 부여합시다. 권한 부여항목에 보면 핵심적으로 필요한 discussion쪽의 read/write를 요청하고 있습니다.

### Docusaurus의 블로그 포스트에 giscus component 추가
아까 BlogPostItem의 Wrapper를 생성했었죠. 이제 거기에 giscus component를 추가해봅시다.

먼저 터미널에서 아래 명령어를 수행해서 giscus를 설치합니다.
```sh
npm i @giscus/react
```
그런 후 `src/components`에 `GiscusComponent`라는 경로를 생성 후 그 안에 `index.js | index.tsx` 파일을 작성합니다. 여기선 tsx를 기반으로 합니다.

```tsx title="src/components/GiscusComponent/index.tsx"
import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <Giscus    
      repo="{GithubUser}/{GithubRepository}"
      repoId="{GithubRepositoryId}"
      category="{GithubDiscussionCategory}"
      categoryId="{DiscussionCategoryId}"  // E.g. id of "General"
      mapping="url"                        // Important! To map comments to URL
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="ko"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}
```
갑자기 뭔가 옵션이 잔쯕 나옵니다. 위 옵션들은 제가 세팅한 값인데, 어떤 옵션이 어떤 역할을 하는지 잘 모르겠습니다. 

이럴 때 [giscus 홈페이지](https://giscus.app/ko)를 가보면 한국어로 잘 번역된 페이지가 우리를 맞이합니다. 여기에 보면 뭔가 선택해야 하는게 상당히 많죠. 이 UI에서 모든 설정을 하고 나면 아래쪽에 위 옵션값들같은게 설정된 스크립트가 출력되고 그걸 쓰면 됩니다. 제가 설정한 값들을 한줄 한줄 봅시다.

#### repo / category
당연하지만 블로그가 올라가고 giscus 앱이 설치된 저장소에 대한 지정이 필요합니다. 그리고 그 저장소에 설정되어있는 discussion의 카테고리도 지정을 해줘야 합니다. UI를 통하지 않고 직접 입력하셔도 상관은 없습니다.

#### repoId / categoryId
저장소와 카테고리를 분간하기 위해 Id값을 받습니다. 처음엔 이게 뭐지 해서 GraphQL도 날려보고 이거저거 찾아서 하긴 했지만, 그거랑 무관하게 giscus쪽에서 바로 Id를 찾아서 알려줍니다. giscus 홈페이지에 저장소/카테고리 지정만 해주면 아래쪽 스크립트 항목에 Id가 나오니 그걸 쓰면 됩니다.

#### mapping
Discussion 카테고리의 어떤 discussion에 어떤 포스트가 연결이 되어야 하는지 설정하는 방법입니다. 여러가지가 있는데, 경로 / URL / Title / 단어 / 번호 등이 있습니다. 만약 이게 두개 이상의 포스트가 동일하게 지정이 된다면 그 포스트들끼리는 덧글도 공유하게됩니다. 그래야 할 경우가 생길수도 있지 않을까 싶기도 하지만 정상적으로 동작을 하지 못할 것이 좀 뻔해보입니다. Unique가 보장될 만한 건 경로/URL 정도일 듯 하고 저는 URL로 했습니다. 단순히 경로로 하면 로컬에서 테스트한 내용이 배포한 내용과 공유가 될텐데 이는 선택에 맡깁니다.

숫자를 제외한 옵션들에서, repo와 category의 Id가 잘 설정된 경우 블로그 포스트에 덧글이 작성되면 거기에 해당하는 discussion이 없어도 자동으로 생성합니다. 즉, 포스트 하나 올릴 때 마다 지정한 항목으로 일일이 discussion을 생성해놓을 필요는 전혀 없습니다.
##### strict
자세한 내용은 [giscus의 공식 문서](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict)를 참고하시고, 요점은 비교하는 항목을 sha-1 hashing 해서 작성하고 비교합니다.

#### reactionsEnabled
`엄지척` 등의 반응을 남길 수 있게 할 지에 대한 여부입니다.

#### emitMetadata
Discussion의 메타데이터를 설치된 페이지로 전송합니다.

#### inputPosition
전 `top`로 설정했는데 이렇게 하지 않으면 덧글이 쌓이면 작성창이 계속 아래로 내려갑니다. 편한 덧글 작성을 위해서는 `top`을 사용하는게 좋지 않을까 합니다.

#### loading
giscus는 블로그 포스트에 접근을 하면 github에 붙어서 정보를 읽어옵니다. 그런데, 대부분의 블로그는 메인에 여러 포스트를 보여주게 설정이 되어있고 이는 docusaurus도 마찬가지인데, 그럴 경우 포스트 개수만큼 giscus가 로딩을 하다 보면 출력이 오래 걸릴 수 있습니다.

그럴 때 lazy로 세팅을 해놓으면, 브라우저 화면에 giscus가 노출 될 때 로딩을 하게 되니 로딩 속도를 줄일 수 있습니다. 단순히 여러 포스트 뿐 아니라 긴 글의 경우에도 적용됩니다. 덧글로 내려갔을 때 덧글을 바로 보지 않고 약간의 로딩을 요구하게 되지만, 그래도 메인화면에서 버벅이는거보단 나을 수도 있습니다.

### Wrapper에 추가
긴 작업도 거의 끝입니다. 아까 준비 과정에 만들었던 래퍼에 giscus 컴포넌트를 추가하게 되면 이제 docusaurus 블로그의 포스트에서 giscus를 이용한 덧글을 볼 수 있습니다.

`src/theme/BlogPostItem/index.js`로 갑니다.

`import GiscusComponent` 를 상단에 지정하고 `<GiscusComponent>`를 적합한 위치에 추가합니다. 대부분의 덧글은 블로그 포스트의 본문보다 아래에 있어야 하므로 최하단에 위치시킵니다.

```js title="src/theme/BlogPostItem/index.js"
import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import GiscusComponent from '@site/src/components/GiscusComponent';


export default function BlogPostItemWrapper(props) {
  return (
    <>
      <BlogPostItem {...props} />
      <GiscusComponent />
    </>
  );
}
```
이제 docusaurus 블로그에 덧글이 생겼습니다. 제법 그럴싸해졌으니 열심히 운영해봅시다.
