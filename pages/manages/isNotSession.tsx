import styled from '@emotion/styled';
import { Rem, hex } from '@/styles/designSystem';
import Head from 'next/head';

const Container = styled.div({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: Rem(100),
  '& p': {
    fontSize: Rem(24),
    fontWeight: '700',
    color: hex.light,
  },
})

export default function IsNotSession() {
  return (
    <Container>
      <Head>
        <title>레주메</title>
      </Head>
      <p>로그인 필요</p>
    </Container>
  )
}
