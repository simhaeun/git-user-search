﻿# git-user-search
 [![Netlify Status](https://api.netlify.com/api/v1/badges/8d83a72c-85fb-4894-aaf7-fa5022b0ab3a/deploy-status)](https://app.netlify.com/sites/hacookie-gituser-search/deploys)

React #61DAFB
Axios #5A29E4
React Router #CA4245
MUI #007FFF
Postman #FF6C37
Zustand 상태관리

- user list 가져오기
- 검색 기능
- 페이지네이션 처리
- user 상세 페이지
- 링크, 해당 글로 이동

<br />

## 유저 검색 API
### Github 토큰 생성 (https://docs.github.com/en/rest/repos/)
### PostMan - 토큰 정보 넣기
![image](https://user-images.githubusercontent.com/58839497/218303887-b4461980-8a1d-46d5-8602-1069e841efca.png)
### Zustand
React 상태 관리하는 라이브러리. 데이터를 저장하는 Store를 사용할 때는 `create`라는 method를 사용해서 선언한다.
```jsx
import axios from "axios";
import create from "zustand";

export const useGithubUsersStore = create((set) => ({
  users: [],
  totalCount: 0,
  loading: false,
  searchUsers: async (q, page) => {
    set({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${q}&per_page=20&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
      }
    );
    set({
      loading: false,
      users: res.data.items,
      totalCount: res.data.totalCount,
    });
  },
}));
```

<br />

## 유저 상세페이지
#### store 생성
```jsx
export const useGithubUserStore = create(set => ({
  user: {},
  loading: false,
  getUser: async (username) => {
    set({ loading: true });
    const res = await axios.get(`https://api.github.com/users/${username}`, {
      Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
    });
    set({
      loading: false,
      user: res.data,
    });
  },
}));
```
#### 유저의 Repository 가져오기
