import styled from '@emotion/styled';
import { Rem, hex } from '@/styles/designSystem';

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

export default function IsSession() {
  return (
    <Container>
      <p>로그인 중</p>
    </Container>
  )
}
