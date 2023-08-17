import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useAuth } from '@/components/hooks/authContext'
import { ArrayContainer, ButtonGroup, Container, Content, FieldGroup, FormGroup } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';
import { Rem, hex, mixin, rgba } from '@/styles/designSystem';

const AvatarImage = styled.div({
  backgroundColor: `rgba(${rgba.light20})`,
  border: `${Rem(2)} dashed ${hex.light}`,
  borderRadius: Rem(5),
  padding: '20px',
  textAlign: 'center',
  color: hex.light,
  cursor: 'pointer',
})

const AvatarPreview = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: Rem(15),
  padding: Rem(25),
  borderRadius: Rem(5),
  backgroundColor: hex.light,
  color: hex.dark,
  '& strong': {
    fontWeight: '700',
  },
  '& img': {
    ...mixin.imageRendering,
    objectFit: 'cover',
  },
  '& p': {
    fontWeight: '700',
    color: hex.danger,
    textAlign: 'center',
  },
})

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
    lineHeight: 1.5,
    color: hex.light,
  },
})

type Essay = {
  id?: number;
  avatar_path: string;
  avatar_name: string;
  avatar_type: string;
  eng_name: string;
  eng_occupation: string;
  title: string;
  bio: string;
  show: boolean;
};

const Essay: React.FC = () => {
  const { loggedIn } = useAuth();

  const [essay, setEssay] = useState<Essay>({
    avatar_path: '',
    avatar_name: '',
    avatar_type: '',
    eng_name: '',
    eng_occupation: '',
    title: '',
    bio: '',
    show: false,
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEssay(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('/api/essay/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setEssay(prev => ({
        ...prev,
        avatar_path: response.data.avatar_path,
        avatar_name: response.data.avatar_name,
        avatar_type: response.data.avatar_type,
      }));
    } catch (error) {
      console.error('Error uploading the file', error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpe', '.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      if (essay.id) {
        await axios.put(`/api/essay/${essay.id}`, essay, { headers });
      } else {
        await axios.post('/api/essay', essay, { headers });
      }
    } catch (error) {
      console.error('Error saving the essay', error);
    }
  };

  const [essayData, setEssayData] = useState<Essay | null>(null);

  useEffect(() => {
    async function fetchEssayData() {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('/api/essay/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          setEssay(response.data);
          setAvatarPreview(response.data.avatar_path || '');
        }

      } catch (error) {
        console.error("Error fetching essay data:", error);
      }
    }

    fetchEssayData();
  }, []);

  const pageTitle = '자기소개서'

  return (
    <Container>
      <Content className='essay'>
        {!loggedIn ? (
          <IsNotSession />
        ) : (
          <ArrayContainer>
            <Head>
              <title>레주메 {pageTitle}</title>
            </Head>
            <h1>
              {pageTitle}
              {' '}
              <strong>내용은 마크다운을 지원합니다. 부제목은 ##### 사용하세요.</strong>
            </h1>
            <div className='data-group'>
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <legend>{pageTitle} 갱신</legend>
                  <AvatarImage {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>사진 이미지를 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.</p>
                  </AvatarImage>
                  {avatarPreview && (
                    <AvatarPreview>
                      <strong>사진 미리보기</strong>
                      <Image src={avatarPreview} alt="사진 미리보기" width='100' height='100' />
                      <p>미리보기에서는 100 by 100으로 보여드립니다.<br />이미지 비율은 정방형을 추천합니다.</p>
                    </AvatarPreview>
                  )}
                  <FormGroup>
                    <div>
                      <FieldGroup>
                        <input
                          type="text"
                          name="eng_name"
                          value={essay.eng_name}
                          onChange={handleChange}
                          placeholder="영문 이름"
                          required
                        />
                        <label htmlFor="eng_name">영문 이름</label>
                        <p>영문 이름을 넣어주세요</p>
                      </FieldGroup>
                      <FieldGroup>
                        <input
                          type='text'
                          name='eng_occupation'
                          id='eng_occupation'
                          placeholder='영문 직업'
                          value={essay.eng_occupation}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="eng_occupation">영문 직업</label>
                        <p>직업명을 영문으로 넣어주세요 (e.g. Frontend Developer)</p>
                      </FieldGroup>
                    </div>
                    <div>
                      <FieldGroup>
                        <input
                          type='text'
                          name='title'
                          id='title'
                          placeholder='자기소개서 제목'
                          value={essay.title}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="title">자기소개서 제목</label>
                        <p>자신을 나타내는 표현을 짧게 입력하세요</p>
                      </FieldGroup>
                    </div>
                    <div>
                      <FieldGroup className='content-editable'>
                        <TextareaAutosize
                          name='bio'
                          id='bio'
                          placeholder='자기소개서 내용'
                          value={essay.bio}
                          onChange={handleChange}
                          minRows={3}
                          required
                        />
                        <label htmlFor="bio">자기소개서 내용</label>
                        <p>부제목 예제: ##### 블라블라</p>
                      </FieldGroup>
                    </div>
                  </FormGroup>
                  <CheckboxGroup>
                    <div>
                      <input
                        type="checkbox"
                        name='show'
                        id='show'
                        checked={essay.show}
                        onChange={(e) => setEssay(prev => ({
                          ...prev,
                          show: e.target.checked
                        }))}
                      />
                      <label htmlFor='show'>공개여부</label>
                    </div>
                  </CheckboxGroup>
                  <ButtonGroup>
                    <button type="submit">{pageTitle} 갱신</button>
                  </ButtonGroup>
                </fieldset>
              </form>
            </div>
          </ArrayContainer>
        )}
      </Content>
    </Container>
  );
}

export default Essay;
