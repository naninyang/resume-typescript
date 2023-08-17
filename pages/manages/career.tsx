import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import { ArrayContainer, ButtonGroup, Container, Content, DefinitionGroup, FieldGroup, FindUtil, FormGroup, ItemGroup, SessionUtil, Util } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';

interface Career {
  id: number;
  org_name: string;
  team: string;
  start_date: string;
  end_date?: string;
  occupation: string;
  role: string;
  description?: string;
  projects: Project[];
  [key: string]: any;
}

interface Project {
  id?: number;
  project_name: string;
  start_date: string;
  end_date: string;
  description?: string;
  [key: string]: any;
}

interface EditingValueCareer {
  id?: number;
  org_name: string;
  team: string;
  role: string;
  occupation: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

interface EditingValueProject {
  project_name: string;
  start_date: string;
  end_date: string;
  description?: string;
}

export default function Career() {
  const { loggedIn } = useAuth();

  const [careers, setCareers] = useState<Career[]>([]);

  const [isAdding, setIsAdding] = useState<boolean | false>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get<Career[]>('/api/career', { headers: { Authorization: `Bearer ${token}` } }).then(response => {
      const loadedCareers = response.data;
      Promise
        .all(
          loadedCareers.map(career =>
            axios.get(`/api/career/${career.id}/project`)
          )
        ).then(projectResponses => {
          const mergedCareers = loadedCareers.map((career, index) => ({
            ...career,
            projects: projectResponses[index].data
          }));
          setCareers(mergedCareers);
        });
    });
  }, []);

  const fetchCareers = async () => {
    const token = localStorage.getItem('token');
    await axios.get<Career[]>('/api/career', { headers: { Authorization: `Bearer ${token}` } }).then(response => {
      const loadedCareers = response.data;
      Promise.all(
        loadedCareers.map(career =>
          axios.get(`/api/career/${career.id}/project`)
        )
      ).then(projectResponses => {
        const mergedCareers = loadedCareers.map((career, index) => ({
          ...career,
          projects: projectResponses[index].data
        }));
        setCareers(mergedCareers);
      });
    })
  };

  const [editingCareer, setEditingCareer] = useState<Career | null>(null);

  const [editingValueCareer, setEditingValueCareer] = useState<EditingValueCareer>({
    org_name: '',
    team: '',
    role: '',
    occupation: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  const handleCareerChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditingValueCareer({
      ...editingValueCareer,
      [event.target.name]: event.target.value,
    });
  };

  const [editCareers, setEditCareers] = useState<{ [key: number]: Career }>({});

  useEffect(() => {
    const initialEditCareers = careers
      .filter(career => career.id !== null)
      .reduce<{ [key: number]: Career }>((acc, career) => {
        acc[career.id] = career;
        return acc;
      }, {} as { [key: number]: Career });
    setEditCareers(initialEditCareers);
  }, [careers]);

  const handleCareerEditChange = (id: number) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setEditCareers((prevEditCareers) => ({
        ...prevEditCareers,
        [id]: {
          ...prevEditCareers[id],
          [name]: value,
        },
      }));
    };

  const handleEditCareerSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    career: Career,
    careerForEdit: EditingValueCareer
  ) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/career/${career.id}`, careerForEdit, { headers: { Authorization: `Bearer ${token}` } });
      console.log('careerForEdit: ', careerForEdit)
      setIsAdding(false);
      fetchCareers();
      toast.success('경력 정보가 성공적으로 갱신되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Failed to update career', error);
    }
  };

  const initialEditingValueCareer: EditingValueCareer = {
    org_name: '',
    team: '',
    role: '',
    occupation: '',
    start_date: '',
    end_date: '',
    description: '',
  };

  const handleAddCareerSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    career: EditingValueCareer
  ) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/career/`, editingValueCareer, { headers: { Authorization: `Bearer ${token}` } });
      setIsAdding(false);
      setEditingValueCareer(initialEditingValueCareer);
      fetchCareers();
      toast.success('경력 정보가 성공적으로 추가되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Failed to create career', error);
    }
  };

  const handleDeleteCareer = async (careerId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/career/${careerId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCareers();
      toast.error('경력 정보가 성공적으로 삭제되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Failed to delete career', error);
    }
  };

  const [activeAddFormCareerId, setActiveAddFormCareerId] = useState<number | null>(null);
  const [activeAddFormProjectId, setActiveAddFormProjectId] = useState<string | null>(null);

  const handleEditProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    careerId: number,
    projectId: number,
    updatedData: EditingValueProject,
  ) => {
    event.preventDefault();
    axios.patch(`/api/career/${careerId}/project/${projectId}`, updatedData)
      .then(response => {
        setCareers(prev => prev.map(career => {
          if (career.id === careerId) {
            return {
              ...career,
              projects: career.projects.map(project =>
                project.id === projectId ? response.data : project)
            };
          }
          return career;
        }));
        setActiveAddFormProjectId(null)
        toast.success('프로젝트 정보가 성공적으로 갱신되었습니다', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      })
      .catch(error => console.error(error));
  }

  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState<string | undefined>('');

  const [newProjectName, setNewProjectName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDescription, setNewDescription] = useState<string | undefined>('');

  const handleAddProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    careerId: number,
    projectData: EditingValueProject
  ) => {
    event.preventDefault();
    axios.post(`/api/career/${careerId}/project`, projectData)
      .then(response => {
        setCareers(prev => prev.map(career => {
          if (career.id === careerId) {
            return { ...career, projects: [...career.projects, response.data] };
          }
          return career;
        }));
        setActiveAddFormCareerId(null)
        setNewProjectName('');
        setNewStartDate('');
        setNewEndDate('');
        setNewDescription('');
        toast.success('프로젝트 정보가 성공적으로 추가되었습니다', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      })
      .catch(error => console.error(error));
  }

  const handleDeleteProject = (careerId: number, projectId: number) => {
    axios.delete(`/api/career/${careerId}/project/${projectId}`)
      .then(() => {
        setCareers(prev => prev.map(career => {
          if (career.id === careerId) {
            return { ...career, projects: career.projects.filter(project => project.id !== projectId) };
          }
          return career;
        }));
        toast.error('프로젝트 정보가 성공적으로 삭제되었습니다', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      })
      .catch(error => console.error(error));
  }

  const handleEditProjectInitial = (careerId: number, project: Project) => {
    setProjectName(project.project_name);
    setStartDate(project.start_date);
    setEndDate(project.end_date);
    setDescription(project.description);
    setActiveAddFormProjectId(`${careerId}, ${project.id}`);
  }

  const pageTitle = '경력사항'

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
              <strong>입사일 상관없이 추가하시면 됩니다. 이력서에서는 자동으로 가장 최근 경력 기준으로 보여집니다.</strong>
            </h1>
            <div className='data-group'>
              {careers.length > 0 ? (
                <div className='list'>
                  {careers.map((career) => {
                    const careerForEdit = {
                      org_name: (editCareers[career.id] || career).org_name,
                      team: (editCareers[career.id] || career).team,
                      start_date: (editCareers[career.id] || career).start_date,
                      end_date: (editCareers[career.id] || career).end_date,
                      occupation: (editCareers[career.id] || career).occupation,
                      role: (editCareers[career.id] || career).role,
                      description: (editCareers[career.id] || career).description,
                    };
                    return (
                      <div key={career.id} className='item'>
                        {
                          (() => {
                            const careerId = career.id;
                            return editingCareer === career ? (
                              <form onSubmit={(e) => handleEditCareerSubmit(e, career, careerForEdit)}>
                                <fieldset>
                                  <legend>{pageTitle} 수정 양식</legend>
                                  <FormGroup>
                                    <div>
                                      <FieldGroup>
                                        <input
                                          type="text"
                                          name="org_name"
                                          id="org_name"
                                          placeholder='회사/단체/팀명'
                                          value={careerForEdit.org_name}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='org_name'>회사/단체/팀명</label>
                                      </FieldGroup>
                                      <FieldGroup>
                                        <input type="text"
                                          name="team"
                                          id="team"
                                          placeholder='부서/팀명'
                                          value={careerForEdit.team}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='team'>부서/팀명</label>
                                      </FieldGroup>
                                      <FieldGroup>
                                        <input
                                          type="month"
                                          name="start_date"
                                          id="start_date"
                                          placeholder='입사일/합류일'
                                          value={careerForEdit.start_date}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='start_date'>입사일/합류일</label>
                                      </FieldGroup>
                                      <FieldGroup>
                                        <input
                                          type="month"
                                          name="end_date"
                                          id="end_date"
                                          placeholder='퇴사일/만료일'
                                          value={careerForEdit.end_date}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='end_date'>퇴사일/만료일</label>
                                      </FieldGroup>
                                    </div>
                                    <div>
                                      <FieldGroup>
                                        <input
                                          type="text"
                                          name="occupation"
                                          id="occupation"
                                          placeholder='직업/일'
                                          value={careerForEdit.occupation}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='occupation'>직업/일</label>
                                      </FieldGroup>
                                      <FieldGroup>
                                        <input
                                          type="text"
                                          name="role"
                                          id="role"
                                          placeholder='역할'
                                          value={careerForEdit.role}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='role'>역할</label>
                                      </FieldGroup>
                                    </div>
                                    <div>
                                      <FieldGroup>
                                        <textarea
                                          name="description"
                                          id="description"
                                          placeholder='회사 개요 / 사업 개요 / 주요 업무 설명'
                                          value={careerForEdit.description}
                                          onChange={handleCareerEditChange(careerId)}
                                        />
                                        <label htmlFor='description'>회사 개요 / 사업 개요 / 주요 업무 설명</label>
                                      </FieldGroup>
                                    </div>
                                  </FormGroup>
                                  <ButtonGroup>
                                    <button type="submit">{pageTitle} 수정</button>
                                    <Util>
                                      <SessionUtil />
                                      <FindUtil>
                                        <button type="button" onClick={() => setEditingCareer(null)}>취소하기</button>
                                      </FindUtil>
                                    </Util>
                                  </ButtonGroup>
                                </fieldset>
                              </form>
                            ) : (
                              <>
                                <div className='view'>
                                  <DefinitionGroup>
                                    <div>
                                      <ItemGroup>
                                        <dt>회사/단체/팀명</dt>
                                        <dd>
                                          <span>{career.org_name}</span>
                                        </dd>
                                      </ItemGroup>
                                      <ItemGroup>
                                        <dt>부서/팀명</dt>
                                        <dd>
                                          <span>{career.team}</span>
                                        </dd>
                                      </ItemGroup>
                                      <ItemGroup>
                                        <dt>입사일/합류일</dt>
                                        <dd>
                                          <span>{career.start_date}</span>
                                        </dd>
                                      </ItemGroup>
                                      <ItemGroup>
                                        <dt>퇴사일/만료일</dt>
                                        <dd>
                                          <span>{career.end_date}</span>
                                        </dd>
                                      </ItemGroup>
                                    </div>
                                    <div>
                                      <ItemGroup>
                                        <dt>직업/일</dt>
                                        <dd>
                                          <span>{career.occupation}</span>
                                        </dd>
                                      </ItemGroup>
                                      <ItemGroup>
                                        <dt>역할</dt>
                                        <dd>
                                          <span>{career.role}</span>
                                        </dd>
                                      </ItemGroup>
                                    </div>
                                    <div>
                                      <ItemGroup className='career-description'>
                                        <dt>회사 개요 / 사업 개요 / 주요 업무 설명</dt>
                                        <dd>
                                          <span>{career.description}</span>
                                          <p>줄바꿈이 적용이 안되어 보이지만 실제로는 디비에 제대로 저장되어 있으니 안심하세요. 이력서에서는 줄바꿈 처리됩니다.</p>
                                        </dd>
                                      </ItemGroup>
                                    </div>
                                  </DefinitionGroup>
                                  <div className='item-management'>
                                    <button type='button' className='edit' onClick={() => setEditingCareer(career)}>수정</button>
                                    <button type='button' className='del' onClick={() => handleDeleteCareer(career.id)}>삭제</button>
                                  </div>
                                </div>
                                {career.projects && (
                                  <div className='project-list'>
                                    {career.projects.map((project) => (
                                      <div key={`${career.id}-${project.id}`} className='project-item'>
                                        {activeAddFormProjectId === `${career.id}, ${project.id}` ? (
                                          <form onSubmit={(e) => {
                                            if (career.id !== undefined && project.id !== undefined) {
                                              handleEditProjectSubmit(e, career.id, project.id, {
                                                project_name: projectName,
                                                start_date: startDate,
                                                end_date: endDate,
                                                description: description
                                              });
                                            }
                                          }}>
                                            <fieldset>
                                              <legend>프로젝트 수정</legend>
                                              <FormGroup>
                                                <div>
                                                  <FieldGroup>
                                                    <input
                                                      type="text"
                                                      name="project_name"
                                                      id="project_name"
                                                      placeholder='프로젝트명'
                                                      value={projectName}
                                                      onChange={(e) => setProjectName(e.target.value)}
                                                    />
                                                    <label htmlFor='project_name'>프로젝트명</label>
                                                  </FieldGroup>
                                                  <FieldGroup>
                                                    <input
                                                      type="month"
                                                      name="start_date"
                                                      placeholder='프로젝트 시작일'
                                                      value={startDate}
                                                      onChange={(e) => setStartDate(e.target.value)}
                                                    />
                                                    <label htmlFor='start_date'>프로젝트 시작일</label>
                                                  </FieldGroup>
                                                  <FieldGroup>
                                                    <input
                                                      type="month"
                                                      name="end_date"
                                                      placeholder='프로젝트 종료일'
                                                      value={endDate}
                                                      onChange={(e) => setEndDate(e.target.value)}
                                                    />
                                                    <label htmlFor='end_date'>프로젝트 종료일</label>
                                                  </FieldGroup>
                                                </div>
                                                <div>
                                                  <FieldGroup>
                                                    <textarea
                                                      name="description"
                                                      placeholder='프로젝트 설명'
                                                      value={description}
                                                      onChange={(e) => setDescription(e.target.value)}
                                                    />
                                                    <label htmlFor='description'>프로젝트 설명</label>
                                                  </FieldGroup>
                                                </div>
                                              </FormGroup>
                                              <ButtonGroup>
                                                <button type="submit">프로젝트 수정</button>
                                                <Util>
                                                  <SessionUtil />
                                                  <FindUtil>
                                                    <button type="button" onClick={() => setIsAdding(false)}>취소하기</button>
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
                                                  <dt>프로젝트명</dt>
                                                  <dd>
                                                    <span>{project.project_name}</span>
                                                  </dd>
                                                </ItemGroup>
                                                <ItemGroup>
                                                  <dt>프로젝트 시작</dt>
                                                  <dd>
                                                    <span>{project.start_date}</span>
                                                  </dd>
                                                </ItemGroup>
                                                <ItemGroup>
                                                  <dt>프로젝트 종료</dt>
                                                  <dd>
                                                    <span>{project.end_date}</span>
                                                  </dd>
                                                </ItemGroup>
                                              </div>
                                              <div>
                                                <ItemGroup className='career-description'>
                                                  <dt>프로젝트 설명</dt>
                                                  <dd>
                                                    <span>{project.description}</span>
                                                    <p>줄바꿈이 적용이 안되어 보이지만 실제로는 디비에 제대로 저장되어 있으니 안심하세요. 이력서에서는 줄바꿈 처리됩니다.</p>
                                                  </dd>
                                                </ItemGroup>
                                              </div>
                                            </DefinitionGroup>
                                            <div className='item-management'>
                                              <button
                                                className='edit'
                                                onClick={() => handleEditProjectInitial(career.id, project)}>
                                                수정
                                              </button>
                                              <button
                                                className='del'
                                                onClick={() => handleDeleteProject(career.id, project.id as number)}>
                                                삭제
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {!activeAddFormCareerId && (
                                  <ButtonGroup>
                                    <button type='button' onClick={() => setActiveAddFormCareerId(career.id as number)}>
                                      프로젝트 추가하기
                                    </button>
                                  </ButtonGroup>
                                )}
                                {activeAddFormCareerId === career.id && (
                                  <form onSubmit={(e) => handleAddProjectSubmit(e, career.id, {
                                    project_name: newProjectName,
                                    start_date: newStartDate,
                                    end_date: newEndDate,
                                    description: newDescription
                                  })}>
                                    <fieldset>
                                      <legend>프로젝트 추가</legend>
                                      <FormGroup>
                                        <div>
                                          <FieldGroup>
                                            <input
                                              type="text"
                                              name="project_name"
                                              id="project_name"
                                              placeholder='프로젝트명'
                                              value={newProjectName}
                                              onChange={(e) => setNewProjectName(e.target.value)}
                                            />
                                            <label htmlFor='project_name'>프로젝트명</label>
                                          </FieldGroup>
                                          <FieldGroup>
                                            <input
                                              type="month"
                                              name="start_date"
                                              placeholder='프로젝트 시작일'
                                              value={newStartDate}
                                              onChange={(e) => setNewStartDate(e.target.value)}
                                            />
                                            <label htmlFor='start_date'>프로젝트 시작일</label>
                                          </FieldGroup>
                                          <FieldGroup>
                                            <input
                                              type="month"
                                              name="end_date"
                                              placeholder='프로젝트 종료일'
                                              value={newEndDate}
                                              onChange={(e) => setNewEndDate(e.target.value)}
                                            />
                                            <label htmlFor='end_date'>프로젝트 종료일</label>
                                          </FieldGroup>
                                        </div>
                                        <div>
                                          <FieldGroup>
                                            <textarea
                                              name="description"
                                              placeholder='프로젝트 설명'
                                              value={newDescription}
                                              onChange={(e) => setNewDescription(e.target.value)}
                                            />
                                            <label htmlFor='description'>프로젝트 설명</label>
                                          </FieldGroup>
                                        </div>
                                      </FormGroup>
                                      <ButtonGroup>
                                        <button type="submit">프로젝트 추가</button>
                                        <Util>
                                          <SessionUtil />
                                          <FindUtil>
                                            <button type="button" onClick={() => setActiveAddFormCareerId(null)}>취소하기</button>
                                          </FindUtil>
                                        </Util>
                                      </ButtonGroup>
                                    </fieldset>
                                  </form>
                                )}
                              </>
                            )
                          })()
                        }
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className='no-data'>등록된 {pageTitle}이 없습니다</p>
              )}
              {!isAdding &&
                <ButtonGroup>
                  <button onClick={() => setIsAdding(true)}>{pageTitle} 추가하기</button>
                </ButtonGroup>
              }
              {isAdding && (
                <form onSubmit={(event) => handleAddCareerSubmit(event, editingValueCareer)}>
                  <fieldset>
                    <legend>{pageTitle} 추가 양식</legend>
                    <FormGroup>
                      <div>
                        <FieldGroup>
                          <input
                            type="text"
                            name="org_name"
                            id="org_name"
                            placeholder='회사/단체/팀명'
                            value={editingValueCareer.org_name}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='org_name'>회사/단체/팀명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="team"
                            id="team"
                            placeholder='부서/팀명'
                            value={editingValueCareer.team}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='team'>부서/팀명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="month"
                            name="start_date"
                            id="start_date"
                            placeholder='입사일/합류일'
                            value={editingValueCareer.start_date}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='start_date'>입사일/합류일</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="month"
                            name="end_date"
                            id="end_date"
                            placeholder='퇴사일/만료일'
                            value={editingValueCareer.end_date}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='end_date'>퇴사일/만료일</label>
                        </FieldGroup>
                      </div>
                      <div>
                        <FieldGroup>
                          <input
                            type="text"
                            name="occupation"
                            id="occupation"
                            placeholder='직업/일'
                            value={editingValueCareer.occupation}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='occupation'>직업/일</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="role"
                            id="role"
                            placeholder='역할'
                            value={editingValueCareer.role}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='role'>역할</label>
                        </FieldGroup>
                      </div>
                      <div>
                        <FieldGroup>
                          <textarea
                            name="description"
                            id="description"
                            placeholder='회사 개요 / 사업 개요 / 주요 업무 설명'
                            value={editingValueCareer.description}
                            onChange={handleCareerChange}
                          />
                          <label htmlFor='description'>회사 개요 / 사업 개요 / 주요 업무 설명</label>
                        </FieldGroup>
                      </div>
                    </FormGroup>
                    <ButtonGroup>
                      <button type="submit">{pageTitle} 추가</button>
                      <Util>
                        <SessionUtil />
                        <FindUtil>
                          <button type="button" onClick={() => setIsAdding(false)}>취소하기</button>
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

