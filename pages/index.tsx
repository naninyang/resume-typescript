import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import Image from 'next/image';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useAuth } from '@/components/hooks/authContext'
import LinkButton from '@/components/hooks/linkButton';
import { Container, Fragment, IsNotSession } from '@/styles/serviceSystem';

type HomeProps = {
  mdx?: MDXRemoteSerializeResult;
};

const Home: NextPage<HomeProps> = ({ mdx }) => {
  const { loggedIn } = useAuth();

  type ResumeData = {
    username?: string;
    username_show?: boolean;
    email?: string;
    email_show?: boolean;
    address?: string;
    telephone?: string;
    veteran?: string;
    disability?: string;
    references?: Reference[];
    military_services?: military_service[];
    educations?: education[];
    certificates?: certificate[];
    languages?: language[];
    awards?: award[];
    skills?: skill[];
    activities?: activity[];
    careers?: career[];
    essays?: essay[];
  };

  type Reference = {
    github?: string;
    velog?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    leadme?: string;
    brunch?: string;
    tistory?: string;
    pinterest?: string;
    linkedin?: string;
    dribble?: string;
    postype?: string;
    blog?: string;
    homepage?: string;
  };

  type military_service = {
    military_stats?: boolean;
    military_show?: boolean;
    conscription_exemption?: string;
    military_group?: string;
    branch?: string;
    rank?: string;
    discharge?: string;
    start_date?: string;
    end_date?: string;
  }

  type education = {
    id?: number;
    school?: string;
    major?: string;
    category?: string;
    record?: string;
    degree?: string;
    degree_num?: string;
    stats?: string;
    start_date?: string;
    end_date?: string;
  }

  type certificate = {
    id?: number;
    certificate_name?: string;
    organization?: string;
    certificate_num?: string;
    issue_date?: string;
  }

  type language = {
    id?: number;
    lang_name?: string;
    exam_name?: string;
    point?: number;
  }

  type award = {
    id?: number;
    award_name?: string;
    description?: string;
    organization?: string;
    issue_date?: string;
  }

  type skill = {
    id?: number;
    skill_name?: string;
    skill_level?: number;
    skill_career?: number;
  }

  type activity = {
    id?: number;
    organization?: string;
    position?: string;
    description?: string;
    classification?: string;
    start_date?: string;
    start_time?: string;
    end_date?: string;
    end_time?: string;
  }

  type career = {
    id?: number;
    org_name?: string;
    team?: string;
    start_date?: string;
    end_date?: string;
    occupation?: string;
    role?: string;
    description?: string;
    projects: [project];
  }

  type project = {
    id?: number;
    project_name?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }

  type essay = {
    id?: number;
    username_show?: boolean;
    avatar_path?: string;
    eng_name?: string;
    eng_occupation?: string;
    title?: string;
    show?: boolean;
  }

  const [resumeData, setResumeData] = useState<ResumeData>({});

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/resume', { headers: { Authorization: `Bearer ${token}` } });
      setResumeData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch resume:', error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const careerDescription = (value: number | undefined): string => {
    switch (value) {
      case 1:
        return '1년 미만';
      case 2:
        return '1년 이상 3년 미만';
      case 3:
        return '3년 이상 5년 미만';
      case 4:
        return '5년 이상 10년 미만';
      case 5:
        return '10년 이상';
      default:
        return '경험 미선택';
    }
  };

  type RenderDescriptionProps = {
    description: string;
  };

  function RenderDescription({ description }: RenderDescriptionProps) {
    if (description.includes('\n')) {
      return (
        <p>
          {description.split('\n').map((line: string, index: number) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      );
    } else {
      return <p>{description}</p>;
    }
  }

  return (
    <Container className='css-0'>
      {loggedIn ? (
        <>
          <Head>
            <title>이력서 정보</title>
          </Head>
          <h1>이력서 정보</h1>
          <blockquote>
            <p>프린트는 프린트 전용 화면으로 이동하신 뒤에 프린트 해주세요.</p>
            <LinkButton href='/print'>프린트 화면으로 이동</LinkButton>
          </blockquote>
          <section>
            <h2>인적사항</h2>
            <dl>
              <dt>성명</dt>
              <dd>
                {resumeData.username}
                {' '}
                {!resumeData.username_show && <strong>프린트 할 때는 공개되지 않습니다</strong>}
              </dd>
              <dt>이메일</dt>
              <dd>
                {resumeData.email}
                {' '}
                {!resumeData.email_show && <strong>프린트 할 때는 공개되지 않습니다</strong>}
              </dd>
              <dt>주소</dt>
              <dd>
                {resumeData.address ? resumeData.address : <strong>주소를 입력하지 않아 프린트 할 때 공개되지 않습니다</strong>}
              </dd>
              <dt>연락처</dt>
              <dd>
                {resumeData.telephone ? resumeData.telephone : <strong>연락처를 입력하지 않아 프린트 할 때 공개되지 않습니다</strong>}
              </dd>
              <dt>보훈대상</dt>
              <dd>
                {resumeData.veteran ? resumeData.veteran : <strong>보훈대상 여부를 입력하지 않아 프린트 할 때 공개되지 않습니다</strong>}
              </dd>
              <dt>장애대상</dt>
              <dd>
                {resumeData.disability ? resumeData.disability : <strong>장애대상 여부를 입력하지 않아 프린트 할 때 공개되지 않습니다</strong>}
              </dd>
            </dl>
          </section>
          <section>
            <h2>레퍼런스</h2>
            <dl>
              <dt>깃헙</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].github ? (
                  <LinkButton href={`https://github.com/${resumeData?.references?.[0].github}`}>{`https://github.com/${resumeData?.references?.[0].github}`}</LinkButton>
                ) : (
                  <p>아직 깃헙 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>벨로그</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].velog ? (
                  <LinkButton href={`https://velog.io/@${resumeData?.references?.[0].velog}`}>{`https://velog.io/@${resumeData?.references?.[0].velog}`}</LinkButton>
                ) : (
                  <p>아직 벨로그 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>인스타그램</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].instagram ? (
                  <LinkButton href={`https://www.instagram.com/${resumeData?.references?.[0].instagram}`}>{`https://www.instagram.com/${resumeData?.references?.[0].instagram}`}</LinkButton>
                ) : (
                  <p>아직 인스타그램 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>트위터</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].twitter ? (
                  <LinkButton href={`https://twitter.com/${resumeData?.references?.[0].twitter}`}>{`https://twitter.com/${resumeData?.references?.[0].twitter}`}</LinkButton>
                ) : (
                  <p>아직 트위터(엑스 X) 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>페이스북</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].facebook ? (
                  <LinkButton href={`https://www.facebook.com/${resumeData?.references?.[0].facebook}`}>{`https://www.facebook.com/${resumeData?.references?.[0].facebook}`}</LinkButton>
                ) : (
                  <p>아직 페이스북 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>리드미</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].leadme ? (
                  <LinkButton href={`https://www.leadme.today/@${resumeData?.references?.[0].leadme}`}>{`https://www.leadme.today/@${resumeData?.references?.[0].leadme}`}</LinkButton>
                ) : (
                  <p>아직 리드미 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>브런치</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].brunch ? (
                  <LinkButton href={`https://brunch.co.kr/@${resumeData?.references?.[0].brunch}`}>{`https://brunch.co.kr/@${resumeData?.references?.[0].brunch}`}</LinkButton>
                ) : (
                  <p>아직 브런치 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>티스토리</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].tistory ? (
                  <LinkButton href={`https://${resumeData?.references?.[0].tistory}.tistory.com`}>{`https://${resumeData?.references?.[0].tistory}.tistory.com`}</LinkButton>
                ) : (
                  <p>아직 티스토리 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>핀터레스트</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].pinterest ? (
                  <LinkButton href={`https://www.pinterest.co.kr/${resumeData?.references?.[0].pinterest}`}>{`https://www.pinterest.co.kr/${resumeData?.references?.[0].pinterest}`}</LinkButton>
                ) : (
                  <p>아직 핀터레스트 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>링크드인</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].linkedin ? (
                  <LinkButton href={`https://kr.linkedin.com/in/${encodeURIComponent(resumeData?.references?.[0].linkedin)}`}>{`https://kr.linkedin.com/in/${encodeURIComponent(resumeData?.references?.[0].linkedin)}`}</LinkButton>
                ) : (
                  <p>아직 링크드인 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>드리블</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].dribble ? (
                  <LinkButton href={`https://dribbble.com/${resumeData?.references?.[0].dribble}`}>{`https://dribbble.com/${resumeData?.references?.[0].dribble}`}</LinkButton>
                ) : (
                  <p>아직 드리블 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>포스타입</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].postype ? (
                  <LinkButton href={`https://${resumeData?.references?.[0].postype}.postype.com`}>{`https://${resumeData?.references?.[0].postype}.postype.com`}</LinkButton>
                ) : (
                  <p>아직 포스타입 계정 이름을 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>블로그</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].blog ? (
                  <LinkButton href={`${encodeURIComponent(resumeData?.references?.[0].blog)}`}>{resumeData?.references?.[0].blog}</LinkButton>
                ) : (
                  <p>아직 블로그 주소를 등록하지 않으셨습니다</p>
                )}
              </dd>
              <dt>홈페이지</dt>
              <dd>
                {resumeData.references && resumeData.references.length > 0 && resumeData.references[0].homepage ? (
                  <LinkButton href={`${encodeURIComponent(resumeData?.references?.[0].homepage)}`}>{resumeData?.references?.[0].homepage}</LinkButton>
                ) : (
                  <p>아직 홈페이지 주소를 등록하지 않으셨습니다</p>
                )}
              </dd>
            </dl>
          </section>
          <section>
            <h2>병역사항</h2>
            {(resumeData?.military_services?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData.military_services && resumeData.military_services[0] &&
                  <dl>
                    <dt>병역여부</dt>
                    <dd>{resumeData.military_services[0].military_stats ? '군필' : '미필'}</dd>
                    <dt>이력서 병역여부 공개</dt>
                    <dd>{resumeData.military_services[0].military_show ? '공개' : '공개 안함'}</dd>
                    {resumeData.military_services[0].military_stats === false ?
                      <>
                        <dt>면제 사유</dt>
                        <dd>{resumeData.military_services[0].conscription_exemption ? resumeData.military_services[0].conscription_exemption : '면제사유 미입력'}</dd>
                      </>
                      :
                      <>
                        <dt>군별</dt>
                        <dd>{resumeData.military_services[0].military_group ? resumeData.military_services[0].military_group : '군별 미입력'}</dd>
                        <dt>병과</dt>
                        <dd>{resumeData.military_services[0].branch ? resumeData.military_services[0].branch : '병과 미입력'}</dd>
                        <dt>계급</dt>
                        <dd>{resumeData.military_services[0].rank ? resumeData.military_services[0].rank : '계급 미입력'}</dd>
                        <dt>병역</dt>
                        <dd>{resumeData.military_services[0].discharge ? resumeData.military_services[0].discharge : '병역 미입력'}</dd>
                        <dt>복무 시작일</dt>
                        <dd>{resumeData.military_services[0].start_date ? resumeData.military_services[0].start_date : '복무 시작일 미입력'}</dd>
                        {resumeData.military_services[0].end_date &&
                          <>
                            <dt>전역/제대일</dt>
                            <dd>{resumeData.military_services[0].end_date}</dd>
                          </>
                        }
                      </>
                    }
                  </dl>
                }
              </dl>
            ) : (
              <p>아직 병역사항을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>학력사항</h2>
            {(resumeData?.educations?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.educations?.sort((a, b) => (a.start_date ?? '').localeCompare(b.start_date ?? '')).map((education) => (
                  <Fragment key={education.id}>
                    <dt>학교명</dt>
                    <dd>{education.school}</dd>
                    <dt>분류</dt>
                    <dd>{education.major}</dd>
                    <dt>전공</dt>
                    <dd>{education.category}</dd>
                    {education.record &&
                      <>
                        <dt>학점</dt>
                        <dd>{education.record}</dd>
                      </>
                    }
                    {education.degree &&
                      <>
                        <dt>학위명</dt>
                        <dd>{education.degree}</dd>
                      </>
                    }
                    {education.degree_num &&
                      <>
                        <dt>학위등록번호</dt>
                        <dd>{education.degree_num}</dd>
                      </>
                    }
                    <dt>상태</dt>
                    <dd>{education.stats}</dd>
                    <dt>입학일</dt>
                    <dd>{education.start_date}</dd>
                    {education.end_date &&
                      <>
                        <dt>졸업일</dt>
                        <dd>{education.end_date}</dd>
                      </>
                    }
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 학력사항을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>자격증</h2>
            {(resumeData?.certificates?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.certificates?.sort((a, b) => (a.issue_date ?? '').localeCompare(b.issue_date ?? '')).map((certificate) => (
                  <Fragment key={certificate.id}>
                    <dt>자격증명</dt>
                    <dd>{certificate.certificate_name}</dd>
                    <dt>발행처</dt>
                    <dd>{certificate.organization}</dd>
                    <dt>자격증번호</dt>
                    <dd>{certificate.certificate_num}</dd>
                    <dt>발행일자</dt>
                    <dd>{certificate.issue_date}</dd>
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 자격증을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>외국어능력</h2>
            {(resumeData?.languages?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.languages?.sort((a, b) => {
                  const aPoint = a.point ?? 0;
                  const bPoint = b.point ?? 0;
                  if (aPoint !== bPoint) {
                    return bPoint - aPoint;
                  }
                  return (a.lang_name ?? '').localeCompare(b.lang_name ?? '');
                }).map((language) => (
                  <Fragment key={language.id}>
                    <dt>외국어명</dt>
                    <dd>{language.lang_name}</dd>
                    <dt>시험명</dt>
                    <dd>{language.exam_name}</dd>
                    <dt>점수</dt>
                    <dd>{language.point} 점</dd>
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 외국어능력을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>수상기록</h2>
            {(resumeData?.awards?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.awards?.sort((a, b) => (a.issue_date ?? '').localeCompare(b.issue_date ?? '')).map((award) => (
                  <Fragment key={award.id}>
                    <dt>수상명</dt>
                    <dd>{award.award_name}</dd>
                    <dt>수상내용</dt>
                    <dd>{award.description}</dd>
                    <dt>발행기관</dt>
                    <dd>{award.organization}</dd>
                    <dt>취득일</dt>
                    <dd>{award.issue_date}</dd>
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 수상기록을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>보유기술</h2>
            {(resumeData?.skills?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.skills?.sort((a, b) => {
                  const aSkill_level = a.skill_level ?? 0;
                  const bSkill_level = b.skill_level ?? 0;
                  if (aSkill_level !== bSkill_level) {
                    return bSkill_level - aSkill_level;
                  }
                  const aSkill_career = a.skill_career ?? 0;
                  const bSkill_career = b.skill_career ?? 0;
                  return bSkill_career - aSkill_career;
                }).map((skill) => (
                  <Fragment key={skill.id}>
                    <dt>기술명</dt>
                    <dd>{skill.skill_name}</dd>
                    <dt>숙련도</dt>
                    <dd>Lv. {skill.skill_level}</dd>
                    <dt>경험</dt>
                    <dd>{careerDescription(skill.skill_career ?? 0)}</dd>
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 기술을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>대외활동</h2>
            {(resumeData?.activities?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.activities?.sort((b, a) => (a.start_date ?? '').localeCompare(b.start_date ?? '')).map((activity) => (
                  <Fragment key={activity.id}>
                    <dt>기관명</dt>
                    <dd>{activity.organization}</dd>
                    <dt>직책/담당업무</dt>
                    <dd>{activity.position}</dd>
                    <dt>활동내용</dt>
                    <dd>{activity.description}</dd>
                    <dt>활동구분</dt>
                    <dd>{activity.classification}</dd>
                    <dt>시작일시</dt>
                    <dd>{activity.start_date}</dd>
                    {activity.start_time &&
                      <>
                        <dt>시작시간</dt>
                        <dd>{activity.start_time}</dd>
                      </>
                    }
                    {activity.end_date &&
                      <>
                        <dt>종료일시</dt>
                        <dd>{activity.end_date}</dd>
                      </>
                    }
                    {activity.end_time &&
                      <>
                        <dt>종료시간</dt>
                        <dd>{activity.end_time}</dd>
                      </>
                    }
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 대외활동을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>경력사항</h2>
            {(resumeData?.careers?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData?.careers?.sort((b, a) => (a.start_date ?? '').localeCompare(b.start_date ?? '')).map((career) => (
                  <Fragment key={`career-${career.id}`} className='array'>
                    <div className='array'>
                      <dt>회사/단체/팀명</dt>
                      <dd>{career.org_name}</dd>
                      <dt>부서/팀명</dt>
                      <dd>{career.team}</dd>
                      <dt>입사일/합류일</dt>
                      <dd>{career.start_date}</dd>
                      {career.end_date ?
                        <>
                          <dt>퇴사일/만료일</dt>
                          <dd>{career.end_date}</dd>
                        </>
                        :
                        <>
                          <dt>퇴사일/만료일</dt>
                          <dd>재직 중</dd>
                        </>
                      }
                      <dt>직업/일</dt>
                      <dd>{career.occupation}</dd>
                      <dt>역할</dt>
                      <dd>{career.role}</dd>
                      <dt>프로젝트 설명</dt>
                      <dd>
                        {career.description ? (
                          <RenderDescription description={career.description} />
                        ) : (
                          <p><strong>설명이 없습니다</strong></p>
                        )}
                      </dd>
                    </div>
                    {career.projects.length > 0 && (
                      <div className='projects-list'>
                        {career.projects.sort((b, a) => (a.start_date ?? '').localeCompare(b.start_date ?? '')).map((project) => (
                          <Fragment key={`project-${career.id}-${project.id}`}>
                            <dt>프로젝트명</dt>
                            <dd>{project.project_name}</dd>
                            <dt>프로젝트 시작일</dt>
                            <dd>{project.start_date}</dd>
                            {project.end_date ?
                              <>
                                <dt>프로젝트 종료</dt>
                                <dd>{project.end_date}</dd>
                              </>
                              :
                              <>
                                <dt>프로젝트 종료</dt>
                                <dd>프로젝트 진행 중</dd>
                              </>
                            }
                            <dt>프로젝트 설명</dt>
                            <dd>
                              {project.description ? (
                                <RenderDescription description={project.description} />
                              ) : (
                                <p><strong>설명이 없습니다</strong></p>
                              )}
                            </dd>
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </Fragment>
                ))}
              </dl>
            ) : (
              <p>아직 경력사항을 등록하지 않으셨습니다</p>
            )}
          </section>
          <section>
            <h2>자기소개서</h2>
            {(resumeData?.essays?.length ?? 0) > 0 ? (
              <dl className='array'>
                {resumeData.essays && resumeData.essays[0] &&
                  <dl>
                    {!resumeData.username_show &&
                      <>
                        <dt>주의사항</dt>
                        <dd>이름이 비공개 상태입니다. 비공개 상태에서는 프린트되지 않습니다</dd>
                      </>
                    }
                    <dt>자기소개서 공개여부</dt>
                    <dd>{resumeData.essays[0].show ? '공개' : '비공개'}</dd>
                    <dd>{resumeData.essays[0].avatar_path ? <Image src={resumeData.essays[0].avatar_path} alt="사진 미리보기" width='100' height='100' /> : '등록된 사진이 없습니다'}</dd>
                    <dt>영문 이름</dt>
                    <dd>{resumeData.essays[0].eng_name}</dd>
                    <dt>영문 직업</dt>
                    <dd>{resumeData.essays[0].eng_occupation}</dd>
                    <dt>자기소개서 제목</dt>
                    <dd>{resumeData.essays[0].title} {resumeData.username} 입니다</dd>
                    <dt>자기소개서 내용</dt>
                    <dd className='essays'>
                      {mdx && <MDXRemote {...mdx} />}
                    </dd>
                  </dl>
                }
              </dl>
            ) : (
              <p>아직 자기소개서를 등록하지 않으셨습니다</p>
            )}
          </section>
        </>
      ) : (
        <>
          <Head>
            <title>이력서 정보 확인권한 없음</title>
          </Head>
          <IsNotSession><p>개인정보를 다루는 페이지이므로 로그인이 필요합니다</p></IsNotSession>
        </>
      )}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const token = context.req.cookies.token;
  const response = await axios.get('http://localhost:3002/api/resume', { headers: { Authorization: `Bearer ${token}` } });
  const data = response.data;
  const mdxSource = data.essays?.[0]?.bio;

  if (!mdxSource) {
    return { props: {} };
  }

  const mdx = await serialize(mdxSource);

  return { props: { mdx } };
}

export default Home;
