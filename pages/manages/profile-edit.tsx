import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { useAuth } from '@/components/hooks/authContext'
import useConfirm from '@/components/hooks/useConfirm';
import { ButtonGroup, Container, Content, FieldGroup, FormGroup, ManagementContainer } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';
import Confirm from '@/components/features/confirm';
import { Rem, hex } from '@/styles/designSystem';

const CheckboxGroup = styled.div({
  paddingBottom: Rem(25),
  display: 'flex',
  gap: Rem(15),
  '& div': {
    display: 'flex',
    gap: Rem(5),
    alignItems: 'center',
  },
  '& input': {
    appearance: 'none',
    margin: 0,
    border: `${Rem(1)} solid ${hex.light}`,
    borderRadius: Rem(5),
    width: Rem(16),
    height: Rem(16),
    '&:checked': {
      borderColor: hex.mint,
      background: `${hex.mint} url('data:image/svg+xml,%3Csvg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20.293 5.29297L9 16.5859L4.70703 12.293L3.29297 13.707L9 19.4141L21.707 6.70703L20.293 5.29297Z" fill="%23171717"/%3E%3C/svg%3E%0A') no-repeat 50% 50%/contain`,
    },
  },
  '& label': {
    fontSize: Rem(16),
    lineHeight: 1,
    color: hex.light,
  },
})

export default function Profile() {
  const router = useRouter();
  const { loggedIn } = useAuth();
  const { isOpen, handleOpen, handleClose } = useConfirm();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [veteran, setVeteran] = useState('');
  const [disability, setDisability] = useState('');
  const [usernameShow, setUsernameShow] = useState(false);
  const [emailShow, setEmailShow] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { username, email, address, telephone, veteran, disability, username_show, email_show } = response.data;
      setUsername(username || '');
      setEmail(email || '');
      setAddress(address || '');
      setTelephone(telephone || '');
      setVeteran(veteran || '');
      setDisability(disability || '');
      setUsernameShow(username_show || false);
      setEmailShow(email_show || false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/profile`,
        {
          username,
          email,
          address,
          telephone,
          veteran,
          disability,
          username_show: usernameShow,
          email_show: emailShow,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get(`/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success('프로필 업데이트에 성공했습니다.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
        router.push('/manages/profile');
      } else {
        toast.error('프로필 업데이트에 실패했습니다', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      }
    } catch (error) {
      handleOpen();
      console.error('Failed to update profile:', error);
    }
  };

  const pageTitle = '인적사항 업데이트'

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
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>{pageTitle} 양식</legend>
                <FormGroup className='form-group single-group'>
                  <FieldGroup>
                    <input
                      type="text"
                      id='username'
                      placeholder='이름'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <label htmlFor='username'>이름</label>
                    <CheckboxGroup>
                      <div>
                        <input
                          type="checkbox"
                          name='username_show'
                          id='username_show'
                          checked={usernameShow}
                          onChange={() => setUsernameShow(!usernameShow)}
                        />
                        <label htmlFor='username_show'>이력서에 이름 공개</label>
                      </div>
                    </CheckboxGroup>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="email"
                      id='username'
                      placeholder='이메일'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor='username'>이메일</label>
                    <CheckboxGroup>
                      <div>
                        <input
                          type="checkbox"
                          name='email_show'
                          id='email_show'
                          checked={emailShow}
                          onChange={() => setEmailShow(!emailShow)}
                        />
                        <label htmlFor='email_show'>이력서에 이메일 공개</label>
                      </div>
                    </CheckboxGroup>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='address'
                      placeholder='주소'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <label htmlFor='address'>주소</label>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="tel"
                      id='telephone'
                      placeholder='연락처'
                      value={telephone}
                      pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                      onChange={(e) => setTelephone(e.target.value)}
                    />
                    <label htmlFor='telephone'>연락처</label>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='veteran'
                      placeholder='보훈대상'
                      value={veteran}
                      onChange={(e) => setVeteran(e.target.value)}
                    />
                    <label htmlFor='veteran'>보훈대상</label>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='disability'
                      placeholder='장애대상'
                      value={disability}
                      onChange={(e) => setDisability(e.target.value)}
                    />
                    <label htmlFor='disability'>장애대상</label>
                  </FieldGroup>
                </FormGroup>
                <ButtonGroup>
                  <button type='submit'>{pageTitle}</button>
                </ButtonGroup>
                <Confirm
                  isOpen={isOpen}
                  title='업데이트 실패'
                  onClose={handleClose}
                  message='필드를 확인하세요'
                />
              </fieldset>
            </form>
          </ManagementContainer>
        )}
      </Content>
    </Container>
  );
}
