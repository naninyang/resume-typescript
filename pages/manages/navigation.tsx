import { useRouter } from 'next/router'
import { Rem, hex, rgba } from '@/styles/designSystem'
import styled from '@emotion/styled'
import { Nav } from '@/styles/manageSystem'
import { useAuth } from '@/components/hooks/authContext'
import LinkButton from '@/components/hooks/linkButton'

type LiParentProps = {
  currentRouter?: boolean;
};

const LiParent = styled.li<LiParentProps>(({ currentRouter }) => ({
  '& > a': {
    fontWeight: currentRouter ? '700' : undefined,
    color: currentRouter ? hex.light : `rgba(${rgba.light70})`,
  },
  '& ol': {
    display: currentRouter ? 'flex!important' : undefined,
  },
}));

type LiChildProps = {
  currentRouter?: boolean;
};

const LiChild = styled.li<LiChildProps>(({ currentRouter }) => ({
  '& a': {
    borderRadius: currentRouter ? Rem(52) : undefined,
    backgroundColor: currentRouter ? hex.mint : undefined,
    fontWeight: currentRouter ? '700' : undefined,
    color: `${hex.dark}!important`,
  },
}))

export default function Navigation() {
  const router = useRouter();
  const { loggedIn, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push('/');
  }

  return (
    <Nav>
      <ol>
        {loggedIn ? (
          <>
            <LiParent currentRouter={
              router.pathname === '/manages/profile' ||
                router.pathname === '/manages/profile-edit' ? true : false
            }>
              <LinkButton href='/manages/profile'>프로필</LinkButton>
              <ol>
                <LiChild currentRouter={router.pathname === '/manages/profile' ? true : false}>
                  <LinkButton href='/manages/profile'>프로필 보기</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/profile-edit' ? true : false}>
                  <LinkButton href='/manages/profile-edit'>인적사항 수정</LinkButton>
                </LiChild>
              </ol>
            </LiParent>
            <LiParent currentRouter={
              router.pathname === '/manages/military-service' ||
                router.pathname === '/manages/education' ? true : false
            }>
              <LinkButton href='/manages/military-service'>기본사항</LinkButton>
              <ol>
                <LiChild currentRouter={router.pathname === '/manages/military-service' ? true : false}>
                  <LinkButton href='/manages/military-service'>병역사항</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/education' ? true : false}>
                  <LinkButton href='/manages/education'>학력사항</LinkButton>
                </LiChild>
              </ol>
            </LiParent>
            <LiParent currentRouter={
              router.pathname === '/manages/certificate' ||
                router.pathname === '/manages/language' ||
                router.pathname === '/manages/award' ||
                router.pathname === '/manages/skill' ? true : false
            }>
              <LinkButton href='/manages/certificate'>능력사항</LinkButton>
              <ol>
                <LiChild currentRouter={router.pathname === '/manages/certificate' ? true : false}>
                  <LinkButton href='/manages/certificate'>자격증</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/language' ? true : false}>
                  <LinkButton href='/manages/language'>외국어능력</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/award' ? true : false}>
                  <LinkButton href='/manages/award'>수상기록</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/skill' ? true : false}>
                  <LinkButton href='/manages/skill'>보유기술</LinkButton>
                </LiChild>
              </ol>
            </LiParent>
            <LiParent currentRouter={
              router.pathname === '/manages/activity' ||
                router.pathname === '/manages/career' ? true : false
            }>
              <LinkButton href='/manages/activity'>활동사항</LinkButton>
              <ol>
                <LiChild currentRouter={router.pathname === '/manages/activity' ? true : false}>
                  <LinkButton href='/manages/activity'>대외활동</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/career' ? true : false}>
                  <LinkButton href='/manages/career'>경력사항</LinkButton>
                </LiChild>
              </ol>
            </LiParent>
            <LiParent currentRouter={
              router.pathname === '/manages/reference' ||
                router.pathname === '/manages/essay' ? true : false
            }>
              <LinkButton href='/manages/reference'>추가정보</LinkButton>
              <ol>
                <LiChild currentRouter={router.pathname === '/manages/reference' ? true : false}>
                  <LinkButton href='/manages/reference'>소셜미디어/홈페이지</LinkButton>
                </LiChild>
                <LiChild currentRouter={router.pathname === '/manages/essay' ? true : false}>
                  <LinkButton href='/manages/essay'>자기소개서</LinkButton>
                </LiChild>
              </ol>
            </LiParent>
            <li><LinkButton href='/'>이력서보기</LinkButton></li>
            <li><button type='button' onClick={handleSignOut}>로그아웃</button></li>
          </>
        ) : (
          <li><p>로그인 필요</p></li>
        )}
      </ol>
    </Nav>
  )
}
