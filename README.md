# git-user-search
 [![Netlify Status](https://api.netlify.com/api/v1/badges/8d83a72c-85fb-4894-aaf7-fa5022b0ab3a/deploy-status)](https://app.netlify.com/sites/hacookie-gituser-search/deploys)
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/React Router-CA4245?style=flat-square&logo=ReactRouter&logoColor=white"/> <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=Axios&logoColor=white"/> <img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=Postman&logoColor=white"/> <img src="https://img.shields.io/badge/Zustand-5B4638?style=flat-square&logo=Zustand&logoColor=white"/> <img src="https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=MUI&logoColor=white"/>

![image](https://user-images.githubusercontent.com/58839497/218304300-32f6b4b6-1161-4db9-9fbf-9cd1ce345de4.png)

<br />

## user 검색 API
#### Github 토큰 생성 (https://docs.github.com/en/rest/repos/)
#### PostMan - 토큰 정보 넣기
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
#### 검색 기능
```jsx
function SearchInput() {
  const [text, setText] = useState('')
  const [searchParams, setSearchParams] = useSearchParams({})

  const onSubmit = useCallback(() => {
    if (text === '') return;
    setSearchParams({q: text}) 
  }, [text,setSearchParams])

  const onChange = useCallback(e => {setText(e.target.value)}, [])

  const onKeyUp = useCallback(e => {
    if (e.key !== 'Enter') return;
    onSubmit() 
  }, [onSubmit])

  // searchParams가 바뀔 때 마다 실행
  useEffect(() => {
    const query = searchParams.get('q') 
    if (!query) return;
    setText(query)
  }, [searchParams])
```
#### User List 가져오기
```jsx
import { useGithubUsersStore } from '../store/githubUsers'

function UserGird() {
  const [searchParams, setSearchParams] = useSearchParams({})
  const {users, totalCount, loading, searchUsers} = useGithubUsersStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const query = searchParams.get('q')
    const page = searchParams.get('page') ?? 1;
    if(!query) return;
    searchUsers(query, page)
  }, [searchParams, searchUsers])

  const totalPageCount = useMemo(() => { 
    const pageCount = Math.ceil(totalCount/20)
    return pageCount > 50 ? 50 : pageCount
  }, [totalCount])
```
#### 페이지네이션
```jsx
const totalPageCount = useMemo(() => { 
  const pageCount = Math.ceil(totalCount/20)
  return pageCount > 50 ? 50 : pageCount
}, [totalCount])

const handleChangePage = useCallback((e, number) => {
  setSearchParams({q: searchParams.get('q'), page: number})
}, [searchParams, setSearchParams])

// 새로운 검색어 입력 -> 1페이지로 이동
useEffect(() => {
  const page = searchParams.get('page') ?? 1;
  setCurrentPage(parseInt(page))
}, [searchParams]
```
#### Loading

<br />

## user 상세페이지
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
#### 뒤로가기
```jsx
const onClickNavigateToList = useCallback(() => {
  if (!location.state) navigate('/') // 메인으로 이동
  else {
    navigate({
      pathname: '/',
      search: !!location.state?.previous
        ? `?q=${location.state?.q}$page=${location.state?.previous}`
        : `?q=${location.state?.q}`
    })
	 }
}, [location.state, navigate])
```
검색어와, previous 참고해서 뒤로가기 버튼을 구현<br/>
만약 url로만 입력해서 유저 상세페이지에 접근한다면 검색어와 페이지수를 찾지 못한다 → 메인 페이지 이동

#### 유저의 Repository 가져오기
```jsx
import axios from 'axios'
import create from 'zustand'
export const useGithubReposStore = create(set => ({
  repos: [],
  loading: false,
  isEnd: false,
  getRepos: async (username, page) => {
    set( {loading: true })
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=30&page=${page}`, {
      headers: { Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`, }
    })
    set(state => ({
      loading: false,
      repos: [...state.repos, ...res.data],
      isEnd: res.data.length === 0
    }))
  },
  resetRepos: () => {
    set({
      loading: false,
      repos: [],
      isEnd: false
    })
  }
}))
```
