import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import { ArrayContainer, ButtonGroup, Container, Content, DefinitionGroup, FieldGroup, FindUtil, FormGroup, ItemGroup, SessionUtil, Util } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';

export default function Certificate() {
  const { loggedIn } = useAuth();

  const [isAdding, setIsAdding] = useState<boolean | false>(false);

  const [certificate, setCertificate] = useState({
    certificate_name: '',
    organization: '',
    certificate_num: '',
    issue_date: '',
  });

  type Certificate = {
    id?: number;
    certificate_name: string;
    organization: string;
    certificate_num: string;
    issue_date: string;
    [key: string]: any;
  };

  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/certificate`, { headers: { Authorization: `Bearer ${token}` } });
      setCertificates(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCertificate({
      ...certificate,
      [name]: value
    });
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/certificate/`, certificate, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('자격증 정보가 성공적으로 추가되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setIsAdding(false)
      fetchCertificate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (certificateId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/certificate/${certificateId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.error('자격증 정보가 성공적으로 삭제되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      fetchCertificate();
    } catch (error) {
      console.error(error);
    }
  };

  type CertificateType = {
    certificate_name: string;
    organization: string;
    certificate_num: string;
    issue_date: string;
    [key: string]: any;
  }

  const [certificateEdit, setFormData] = useState<CertificateType>({ ...certificate });
  const [editingCertificate, setEditingCertificate] = useState<number | null>(null);

  const handleEditClick = (cer: CertificateType) => {
    setEditingCertificate(cer.id);
    setFormData(cer);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...certificateEdit,
      [name]: value,
    });
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const id = event.currentTarget.getAttribute('data-id');
      await axios.put(`/api/certificate/${id}`, certificateEdit, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('자격증 정보가 성공적으로 수정되었습니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      setEditingCertificate(null);
      fetchCertificate();
    } catch (error) {
      console.error('Failed to update certificate: ', error);
    }
  };

  const handleCancelClick = () => {
    setEditingCertificate(null);
  }

  const pageTitle = '자격증'

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
              <strong>발행일자 상관없이 추가하시면 됩니다. 이력서에서는 자동으로 가장 오래된 자격증 기준으로 보여집니다.</strong>
            </h1>
            <div className='data-group'>
              {certificates.length > 0 ?
                <div className='list'>
                  {certificates.map((cer) => (
                    <div key={cer.id} className='item'>
                      {editingCertificate === cer.id ? (
                        <form onSubmit={handleEditSubmit} data-id={editingCertificate}>
                          <fieldset>
                            <legend>{pageTitle} 갱신</legend>
                            <FormGroup>
                              <div>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="certificate_name"
                                    id={`certificate_name-${cer.id}`}
                                    value={certificateEdit.certificate_name}
                                    onChange={handleEditChange}
                                    placeholder="자격증명"
                                    required
                                  />
                                  <label htmlFor={`certificate_name-${cer.id}`}>자격증명</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="organization"
                                    id={`organization-${cer.id}`}
                                    value={certificateEdit.organization}
                                    onChange={handleEditChange}
                                    placeholder="발행처"
                                    required
                                  />
                                  <label htmlFor={`organization-${cer.id}`}>발행처</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="text"
                                    name="certificate_num"
                                    id={`certificate_num-${cer.id}`}
                                    value={certificateEdit.certificate_num}
                                    onChange={handleEditChange}
                                    placeholder="자격증번호"
                                  />
                                  <label htmlFor={`certificate_num-${cer.id}`}>자격증번호</label>
                                </FieldGroup>
                                <FieldGroup>
                                  <input
                                    type="date"
                                    name="issue_date"
                                    id={`issue_date-${cer.id}`}
                                    value={certificateEdit.issue_date}
                                    onChange={handleEditChange}
                                    placeholder="발행일자"
                                    required
                                  />
                                  <label htmlFor={`issue_date-${cer.id}`}>발행일자</label>
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
                                <dt>자격증명</dt>
                                <dd>
                                  <span>{cer.certificate_name}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>발행처</dt>
                                <dd>
                                  <span>{cer.organization}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>자격증번호</dt>
                                <dd>
                                  <span>{cer.certificate_num}</span>
                                </dd>
                              </ItemGroup>
                              <ItemGroup>
                                <dt>발행일자</dt>
                                <dd>
                                  <span>{cer.issue_date}</span>
                                </dd>
                              </ItemGroup>
                            </div>
                          </DefinitionGroup>
                          <div className='item-management'>
                            <button type='button' className='edit' onClick={() => handleEditClick(cer)}>수정</button>
                            <button type='button' className='del' onClick={() => handleDelete(cer.id!)}>삭제</button>
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
                    setCertificate({
                      certificate_name: '',
                      organization: '',
                      certificate_num: '',
                      issue_date: '',
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
                            name="certificate_name"
                            id='certificate_name'
                            value={certificate.certificate_name}
                            onChange={handleAddChange}
                            placeholder="자격증명"
                            required
                          />
                          <label htmlFor='certificate_name'>자격증명</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="organization"
                            id="organization"
                            value={certificate.organization}
                            onChange={handleAddChange}
                            placeholder="발행처"
                            required
                          />
                          <label htmlFor='organization'>발행처</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="text"
                            name="certificate_num"
                            id="certificate_num"
                            value={certificate.certificate_num}
                            onChange={handleAddChange}
                            placeholder="자격증번호"
                          />
                          <label htmlFor='certificate_num'>자격증번호</label>
                        </FieldGroup>
                        <FieldGroup>
                          <input
                            type="date"
                            name="issue_date"
                            id="issue_date"
                            value={certificate.issue_date}
                            onChange={handleAddChange}
                            placeholder="발행일자"
                            required
                          />
                          <label htmlFor='issue_date'>발행일자</label>
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
