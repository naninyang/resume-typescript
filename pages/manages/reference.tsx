import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import { ButtonGroup, Container, Content, FieldGroup, FormGroup, ManagementContainer } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';

export default function Reference() {
  const { loggedIn } = useAuth();

  const [github, setGithub] = useState('');
  const [velog, setVelog] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [leadme, setLeadme] = useState('');
  const [brunch, setBrunch] = useState('');
  const [tistory, setTistory] = useState('');
  const [pinterest, setPinterest] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [dribble, setDribble] = useState('');
  const [postype, setPostype] = useState('');
  const [blog, setBlog] = useState('');
  const [homepage, setHomepage] = useState('');

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    try {
      const response = await axios.get('/api/reference');
      const references = response.data;
      if (references.length > 0) {
        setGithub(references[0].github);
        setVelog(references[0].velog);
        setInstagram(references[0].instagram);
        setTwitter(references[0].twitter);
        setFacebook(references[0].facebook);
        setLeadme(references[0].leadme);
        setBrunch(references[0].brunch);
        setTistory(references[0].tistory);
        setPinterest(references[0].pinterest);
        setLinkedin(references[0].linkedin);
        setDribble(references[0].dribble);
        setPostype(references[0].postype);
        setBlog(references[0].blog);
        setHomepage(references[0].homepage);
      }
    } catch (error) {
      console.error('Failed to fetch references:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (github === '' && blog === '') {
      toast.error('최소 한개 이상의 항목을 입력하셔야 합니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/reference', {
          github, velog, instagram, twitter, facebook, leadme, brunch,
          tistory, pinterest, linkedin, dribble, postype, blog, homepage
        }, { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 200) {
          toast.success('레퍼런스 갱신에 성공했습니다', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        } else {
          toast.error('레퍼런스 갱신에 실패했습니다', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error('Failed to create reference:', error);
      }
    }
  };

  const pageTitle = '레퍼런스 갱신'

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
                <legend>레퍼런스 수정 양식</legend>
                <FormGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='github'
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="Github"
                    />
                    <label htmlFor='github'>Github</label>
                    <p>Gibhub 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='velog'
                      value={velog}
                      onChange={(e) => setVelog(e.target.value)}
                      placeholder="Velog"
                    />
                    <label htmlFor='velog'>Velog</label>
                    <p>Velog 계정 이름만 입력하세요 (@ 제외)</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='instagram'
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram"
                    />
                    <label htmlFor='instagram'>Instagram</label>
                    <p>instagram 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='twitter'
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="Twitter"
                    />
                    <label htmlFor='twitter'>Twitter</label>
                    <p>Twitter(X) 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='facebook'
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Facebook"
                    />
                    <label htmlFor='facebook'>Facebook</label>
                    <p>Facebook 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='leadme'
                      value={leadme}
                      onChange={(e) => setLeadme(e.target.value)}
                      placeholder="LeadMe"
                    />
                    <label htmlFor='leadme'>LeadMe</label>
                    <p>LeadMe 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='brunch'
                      value={brunch}
                      onChange={(e) => setBrunch(e.target.value)}
                      placeholder="Brunch"
                    />
                    <label htmlFor='brunch'>Brunch</label>
                    <p>Brunch 계정 이름만 입력하세요 (@ 제외)</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='tistory'
                      value={tistory}
                      onChange={(e) => setTistory(e.target.value)}
                      placeholder="Tistory"
                    />
                    <label htmlFor='tistory'>Tistory</label>
                    <p>Tistory 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='pinterest'
                      value={pinterest}
                      onChange={(e) => setPinterest(e.target.value)}
                      placeholder="Pinterest"
                    />
                    <label htmlFor='pinterest'>Pinterest</label>
                    <p>Pinterest 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='linkedin'
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn"
                    />
                    <label htmlFor='linkedin'>LinkedIn</label>
                    <p>LinkedIn 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='dribble'
                      value={dribble}
                      onChange={(e) => setDribble(e.target.value)}
                      placeholder="Dribble"
                    />
                    <label htmlFor='dribble'>Dribble</label>
                    <p>Dribble 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="text"
                      id='postype'
                      value={postype}
                      onChange={(e) => setPostype(e.target.value)}
                      placeholder="Postype"
                    />
                    <label htmlFor='postype'>Postype</label>
                    <p>Postype 계정 이름만 입력하세요</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="url"
                      id='blog'
                      value={blog}
                      onChange={(e) => setBlog(e.target.value)}
                      placeholder="blog"
                    />
                    <label htmlFor='blog'>블로그</label>
                    <p>블로그 주소 전체를 입력하세요 (https:// 포함할것)</p>
                  </FieldGroup>
                  <FieldGroup>
                    <input
                      type="url"
                      id='homepage'
                      value={homepage}
                      onChange={(e) => setHomepage(e.target.value)}
                      placeholder="homepage"
                    />
                    <label htmlFor='homepage'>홈페이지</label>
                    <p>홈페이지 주소 전체를 입력하세요 (https:// 포함할것)</p>
                  </FieldGroup>
                </FormGroup>
                <ButtonGroup>
                  <button type='submit'>{pageTitle}</button>
                </ButtonGroup>
              </fieldset>
            </form>
          </ManagementContainer>
        )}
      </Content>
    </Container>
  );
}
