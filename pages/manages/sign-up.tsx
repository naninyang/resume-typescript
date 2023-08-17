import { useRouter } from 'next/router';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ButtonGroup, Container, Content, FieldGroup, FormGroup } from '@/styles/manageSystem';

export default function SignUp() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    userid: Yup.string()
      .required("필수 항목입니다"),
    username: Yup.string()
      .required("필수 항목입니다"),
    email: Yup.string()
      .email("이메일 형식이 아닙니다")
      .required("필수 항목입니다"),
    password: Yup.string()
      .required("필수 항목입니다"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "비밀번호가 일치하지 않습니다")
      .required("필수 항목입니다"),
  });

  return (
    <Container>
      <Content>
        <Formik
          initialValues={{ userid: "", username: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const response = await axios.post('/api/signup', values);
              const data = response.data;
              if (data.status === 'success') {
                toast.success('회원가입에 성공했습니다.', {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 5000,
                });
                router.push('/manages/pass');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          }}
        >
          <Form>
            <fieldset>
              <legend>회원가입 양식</legend>
              <FormGroup>
                <FieldGroup>
                  <Field name="userid" id="userid" type="text" placeholder="아이디 입력" />
                  <label htmlFor="userid">아이디</label>
                  <ErrorMessage name="userid" component="p" />
                </FieldGroup>

                <FieldGroup>
                  <Field name="username" id="username" type="text" placeholder="사용자 이름 입력" />
                  <label htmlFor="username">사용자 이름</label>
                  <ErrorMessage name="username" component="p" />
                </FieldGroup>

                <FieldGroup>
                  <Field name="email" id="email" type="email" placeholder="이메일 주소 입력" />
                  <label htmlFor="email">이메일 주소</label>
                  <ErrorMessage name="email" component="p" />
                </FieldGroup>

                <FieldGroup>
                  <Field name="password" id="password" type="password" placeholder="비밀번호 입력" />
                  <label htmlFor="password">비밀번호</label>
                  <ErrorMessage name="password" component="p" />
                </FieldGroup>

                <FieldGroup>
                  <Field name="confirmPassword" id="confirmPassword" type="password" placeholder="비밀번호 재입력" />
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                  <ErrorMessage name="confirmPassword" component="p" />
                </FieldGroup>
              </FormGroup>

              <ButtonGroup>
                <button type="submit">등록하기</button>
              </ButtonGroup>
            </fieldset>
          </Form>
        </Formik>
      </Content>
    </Container>
  )
}
