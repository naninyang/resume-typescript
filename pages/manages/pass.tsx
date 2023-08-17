import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import Confirm from '@/components/features/confirm';
import useConfirm from '@/components/hooks/useConfirm';
import { useAuth } from '@/components/hooks/authContext';
import LinkButton from '@/components/hooks/linkButton';
import { ButtonGroup, Container, Content, FieldGroup, FindUtil, SessionUtil, Util } from '@/styles/manageSystem';
import IsSession from './isSession';

export default function SignIn() {
  const router = useRouter();

  const { loggedIn, login } = useAuth();

  const { isOpen, handleOpen, handleClose } = useConfirm();

  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');

  const handleUseridChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserid(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response: { data: any } = await axios.post('/api/signin', { userid, password });
      const result = response.data;

      if (result.status === 'success') {
        login(result.token as string, result.user);

        router.push('./profile');
        toast.success('로그인에 성공했습니다.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      }
    } catch (error) {
      handleOpen();
    }
  };

  return (
    <Container>
      <Content>
        {loggedIn ? (
          <IsSession />
        ) : (
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>로그인 양식</legend>
              <FieldGroup>
                <input
                  type="text"
                  value={userid}
                  id='userid'
                  placeholder='아이디'
                  onChange={handleUseridChange}
                  required
                />
                <label htmlFor='userid'>아이디</label>
              </FieldGroup>
              <FieldGroup>
                <input
                  type="password"
                  value={password}
                  id='password'
                  placeholder='비밀번호'
                  onChange={handlePasswordChange}
                  required
                />
                <label htmlFor='password'>비밀번호</label>
              </FieldGroup>
              <ButtonGroup>
                <button type="submit">로그인하기</button>
                <Util>
                  <SessionUtil />
                  <FindUtil>
                    <LinkButton href='/manages/find-id'>아이디 찾기</LinkButton>
                    <LinkButton href='/manages/find-password'>비밀번호 찾기</LinkButton>
                  </FindUtil>
                </Util>
              </ButtonGroup>
              <Confirm
                isOpen={isOpen}
                title='로그인 실패'
                onClose={handleClose}
                message='계정이 없거나 ID/비밀번호가 잘못되었습니다'
              />
            </fieldset>
          </form>
        )}
      </Content>
    </Container>
  );
}
