import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import { ArrayContainer, ButtonGroup, Container, Content, DefinitionGroup, FieldGroup, FindUtil, FormGroup, ItemGroup, SessionUtil, Util } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';

export default function Activity() {
  const { loggedIn } = useAuth();

  const [isAdding, setIsAdding] = useState<boolean | false>(false);

  const [activity, setActivity] = useState({
    organization: '',
    position: '',
    description: '',
    classification: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
  });

  type Activity = {
    id?: number;
    organization: string;
    position: string;
    description: string;
    classification: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    [key: string]: any;
  };

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/activity`, { headers: { Authorization: `Bearer ${token}` } });
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setActivity({
      ...activity,
      [name]: value
    });
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/activity/`, activity, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('대외활동 정보가 성공적으로 추가되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      fetchActivity();
      setIsAdding(false)
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (activityId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/activity/${activityId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.error('대외활동 정보가 성공적으로 삭제되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      fetchActivity();
    } catch (error) {
      console.error(error);
    }
  };

  type ActivityType = {
    organization: string;
    position: string;
    description: string;
    classification: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    [key: string]: any;
  };

  const [activityEdit, setFormData] = useState<ActivityType>({ ...activity });
  const [editingActivity, setEditingActivity] = useState(null);

  const handleEditClick = (act: ActivityType) => {
    setEditingActivity(act.id);
    setFormData(act);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...activityEdit,
      [name]: value,
    });
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id = event.currentTarget.getAttribute('data-id');
      await axios.put(`/api/activity/${id}`, activityEdit, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('대외활동 정보가 성공적으로 수정되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setEditingActivity(null);
      fetchActivity();
    } catch (error) {
      console.error('Failed to update activity: ', error);
    }
  };

  const handleCancelClick = () => {
    setEditingActivity(null);
  }

  const pageTitle = '대외활동'

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
              <strong>시작일시 상관없이 추가하시면 됩니다. 이력서에서는 자동으로 가장 최근 활동 기준으로 보여집니다.</strong>
            </h1>
            <div className='data-group'>
              {activities.length > 0 ?
                <div className='list'>
                  {activities.map((act) => (
                    <div key={act.id} className='item'>
                      {editingActivity === act.id ? (
                        <form onSubmit={handleEditSubmit} data-id={editingActivity}>
                          <fieldset>
                            <legend>{pageTitle} 갱신</legend>
                            <FormGroup>
                              <div>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="organization"
                                    id={`organization-${act.id}`}
                                    value={activityEdit.organization}
                                    onChange={handleEditChange}
                                    placeholder="기관명"
                                    required
                                  />
                                  <label htmlFor={`organization-${act.id}`}>기관명</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="position"
                                    id={`position-${act.id}`}
                                    value={activityEdit.position}
                                    onChange={handleEditChange}
                                    placeholder="직책/담당업무"
                                    required
                                  />
                                  <label htmlFor={`position-${act.id}`}>직책/담당업무</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="description"
                                    id={`description-${act.id}`}
                                    value={activityEdit.description}
                                    onChange={handleEditChange}
                                    placeholder="활동내용"
                                    required
                                  />
                                  <label htmlFor={`description-${act.id}`}>활동내용</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="classification"
                                    id={`classification-${act.id}`}
                                    value={activityEdit.classification}
                                    onChange={handleEditChange}
                                    placeholder="활동구분"
                                    required
                                  />
                                  <label htmlFor={`classification-${act.id}`}>활동구분</label>
                                </FieldGroup>
                              </div>
                              <div>
                                <FieldGroup>
                                  <input
                                    type="date"
                                    name="start_date"
                                    id={`start_date-${act.id}`}
                                    value={activityEdit.start_date}
                                    onChange={handleEditChange}
                                    placeholder="시작일시"
                                    required
                                  />
                                  <label htmlFor={`start_date-${act.id}`}>시작일시</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="time"
                                    name="start_time"
                                    id={`start_time-${act.id}`}
                                    value={activityEdit.start_time}
                                    onChange={handleEditChange}
                                    placeholder="시작시간"
                                  />
                                  <label htmlFor={`start_time-${act.id}`}>시작시간</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="date"
                                    name="end_date"
                                    id={`end_date-${act.id}`}
                                    value={activityEdit.end_date}
                                    onChange={handleEditChange}
                                    placeholder="종료일시"
                                  />
                                  <label htmlFor={`end_date-${act.id}`}>종료일시</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="time"
                                    name="end_time"
                                    id={`end_time-${act.id}`}
                                    value={activityEdit.end_time}
                                    onChange={handleEditChange}
                                    placeholder="종료시간"
                                  />
                                  <label htmlFor={`end_time-${act.id}`}>종료시간</label>
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
                                <dt>기관명</dt>
                                <dd>
                                  <span>{act.organization}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>직책/담당업무</dt>
                                <dd>
                                  <span>{act.position}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>활동내용</dt>
                                <dd>
                                  <span>{act.description}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>활동구분</dt>
                                <dd>
                                  <span>{act.classification}</span>
                                </dd>
                              </ItemGroup>
                            </div>
                            <div>
                              <ItemGroup>
                                <dt>시작일시</dt>
                                <dd>
                                  <span>{act.start_date}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>시작시간</dt>
                                <dd>
                                  <span>{act.start_time}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>종료일시</dt>
                                <dd>
                                  <span>{act.end_date}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>종료시간</dt>
                                <dd>
                                  <span>{act.end_time}</span>
                                </dd>
                              </ItemGroup>
                            </div>
                          </DefinitionGroup>
                          <div className='item-management'>
                            <button type='button' className='edit' onClick={() => handleEditClick(act)}>수정</button>
                            <button type='button' className='del' onClick={() => handleDelete(act.id!)}>삭제</button>
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
                    setActivity({
                      organization: '',
                      position: '',
                      description: '',
                      classification: '',
                      start_date: '',
                      start_time: '',
                      end_date: '',
                      end_time: '',
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
                          <input
                            type="text"
                            name="organization"
                            id="organization"
                            value={activity.organization}
                            onChange={handleAddChange}
                            placeholder="기관명"
                            required
                          />
                          <label htmlFor="organization">기관명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="position"
                            id="position"
                            value={activity.position}
                            onChange={handleAddChange}
                            placeholder="직책/담당업무"
                            required
                          />
                          <label htmlFor="position">직책/담당업무</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="description"
                            id="description"
                            value={activity.description}
                            onChange={handleAddChange}
                            placeholder="활동내용"
                            required
                          />
                          <label htmlFor="description">활동내용</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="classification"
                            id="classification"
                            value={activity.classification}
                            onChange={handleAddChange}
                            placeholder="활동구분"
                            required
                          />
                          <label htmlFor="classification">활동구분</label>
                        </FieldGroup>
                      </div>
                      <div>
                        <FieldGroup>
                          <input
                            type="date"
                            name="start_date"
                            id="start_date"
                            value={activity.start_date}
                            onChange={handleAddChange}
                            placeholder="시작일시"
                            required
                          />
                          <label htmlFor="start_date">시작일시</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="time"
                            name="start_time"
                            id="start_time"
                            value={activity.start_time}
                            onChange={handleAddChange}
                            placeholder="시작시간"
                          />
                          <label htmlFor="start_time">시작시간</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="date"
                            name="end_date"
                            id="end_date"
                            value={activity.end_date}
                            onChange={handleAddChange}
                            placeholder="종료일시"
                          />
                          <label htmlFor="end_date">종료일시</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="time"
                            name="end_time"
                            id="end_time"
                            value={activity.end_time}
                            onChange={handleAddChange}
                            placeholder="종료시간"
                          />
                          <label htmlFor="end_time">종료시간</label>
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
