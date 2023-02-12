import { Avatar, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React, { useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGithubUserStore } from '../store/githubUser'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function UserInfo() {
    const {
        user: {
            avatar_url,
            name,
            html_url,
            company,
            blog,
            location: locationInfo,
            email,
            hireable,
            bio,
            public_repos,
            public_gists,
            followers,
            following,
            created_at,
            updated_at
        },
        loading,
        getUser
    } = useGithubUserStore()

    const { username } = useParams()

    useEffect(() => {
        getUser(username)
    }, [username, getUser])

    const location = useLocation()
    const navigate = useNavigate()

    const onClickNavigateToList = useCallback(() => {
        if (!location.state) navigate('/')
        else {
            navigate({
                pathname: '/',
                search: !!location.state?.previous
                    ? `?q=${location.state?.q}$page=${location.state?.previous}`
                    : `?q=${location.state?.q}`
            })
        }
    },[location.state, navigate])

    if (loading) {
        return <CircularProgress sx={{ margin: '200px auto 0' }} />
    } else {
        return (
            <>
                <Button
                    style={{ margin: '10px' }}
                    onClick={onClickNavigateToList}
                    startIcon={<ArrowBackIosNewIcon />}
                >
                    Github User List로 돌아가기
                </Button>
                <Card variant='outlined' style={{ margin: '10px' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar alt={name} src={avatar_url} sx={{ width: '200px', height: '200px', margin: 'auto' }} />
                        <Typography variant='h4' sx={{ marginBottom: '50px' }}>{name}</Typography>
                        <Button variant='contained' href={html_url} sx={{ marginBottom: '30px' }}>Github Page</Button>
                        {bio ? <Typography variant='subtitle1'>자기소개: {bio}</Typography> : null}
                        {company ? <Typography variant='subtitle1'>company: {company}</Typography> : null}
                        {blog ? <Typography variant='subtitle1'>blog: <Link href={blog}></Link></Typography> : null}
                        {locationInfo ? <Typography variant='subtitle1'>위치: {locationInfo}</Typography> : null}
                        {email ? <Typography variant='subtitle1'>email: {email}</Typography> : null}
                        <Typography variant='subtitle1'>고용가능 여부: {hireable ? '예' : '아니오'}</Typography>
                        <Typography variant='subtitle1'>public repository 개수: {public_repos}</Typography>
                        <Typography variant='subtitle1'>public gist 개수: {public_gists}</Typography>
                        <Typography variant='subtitle1'>followers: {followers}</Typography>
                        <Typography variant='subtitle1'>following: {following}</Typography>
                        <Typography variant='subtitle1'>Github 생성일: {dayjs(created_at).format('YYYY.MM.DD h:mm A')}</Typography>
                        <Typography variant='subtitle1'>최근 업데이트 시간: {dayjs(updated_at).format('YYYY.MM.DD h:mm A')}</Typography>
                    </CardContent>
                </Card>
            </>
        )
    }
}

export default UserInfo