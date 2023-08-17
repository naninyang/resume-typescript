import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/hooks/authContext'
import useModal from '@/components/hooks/useModal';
import { ButtonGroup, Container, Content, FieldGroup, FormGroup, ManagementContainer } from '@/styles/manageSystem';
import IsNotSession from './isNotSession';
import { Rem, hex } from '@/styles/designSystem';
import styled from '@emotion/styled';

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

export default function MilitaryService() {
  const { loggedIn } = useAuth();

  const [militaryStats, setMilitaryStats] = useState(false);
  const [militaryShow, setMilitaryShow] = useState(false);
  const [conscriptionExemption, setConscriptionExemption] = useState('');
  const [militaryGroup, setMilitaryGroup] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rank, setRank] = useState('');
  const [discharge, setDischarge] = useState('');
  const [branch, setBranch] = useState('');

  const handleMilitaryStatsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMilitaryStats(event.target.checked);
  };

  const handleMilitaryShowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMilitaryShow(event.target.checked);
  };

  useEffect(() => {
    fetchMilitaryServices();
  }, []);

  const fetchMilitaryServices = async () => {
    try {
      const response = await axios.get('/api/military-service');
      const militaryServices = response.data;
      if (militaryServices.length > 0) {
        setMilitaryStats(militaryServices[0].military_stats);
        setMilitaryShow(militaryServices[0].military_show);
        setConscriptionExemption(militaryServices[0].conscription_exemption);
        setMilitaryGroup(militaryServices[0].military_group);
        setStartDate(militaryServices[0].start_date);
        setEndDate(militaryServices[0].end_date);
        setRank(militaryServices[0].rank);
        setDischarge(militaryServices[0].discharge);
        setBranch(militaryServices[0].branch);
      }
    } catch (error) {
      console.error('Failed to fetch militaryServices:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/military-service', {
        militaryStats,
        militaryShow,
        conscriptionExemption,
        militaryGroup,
        branch,
        rank,
        discharge,
        startDate,
        endDate,
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        toast.success('병역사항 갱신에 성공했습니다', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      } else {
        toast.error('병역사항 갱신에 실패했습니다', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Failed to create military service:', error);
      toast.error('서버 오류입니다', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    }
  };

  const pageTitle = '병역사항 갱신'

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
                  <CheckboxGroup>
                    <div>
                      <input
                        type="checkbox"
                        name='military_stats'
                        id='military_stats'
                        checked={militaryStats}
                        onChange={handleMilitaryStatsChange}
                      />
                      <label htmlFor='military_stats'>병역여부</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        name='military_show'
                        id='military_show'
                        checked={militaryShow}
                        onChange={handleMilitaryShowChange}
                      />
                      <label htmlFor='military_show'>공개여부</label>
                    </div>
                  </CheckboxGroup>
                  {!militaryStats ? (
                    <FieldGroup>
                      <input
                        type="text"
                        name="conscription_exemption"
                        id='conscription_exemption'
                        placeholder='면제사유'
                        value={conscriptionExemption}
                        onChange={(e) => setConscriptionExemption(e.target.value)}
                      />
                      <label htmlFor='conscription_exemption'>면제사유</label>
                      <p>미필(입영대상자), 비대상(여성, 장애인 등) 선택</p>
                    </FieldGroup>
                  ) : (
                    <>
                      <FieldGroup>
                        <input
                          type="text"
                          name="military_group"
                          id='military_group'
                          placeholder='군별'
                          value={militaryGroup}
                          onChange={(e) => setMilitaryGroup(e.target.value)}
                        />
                        <label htmlFor='military_group'>군별</label>
                        <p>해군, 공군, 육군, 해병대 등</p>
                      </FieldGroup>
                      <FieldGroup>
                        <input
                          type="text"
                          name="branch"
                          id='branch'
                          placeholder='병과'
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                        />
                        <label htmlFor='branch'>병과</label>
                      </FieldGroup>
                      <FieldGroup>
                        <input
                          type="text"
                          name="rank"
                          id='rank'
                          placeholder='계급'
                          value={rank}
                          onChange={(e) => setRank(e.target.value)}
                        />
                        <label htmlFor='rank'>계급</label>
                        <p>최종 취득 계급을 입력하세요</p>
                      </FieldGroup>
                      <FieldGroup>
                        <input
                          type="text"
                          name="discharge"
                          id='discharge'
                          placeholder='병역'
                          value={discharge}
                          onChange={(e) => setDischarge(e.target.value)}
                        />
                        <label htmlFor='discharge'>병역</label>
                        <p>현역, 의병 전역, 만기 전역 등</p>
                      </FieldGroup>
                      <FieldGroup>
                        <input
                          type="month"
                          name="start_date"
                          id='start_date'
                          placeholder='복무 시작일'
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label htmlFor='start_date'>복무 시작일</label>
                      </FieldGroup>
                      <FieldGroup>
                        <input
                          type="month"
                          name="end_date"
                          id='end_date'
                          placeholder='전역/제대일'
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <label htmlFor='end_date'>전역/제대일</label>
                        <p>현역병인 경우에는 비워두세요</p>
                      </FieldGroup>
                    </>
                  )}
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
