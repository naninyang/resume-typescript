import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import { ArrayContainer, ButtonGroup, Container, Content, DefinitionGroup, FieldGroup, FindUtil, FormGroup, ItemGroup, SessionUtil, Util } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';

export default function Education() {
  const { loggedIn } = useAuth();

  const [isAdding, setIsAdding] = useState<boolean | false>(false);

  const [education, setEducation] = useState({
    school: '',
    major: '',
    category: '',
    stats: '',
    degree: '',
    degree_num: '',
    record: '',
    start_date: '',
    end_date: '',
  });

  type Education = {
    id?: number;
    school: string;
    category: string;
    major: string;
    stats: string;
    degree: string;
    degree_num: string;
    record: string;
    start_date: string;
    end_date: string;
    [key: string]: any;
  };

  const [educations, setEducations] = useState<Education[]>([]);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/education`, { headers: { Authorization: `Bearer ${token}` } });
      setEducations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEducation({
      ...education,
      [name]: value
    });
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/education/`, education, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('학력 정보가 성공적으로 추가되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setIsAdding(false)
      fetchEducation();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (educationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/education/${educationId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.error('학력 정보가 성공적으로 삭제되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      fetchEducation();
    } catch (error) {
      console.error(error);
    }
  };

  type EducationType = {
    school: string;
    category: string;
    major: string;
    stats: string;
    degree: string;
    degree_num: string;
    record: string;
    start_date: string;
    end_date: string;
    [key: string]: any;
  }

  const [educationEdit, setFormData] = useState<EducationType>({ ...education });
  const [editingEducation, setEditingEducation] = useState<number | null>(null);

  const handleEditClick = (edu: EducationType) => {
    setEditingEducation(edu.id);
    setFormData(edu);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...educationEdit,
      [name]: value,
    });
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id = event.currentTarget.getAttribute('data-id');
      await axios.put(`/api/education/${id}`, educationEdit, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('학력 정보가 성공적으로 수정되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setEditingEducation(null);
      fetchEducation();
    } catch (error) {
      console.error('Failed to update education: ', error);
    }
  };


  const handleCancelClick = () => {
    setEditingEducation(null);
  }

  const pageTitle = '학력사항'

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
              <strong>입학/졸업일 상관없이 추가하시면 됩니다. 이력서에서는 자동으로 가장 오래된 학력 기준으로 보여집니다.</strong>
            </h1>
            <div className='data-group'>
              {educations.length > 0 ?
                <div className='list'>
                  {educations.map((edu) => (
                    <div key={edu.id} className='item'>
                      {editingEducation === edu.id ? (
                        <form onSubmit={handleEditSubmit} data-id={editingEducation}>
                          <fieldset>
                            <legend>{pageTitle} 갱신</legend>
                            <FormGroup>
                              <div>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="school"
                                    id={`school-${edu.id}`}
                                    value={educationEdit.school}
                                    onChange={handleEditChange}
                                    placeholder="학교명"
                                    required
                                  />
                                  <label htmlFor={`school-${edu.id}`}>학교명</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <select
                                    name="category"
                                    id={`category-${edu.id}`}
                                    value={educationEdit.category}
                                    onChange={handleEditChange}
                                    required
                                  >
                                    <option value='' hidden>분류 선택</option>
                                    <option value='초등학교'>초등학교</option>
                                    <option value='특성화 중학교'>특성화 중학교</option>
                                    <option value='일반계 고등학교'>일반계 고등학교</option>
                                    <option value='특성화 고등학교'>특성화 고등학교</option>
                                    <option value='특수목적 고등학교'>특수목적 고등학교</option>
                                    <option value='과학중점 고등학교'>과학중점 고등학교</option>
                                    <option value='자율형 고등학교'>자율형 고등학교</option>
                                    <option value='State School'>State School</option>
                                    <option value='Public School'>Public School</option>
                                    <option value='Secondary School'>Secondary School</option>
                                    <option value='Sixth Form Collage'>Sixth Form Collage</option>
                                    <option value='국제학교'>국제학교</option>
                                    <option value='전문대학'>전문대학</option>
                                    <option value='교육대학'>교육대학</option>
                                    <option value='기술대학'>기술대학</option>
                                    <option value='산업대학'>산업대학</option>
                                    <option value='원격대학'>원격대학</option>
                                    <option value='기능대학'>기능대학</option>
                                    <option value='특수대학'>특수대학</option>
                                    <option value='대학원'>대학원</option>
                                    <option value='대학교'>대학교</option>
                                    <option value='전문대학원'>전문대학원</option>
                                    <option value='특수대학원'>특수대학원</option>
                                    <option value='대학원대학'>대학원대학</option>
                                    <option value='평생교육'>평생교육</option>
                                    <option value='영재학교'>영재학교</option>
                                    <option value='외국인학교'>외국인학교</option>
                                    <option value='대안학교'>대안학교</option>
                                  </select>
                                  <label htmlFor={`category-${edu.id}`}>분류</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="major"
                                    id={`major-${edu.id}`}
                                    value={educationEdit.major}
                                    onChange={handleEditChange}
                                    placeholder="전공"
                                    required
                                  />
                                  <label htmlFor={`major-${edu.id}`}>전공</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="record"
                                    id={`record-${edu.id}`}
                                    value={educationEdit.record}
                                    onChange={handleEditChange}
                                    placeholder="학점"
                                  />
                                  <label htmlFor={`record-${edu.id}`}>학점</label>
                                </FieldGroup>
                              </div>
                              <div>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="degree"
                                    id={`degree-${edu.id}`}
                                    value={educationEdit.degree}
                                    onChange={handleEditChange}
                                    placeholder="학위명"
                                  />
                                  <label htmlFor={`degree-${edu.id}`}>학위명</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="degree_num"
                                    id={`degree_num-${edu.id}`}
                                    value={educationEdit.degree_num}
                                    onChange={handleEditChange}
                                    placeholder="학위등록번호"
                                  />
                                  <label htmlFor={`degree_num-${edu.id}`}>학위등록번호</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <select
                                    name="stats"
                                    id={`stats-${edu.id}`}
                                    value={educationEdit.stats}
                                    onChange={handleEditChange}
                                    required
                                  >
                                    <option value='' hidden>상태</option>
                                    <option value='졸업'>졸업</option>
                                    <option value='중퇴'>중퇴</option>
                                    <option value='재학 중'>재학 중</option>
                                  </select>
                                  <label htmlFor={`stats-${edu.id}`}>상태</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="month"
                                    name="start_date"
                                    id={`start_date-${edu.id}`}
                                    value={educationEdit.start_date}
                                    onChange={handleEditChange}
                                    placeholder="입학일"
                                    required
                                  />
                                  <label htmlFor={`start_date-${edu.id}`}>입학일</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="month"
                                    name="end_date"
                                    id={`end_date-${edu.id}`}
                                    value={educationEdit.end_date}
                                    onChange={handleEditChange}
                                    placeholder="졸업일"
                                  />
                                  <label htmlFor={`end_date-${edu.id}`}>졸업일</label>
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
                                <dt>학교명</dt>
                                <dd>
                                  <span>{edu.school}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>분류</dt>
                                <dd>
                                  <span>{edu.category}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>전공</dt>
                                <dd>
                                  <span>{edu.major}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>학점</dt>
                                <dd>
                                  <span>{edu.record}</span>
                                </dd>
                              </ItemGroup>
                            </div>
                            <div>
                              <ItemGroup>
                                <dt>학위명</dt>
                                <dd>
                                  <span>{edu.degree}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>학위등록번호</dt>
                                <dd>
                                  <span>{edu.degree_num}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>상태</dt>
                                <dd>
                                  <span>{edu.stats}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>입학일</dt>
                                <dd>
                                  <span>{edu.start_date}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>졸업일</dt>
                                <dd>
                                  <span>{edu.end_date}</span>
                                </dd>
                              </ItemGroup>
                            </div>
                          </DefinitionGroup>
                          <div className='item-management'>
                            <button type='button' className='edit' onClick={() => handleEditClick(edu)}>수정</button>
                            <button type='button' className='del' onClick={() => handleDelete(edu.id!)}>삭제</button>
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
                    setEducation({
                      school: '',
                      major: '',
                      category: '',
                      stats: '',
                      degree: '',
                      degree_num: '',
                      record: '',
                      start_date: '',
                      end_date: ''
                    })
                  }}>
                    {pageTitle} 추가
                  </button>
                </ButtonGroup>
              )}
              {isAdding && (
                <form onSubmit={handleAddSubmit}>
                  <fieldset>
                    <legend>{pageTitle} 추가</legend>
                    <FormGroup>
                      <div>
                        <FieldGroup>
                          <input
                            type="text"
                            name="school"
                            id='school'
                            value={education.school}
                            onChange={handleAddChange}
                            placeholder="학교명"
                            required
                          />
                          <label htmlFor='school'>학교명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <select
                            name="category"
                            id="category"
                            value={education.category}
                            onChange={handleAddChange}
                            placeholder="분류"
                            required
                          >
                            <option value='' disabled selected hidden>분류</option>
                            <option value='초등학교'>초등학교</option>
                            <option value='특성화 중학교'>특성화 중학교</option>
                            <option value='일반계 고등학교'>일반계 고등학교</option>
                            <option value='특성화 고등학교'>특성화 고등학교</option>
                            <option value='특수목적 고등학교'>특수목적 고등학교</option>
                            <option value='과학중점 고등학교'>과학중점 고등학교</option>
                            <option value='자율형 고등학교'>자율형 고등학교</option>
                            <option value='State School'>State School</option>
                            <option value='Public School'>Public School</option>
                            <option value='Secondary School'>Secondary School</option>
                            <option value='Sixth Form Collage'>Sixth Form Collage</option>
                            <option value='국제학교'>국제학교</option>
                            <option value='전문대학'>전문대학</option>
                            <option value='교육대학'>교육대학</option>
                            <option value='기술대학'>기술대학</option>
                            <option value='산업대학'>산업대학</option>
                            <option value='원격대학'>원격대학</option>
                            <option value='기능대학'>기능대학</option>
                            <option value='특수대학'>특수대학</option>
                            <option value='대학원'>대학원</option>
                            <option value='대학교'>대학교</option>
                            <option value='전문대학원'>전문대학원</option>
                            <option value='특수대학원'>특수대학원</option>
                            <option value='대학원대학'>대학원대학</option>
                            <option value='평생교육'>평생교육</option>
                            <option value='영재학교'>영재학교</option>
                            <option value='외국인학교'>외국인학교</option>
                            <option value='대안학교'>대안학교</option>
                          </select>
                          <label htmlFor='category'>분류</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="major"
                            id="major"
                            value={education.major}
                            onChange={handleAddChange}
                            placeholder="전공"
                            required
                          />
                          <label htmlFor='major'>전공</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="record"
                            id="record"
                            value={education.record}
                            onChange={handleAddChange}
                            placeholder="학점"
                          />
                          <label htmlFor='record'>학점</label>
                        </FieldGroup>
                      </div>
                      <div>
                        <FieldGroup>
                          <input
                            type="text"
                            name="degree"
                            id="degree"
                            value={education.degree}
                            onChange={handleAddChange}
                            placeholder="학위명"
                          />
                          <label htmlFor='degree'>학위명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="degree_num"
                            id="degree_num"
                            value={education.degree_num}
                            onChange={handleAddChange}
                            placeholder="학위등록번호"
                          />
                          <label htmlFor='degree_num'>학위등록번호</label>
                        </FieldGroup>
                        <FieldGroup>
                          <select
                            name="stats"
                            id="stats"
                            value={education.stats}
                            onChange={handleAddChange}
                            required
                          >
                            <option value='' hidden>상태</option>
                            <option value='졸업'>졸업</option>
                            <option value='중퇴'>중퇴</option>
                            <option value='재학 중'>재학 중</option>
                          </select>
                          <label htmlFor='stats'>상태</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="month"
                            name="start_date"
                            id="start_date"
                            value={education.start_date}
                            onChange={handleAddChange}
                            placeholder="입학일"
                            required
                          />
                          <label htmlFor='start_date'>입학일</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="month"
                            name="end_date"
                            id="end_date"
                            value={education.end_date}
                            onChange={handleAddChange}
                            placeholder="졸업일"
                          />
                          <label htmlFor='end_date'>졸업일</label>
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
