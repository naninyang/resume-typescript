import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { useAuth } from '@/components/hooks/authContext'
import { ButtonGroup, Container, Content, DefinitionGroup, ItemGroup, ManagementContainer } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';
import LinkButton from '@/components/hooks/linkButton';

export default function Profile() {
  const { loggedIn } = useAuth();

  type UserProfileType = {
    username: string;
    username_show: boolean;
    email: string;
    email_show: boolean;
    address: string;
    telephone: string;
    veteran: string;
    disability: string;
  };

  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/profile`, { headers: { Authorization: `Bearer ${token}` } });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const pageTitle = '인적사항'

  return (
    <Container>
      <Content>
        {!loggedIn ? (
          <IsNotSession />
        ) : (
          <ManagementContainer>
            <Head>
              <title>레주메 {pageTitle}</title>
            </Head>
            <h1>{pageTitle}</h1>
            <DefinitionGroup className='profile-definition'>
              <ItemGroup>
                <dt>이름</dt>
                <dd>
                  <span>{userProfile?.username}</span>
                  <p>{userProfile?.username_show ? '이력서에 이름이 공개됩니다' : '이력서에 이름이 공개되지 않습니다'}</p>
                </dd>
              </ItemGroup>
              <ItemGroup>
                <dt>이메일</dt>
                <dd>
                  <span>{userProfile?.email}</span>
                  <p>{userProfile?.email_show ? '이력서 이메일 주소가 공개됩니다' : '이력서에 이메일 주소가 공개되지 않습니다'}</p>
                </dd>
              </ItemGroup>
              <ItemGroup>
                <dt>주소</dt>
                <dd>
                  <span>{userProfile?.address ? userProfile.address : '주소를 입력하지 않았습니다'}</span>
                  {userProfile?.address && <p>이력서에 공개하고 싶지 않으면 주소를 비워두세요</p>}
                </dd>
              </ItemGroup>
              <ItemGroup>
                <dt>연락처</dt>
                <dd>
                  <span>{userProfile?.telephone ? userProfile.telephone : '연락처를 입력하지 않았습니다'}</span>
                  {userProfile?.telephone && <p>이력서에 공개하고 싶지 않으면 연락처를 비워두세요</p>}
                </dd>
              </ItemGroup>
              <ItemGroup>
                <dt>보훈대상</dt>
                <dd>
                  <span>{userProfile?.veteran ? userProfile.veteran : '보훈대상 여부를 입력하지 않았습니다'}</span>
                  {userProfile?.veteran && <p>이력서에 공개하고 싶지 않거나 보훈대상자가 아니라면 비워두세요</p>}
                </dd>
              </ItemGroup>
              <ItemGroup>
                <dt>장애대상</dt>
                <dd>
                  <span>{userProfile?.disability ? userProfile.disability : '장애대상 여부를 입력하지 않았습니다'}</span>
                  <p>{userProfile?.disability && '이력서에 공개하고 싶지 않거나 비장애인이라면 비워두세요'}</p>
                </dd>
              </ItemGroup>
            </DefinitionGroup>
            <ButtonGroup>
              <LinkButton href='/manages/profile-edit'>{pageTitle} 업데이트하러 가기</LinkButton>
            </ButtonGroup>
          </ManagementContainer>
        )}
      </Content>
    </Container>
  );
}
