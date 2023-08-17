import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import { ArrayContainer, ButtonGroup, Container, Content, DefinitionGroup, FieldGroup, FindUtil, FormGroup, ItemGroup, SessionUtil, Util } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';

export default function Language() {
  const { loggedIn } = useAuth();

  const [isAdding, setIsAdding] = useState<boolean | false>(false);

  const [language, setLanguage] = useState({
    lang_name: '',
    exam_name: '',
    point: 0,
  });

  type Language = {
    id?: number;
    lang_name: string;
    exam_name: string;
    point: number;
    [key: string]: any;
  };

  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    fetchLanguage();
  }, []);

  const fetchLanguage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/language`, { headers: { Authorization: `Bearer ${token}` } });
      setLanguages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setLanguage({
      ...language,
      [name]: name === 'point' ? parseFloat(value) : value
    });
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/language/`, language, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('외국어능력 정보가 성공적으로 추가되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setIsAdding(false)
      fetchLanguage();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (languageId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/language/${languageId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.error('외국어능력 정보가 성공적으로 삭제되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      fetchLanguage();
    } catch (error) {
      console.error(error);
    }
  };

  type LanguageType = {
    lang_name: string;
    exam_name: string;
    point: number;
    [key: string]: any;
  };

  const [languageEdit, setFormData] = useState<LanguageType>({ ...language });
  const [editingLanguage, setEditingLanguage] = useState<number | null>(null);

  const handleEditClick = (lan: LanguageType) => {
    setEditingLanguage(lan.id);
    setFormData(lan);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...languageEdit,
      [name]: name === 'point' ? parseFloat(value) : value
    });
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id = event.currentTarget.getAttribute('data-id');
      await axios.put(`/api/language/${id}`, languageEdit, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('외국어능력 정보가 성공적으로 수정되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setEditingLanguage(null);
      fetchLanguage();
    } catch (error) {
      console.error('Failed to update language: ', error);
    }
  };

  const handleCancelClick = () => {
    setEditingLanguage(null);
  }

  const pageTitle = '외국어능력'

  return (
    <Container>
      <Content>
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
              <strong>점수 상관없이 추가하시면 됩니다. 이력서에서는 자동으로 점수 기준 내림차순으로 보여집니다. (동일한 경우 외국어명 오름차순 기준)</strong>
            </h1>
            <div className='data-group'>
              {languages.length > 0 ?
                <div className='list'>
                  {languages.map((lan) => (
                    <div key={lan.id} className='item'>
                      {editingLanguage === lan.id ? (
                        <form onSubmit={handleEditSubmit} data-id={editingLanguage}>
                          <fieldset>
                            <legend>{pageTitle} 갱신</legend>
                            <FormGroup>
                              <div>
                                <FieldGroup>
                                  <select
                                    name="lang_name"
                                    id={`lang_name-${lan.id}`}
                                    value={languageEdit.lang_name}
                                    onChange={handleEditChange}
                                    required
                                  >
                                    <option value='' hidden>외국어명</option>
                                    <option value='영어'>영어</option>
                                    <option value='중국어'>중국어</option>
                                    <option value='일본어'>일본어</option>
                                    <option value='프랑스어'>프랑스어</option>
                                    <option value='독일어'>독일어</option>
                                    <option value='네덜란드어'>네덜란드어</option>
                                    <option value='스페인어'>스페인어</option>
                                    <option value='포르투칼어'>포르투칼어</option>
                                    <option value='이탈리아어'>이탈리아어</option>
                                    <option value='스웨덴어'>스웨덴어</option>
                                    <option value='다국어'>다국어</option>
                                  </select>
                                  <label htmlFor={`lang_name-${lan.id}`}>외국어명</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <select
                                    name="exam_name"
                                    id={`exam_name-${lan.id}`}
                                    value={languageEdit.exam_name}
                                    onChange={handleEditChange}
                                    required
                                  >
                                    <option value='' hidden>시험명</option>
                                    <optgroup label="영어">
                                      <option> G-TELP</option>
                                      <option value='IELTS'>IELTS</option>
                                      <option value='MATE'>MATE</option>
                                      <option value='STEP'>STEP</option>
                                      <option value='TEPS'>TEPS</option>
                                      <option value='TOEFL'>TOEFL</option>
                                      <option value='TOEIC'>TOEIC</option>
                                      <option value='TOSEL'>TOSEL</option>
                                    </optgroup>
                                    <optgroup label='중국어'>
                                      <option value='BCT'>BCT</option>
                                      <option value='HSK'>HSK</option>
                                      <option value='TOCFL'>TOCFL</option>
                                      <option value='TSC'>TSC</option>
                                    </optgroup>
                                    <optgroup label='일본어'>
                                      <option value='BJT'>BJT</option>
                                      <option value='EJU'>EJU</option>
                                      <option value='JLPT'>JLPT</option>
                                      <option value='JPT'>JPT</option>
                                    </optgroup>
                                    <optgroup label='프랑스어'>
                                      <option value='DALF'>DALF</option>
                                      <option value='DELF'>DELF</option>
                                      <option value='TFI'>TFI</option>
                                    </optgroup>
                                    <optgroup label='독일어'>
                                      <option value='GZD'>GZD</option>
                                      <option value='KMK'>KMK</option>
                                    </optgroup>
                                    <optgroup label='네덜란드어'>
                                      <option value='CNaVT'>CNaVT</option>
                                    </optgroup>
                                    <optgroup label='스페인어'>
                                      <option value='DELE'>DELE</option>
                                      <option value='SLELE'>SLELE</option>
                                    </optgroup>
                                    <optgroup label='포르투칼어'>
                                      <option value='CAPLE'>CAPLE</option>
                                      <option value='CELPE-Bras'>CELPE-Bras</option>
                                    </optgroup>
                                    <optgroup label='이탈리아어'>
                                      <option value='CELI'>CELI</option>
                                      <option value='CILS'>CILS</option>
                                      <option value='PLIDA'>PLIDA</option>
                                    </optgroup>
                                    <optgroup label='스웨덴어'>
                                      <option value='TISUS'>TISUS</option>
                                    </optgroup>
                                    <optgroup label='다국어'>
                                      <option value='FLEX'>FLEX</option>
                                      <option value='OPIc'>OPIc</option>
                                      <option value='SNULT'>SNULT</option>
                                      <option value='TELC'>TELC</option>
                                    </optgroup>
                                  </select>
                                  <label htmlFor={`exam_name-${lan.id}`}>시험명</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="number"
                                    name="point"
                                    id={`point-${lan.id}`}
                                    value={languageEdit.point}
                                    onChange={handleEditChange}
                                    placeholder="점수"
                                    required
                                  />
                                  <label htmlFor={`point-${lan.id}`}>점수</label>
                                </FieldGroup>
                              </div>
                            </FormGroup>
                            <ButtonGroup>
                              <button type="submit">{pageTitle} 갱신</button>
                              <Util>
                                <SessionUtil />
                                <FindUtil>
                                  <button type='button' onClick={handleCancelClick}>취소하기</button>
                                </FindUtil>
                              </Util>
                            </ButtonGroup>
                          </fieldset>
                        </form>
                      ) : (
                        <div className='view'>
                          <DefinitionGroup>
                            <div>
                              <ItemGroup>
                                <dt>외국어명</dt>
                                <dd>
                                  <span>{lan.lang_name}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>시험명</dt>
                                <dd>
                                  <span>{lan.exam_name}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>점수</dt>
                                <dd>
                                  <span>{lan.point}</span>
                                </dd>
                              </ItemGroup>
                            </div>
                          </DefinitionGroup>
                          <div className='item-management'>
                            <button type='button' className='edit' onClick={() => handleEditClick(lan)}>수정</button>
                            <button type='button' className='del' onClick={() => handleDelete(lan.id!)}>삭제</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div> : <p className='no-data'>등록된 {pageTitle}이 없습니다</p>
              }
              {!isAdding && (
                <ButtonGroup>
                  <button type='button' onClick={() => {
                    setIsAdding(true);
                    setLanguage({
                      lang_name: '',
                      exam_name: '',
                      point: 0,
                    })
                  }}>
                    {pageTitle} 추가
                  </button>
                </ButtonGroup>
              )}
              {isAdding && (
                <form onSubmit={handleAddSubmit}>
                  <fieldset>
                    <legend>{pageTitle} 갱신</legend>
                    <FormGroup>
                      <div>
                        <FieldGroup>
                          <select
                            name="lang_name"
                            id='lang_name'
                            value={language.lang_name}
                            onChange={handleAddChange}
                            placeholder="외국어명"
                            required
                          >
                            <option value='' hidden>외국어명</option>
                            <option value='영어'>영어</option>
                            <option value='중국어'>중국어</option>
                            <option value='일본어'>일본어</option>
                            <option value='프랑스어'>프랑스어</option>
                            <option value='독일어'>독일어</option>
                            <option value='네덜란드어'>네덜란드어</option>
                            <option value='스페인어'>스페인어</option>
                            <option value='포르투칼어'>포르투칼어</option>
                            <option value='이탈리아어'>이탈리아어</option>
                            <option value='스웨덴어'>스웨덴어</option>
                            <option value='다국어'>다국어</option>
                          </select>
                          <label htmlFor='lang_name'>외국어명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <select
                            name="exam_name"
                            id="exam_name"
                            value={language.exam_name}
                            onChange={handleAddChange}
                            placeholder="시험명"
                            required
                          >
                            <option value='' hidden>시험명</option>
                            <optgroup label="영어">
                              <option> G-TELP</option>
                              <option value='IELTS'>IELTS</option>
                              <option value='MATE'>MATE</option>
                              <option value='STEP'>STEP</option>
                              <option value='TEPS'>TEPS</option>
                              <option value='TOEFL'>TOEFL</option>
                              <option value='TOEIC'>TOEIC</option>
                              <option value='TOSEL'>TOSEL</option>
                            </optgroup>
                            <optgroup label='중국어'>
                              <option value='BCT'>BCT</option>
                              <option value='HSK'>HSK</option>
                              <option value='TOCFL'>TOCFL</option>
                              <option value='TSC'>TSC</option>
                            </optgroup>
                            <optgroup label='일본어'>
                              <option value='BJT'>BJT</option>
                              <option value='EJU'>EJU</option>
                              <option value='JLPT'>JLPT</option>
                              <option value='JPT'>JPT</option>
                            </optgroup>
                            <optgroup label='프랑스어'>
                              <option value='DALF'>DALF</option>
                              <option value='DELF'>DELF</option>
                              <option value='TFI'>TFI</option>
                            </optgroup>
                            <optgroup label='독일어'>
                              <option value='GZD'>GZD</option>
                              <option value='KMK'>KMK</option>
                            </optgroup>
                            <optgroup label='네덜란드어'>
                              <option value='CNaVT'>CNaVT</option>
                            </optgroup>
                            <optgroup label='스페인어'>
                              <option value='DELE'>DELE</option>
                              <option value='SLELE'>SLELE</option>
                            </optgroup>
                            <optgroup label='포르투칼어'>
                              <option value='CAPLE'>CAPLE</option>
                              <option value='CELPE-Bras'>CELPE-Bras</option>
                            </optgroup>
                            <optgroup label='이탈리아어'>
                              <option value='CELI'>CELI</option>
                              <option value='CILS'>CILS</option>
                              <option value='PLIDA'>PLIDA</option>
                            </optgroup>
                            <optgroup label='스웨덴어'>
                              <option value='TISUS'>TISUS</option>
                            </optgroup>
                            <optgroup label='다국어'>
                              <option value='FLEX'>FLEX</option>
                              <option value='OPIc'>OPIc</option>
                              <option value='SNULT'>SNULT</option>
                              <option value='TELC'>TELC</option>
                            </optgroup>
                          </select>
                          <label htmlFor='exam_name'>시험명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="number"
                            name="point"
                            id="point"
                            value={language.point}
                            onChange={handleAddChange}
                            placeholder="점수"
                            required
                          />
                          <label htmlFor='point'>점수</label>
                        </FieldGroup>
                      </div>
                    </FormGroup>
                    <ButtonGroup>
                      <button type="submit">{pageTitle} 추가</button>
                      <Util>
                        <SessionUtil />
                        <FindUtil>
                          <button type='button' onClick={() => { setIsAdding(false) }}>취소하기</button>
                        </FindUtil>
                      </Util>
                    </ButtonGroup>
                  </fieldset>
                </form>
              )}
            </div>
          </ArrayContainer>
        )}
      </Content>
    </Container>
  );
}
