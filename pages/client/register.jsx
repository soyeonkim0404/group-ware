import { useForm, FormProvider } from 'react-hook-form';
import Card, { CardLayout } from '@components/ui/Card';
import styled from 'styled-components';
import FormInput from '@components/ui/FormInput';
import FileUpload from '@components/ui/FileUpload';
import React, { useState } from 'react';
import FormSelect from '@components/ui/FormSelect';
import { apiRegisterClient, parallelApi } from '@api';
import Button from '@components/ui/Button';
import withGetServerSideProps from '@lib/withGetServerSideProps';
import { useRouter } from 'next/router';
import banks from '@lib/banks';
import useModals from '@lib/hooks/useModals';
import { modals } from '@components/ui/modals';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Loading from '@components/ui/Loading';
import { MdRemove } from 'react-icons/md';

const Register = ({ businessTypes }) => {
  const methods = useForm();

  const router = useRouter();

  const { openedModal, closeModal } = useModals();

  const [files, setFiles] = useState();
  const [loading, setLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [errorMsg, setErrorMsg] = useState({});

  const onSubmit = async (data) => {
    const _bankList = _.cloneDeep(bankList);
    const _staffList = _.cloneDeep(staffList);

    data.bank = Object.keys(_bankList).map((_) => {
      delete _bankList[_].key;
      return _bankList[_];
    });
    data.staff = Object.keys(_staffList).map((_) => {
      delete _staffList[_].key;
      return _staffList[_];
    });
    data.files = files;

    setLoading(true);
    apiRegisterClient(data)
      .then(() => {
        openedModal(modals.Alert, {
          text: { body: '저장되었습니다.' },
          onClose: () => {
            closeModal(modals.Alert);
            router.push('/client');
          },
        });
      })
      .catch((err) => {
        setErrorMsg(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 주소 검색 핸들러
  const openPostHandler = (e) => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = ''; // 주소 변수
        let extraAddr = ''; // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다. R은 도로명 주소
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
          // 조합된 참고항목을 해당 필드에 넣는다.
          addr += extraAddr;
        }

        methods.setValue('address', addr);
      },
    }).open();
  };

  const addBank = (e) => {
    setBankList((prevState) => [
      { key: uuidv4(), bankCode: '', bankName: '', account: '', name: '' },
      ...prevState,
    ]);
  };

  const removeBank = (item) => {
    setBankList((prevState) => [...prevState.filter((o) => o.key !== item.key)]);
  };

  const addStaff = (e) => {
    setStaffList((prevState) => [
      { key: uuidv4(), name: '', email: '', mobilePhone: '', innerPhone: '', fax: '' },
      ...prevState,
    ]);
  };

  const removeStaff = (item) => {
    setStaffList((prevState) => [...prevState.filter((o) => o.key !== item.key)]);
  };

  return (
    <>
      <FormProvider {...methods}>
        <CardLayout>
          <Card col="12">
            <Card.Head>
              <Card.Title>거래처 정보</Card.Title>
            </Card.Head>
            <Card.Body>
              <SFormList>
                <li>
                  <FormSelect
                    getSelectData={businessTypes}
                    labelId="business-types"
                    selectId="businessType"
                    label="사업 유형"
                    error={errorMsg}
                    required={true}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="companyNameKr"
                    label="회사명(국)"
                    length={85}
                    max={255}
                    error={errorMsg}
                    required={true}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="companyNameEn"
                    label="회사명(영)"
                    length={85}
                    max={255}
                    error={errorMsg}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="businessNumber"
                    label="사업자번호"
                    length={12}
                    max={255}
                    placeholder="000-00-00000"
                    pattern={/(^(\d{3})-(\d{2})-\d{5}$)/}
                    patternMessage={'올바르지 않은 형식입니다.'}
                    error={errorMsg}
                    required={true}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="phone"
                    label="대표번호"
                    length={12}
                    max={255}
                    placeholder="00-0000-0000"
                    error={errorMsg}
                  />
                </li>
                <li>
                  <FormInput
                    inputId="fax"
                    label="팩스"
                    length={12}
                    max={255}
                    placeholder="00-0000-0000"
                    error={errorMsg}
                  />
                </li>
              </SFormList>
              <SFormList>
                <li className="width-half">
                  <FormInput
                    inputId="ceoName"
                    label="대표자명"
                    length={85}
                    max={255}
                    error={errorMsg}
                    required={true}
                  />
                </li>
                <li className="width-half">
                  <FormInput
                    inputId="mainBusiness"
                    label="주요 업무"
                    length={85}
                    max={255}
                    error={errorMsg}
                  />
                </li>
              </SFormList>
              <SFormList>
                <SInputNButton>
                  <FormInput
                    inputId="address"
                    byte={255}
                    max={255}
                    placeholder="주소를 검색해주세요."
                    error={errorMsg}
                    disabled
                  />
                  <Button color="gray" size="large" onClick={openPostHandler}>
                    주소 검색
                  </Button>
                </SInputNButton>
                <li className="width-half">
                  <FormInput
                    inputId="detailAddress"
                    label="상세 주소"
                    length={333}
                    error={errorMsg}
                  />
                </li>
              </SFormList>
              <SFileLoad>
                <FileUpload fileData={(data) => setFiles(data)} />
              </SFileLoad>
            </Card.Body>
          </Card>

          {/*은행 영역*/}
          <Card col="6">
            <Card.Head>
              <Card.Title>은행</Card.Title>
            </Card.Head>
            <Card.Body>
              <SBtnTop>
                <Button onClick={addBank}>추가</Button>
              </SBtnTop>
              <SList>
                {bankList &&
                  bankList.map((item) => {
                    const fieldName = `bank[${item.key}]`;
                    return (
                      <li key={fieldName} className="item">
                        <div className="options">
                          <FormSelect
                            getSelectData={banks}
                            selectId={`${fieldName}.bankCode`}
                            label="금융기관"
                            value={item.bankCode}
                            onChange={(e) =>
                              setBankList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        bankCode: e.target.value,
                                        bankName:
                                          banks.find((o) => o.code === e.target.value)
                                            ?.name || '',
                                      }
                                    : { ...state }
                                )
                              )
                            }
                            error={errorMsg}
                            required={true}
                          />
                          <FormInput
                            inputId={`${fieldName}.account`}
                            label="계좌번호"
                            length={33}
                            required={true}
                            error={errorMsg}
                            onChangeEvent={(e) =>
                              setBankList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        account: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <FormInput
                            inputId={`${fieldName}.name`}
                            label="예금주"
                            length={16}
                            required={true}
                            error={errorMsg}
                            onChangeEvent={(e) =>
                              setBankList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        name: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <Button
                            icon="40"
                            color="lightGray"
                            onClick={(e) => removeBank(item)}
                          >
                            <MdRemove />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
              </SList>
            </Card.Body>
          </Card>

          {/*스태프 영역*/}
          <Card col="6">
            <Card.Head>
              <Card.Title>담당자</Card.Title>
            </Card.Head>
            <Card.Body>
              <SBtnTop>
                <Button onClick={addStaff}>추가</Button>
              </SBtnTop>
              <SList>
                {staffList &&
                  staffList.map((item) => {
                    const fieldName = `staff[${item.key}]`;
                    return (
                      <li key={fieldName} className="item">
                        <div className="options">
                          <FormInput
                            inputId={`${fieldName}.name`}
                            label="이름"
                            length={16}
                            error={errorMsg}
                            required={true}
                            onChangeEvent={(e) =>
                              setStaffList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        name: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <FormInput
                            inputId={`${fieldName}.email`}
                            label="이메일"
                            length={50}
                            placeholder="emotion@emotion.co.kr"
                            error={errorMsg}
                            onChangeEvent={(e) =>
                              setStaffList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        email: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                        </div>
                        <div className="options">
                          <FormInput
                            inputId={`${fieldName}.mobilePhone`}
                            label="휴대폰"
                            length={20}
                            placeholder="000-0000-0000"
                            error={errorMsg}
                            onChangeEvent={(e) =>
                              setStaffList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        mobilePhone: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <FormInput
                            inputId={`${fieldName}.innerPhone`}
                            label="내선번호"
                            length={20}
                            placeholder="00{0}-000-0000"
                            error={errorMsg}
                            onChangeEvent={(e) =>
                              setStaffList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        innerPhone: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <FormInput
                            inputId={`${fieldName}.fax`}
                            label="팩스"
                            length={20}
                            placeholder="00{0}-000-0000"
                            error={errorMsg}
                            onChangeEvent={(e) =>
                              setStaffList((prevState) =>
                                prevState.map((state) =>
                                  state.key === item.key
                                    ? {
                                        ...state,
                                        fax: e.target.value,
                                      }
                                    : { ...state }
                                )
                              )
                            }
                          />
                          <Button
                            icon="40"
                            color="lightGray"
                            onClick={(e) => removeStaff(item)}
                          >
                            <MdRemove />
                          </Button>
                        </div>
                      </li>
                    );
                  })}
              </SList>
            </Card.Body>
          </Card>
        </CardLayout>
        <Button.Wrap>
          <Button.Group>
            <Button color="gray" size="large" link={'/client'}>
              목록
            </Button>
            <Button
              type="submit"
              color="blue"
              size="large"
              menuCode="MN009"
              auth="W"
              onClick={methods.handleSubmit(onSubmit, (err) => setErrorMsg(err))}
            >
              등록
            </Button>
          </Button.Group>
        </Button.Wrap>
        {loading && <Loading />}
      </FormProvider>
    </>
  );
};

const SList = styled.ul`
  li {
    .options {
      display: flex;
      width: 100%;
      align-items: center;
      button {
        flex: 0 0 40px;
        width: 40px;
        margin-left: 20px;
        margin-top: -20px;
        background: ${(p) => p.theme.gray50};
      }
      .mobile & {
        label + label {
        }
        .select + label {
          margin-left: 20px;
        }
      }
    }
  }
`;

const SBtnTop = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`;

const SFormList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  li {
    flex: 0 1 32%;
    width: 32%;
    margin-top: 5px;
    .select {
      width: 100%;
    }
    &.width-half {
      flex: 0 1 49%;
      width: 49%;
    }
  }
  li.delete-btn {
    button {
      width: 100%;
      height: 50px;
    }
  }
  @media screen and (max-width: 1460px) {
    gap: 0;
    li {
      flex: 0 0 100% !important;
      width: 100% !important;
      margin-top: 0;
    }
  }
`;

const SFileLoad = styled.div`
  width: 100%;
  margin-top: 10px;
  padding-top: 20px;
  padding-left: 10px;
  border-top: 1px solid ${(p) => p.theme.gray70};
`;

const SInputNButton = styled.li`
  display: flex;
  align-items: center;
  flex: 0 0 49% !important;
  width: 49% !important;
  button {
    margin-left: 10px;
  }
`;

export const getServerSideProps = withGetServerSideProps(async (context) => {
  const parallelData = [
    {
      name: 'businessTypes',
      url: '/api/v1/code/select/business/type',
      method: 'get',
    },
  ];

  const response = await parallelApi(parallelData, context);

  return { props: { businessTypes: response['businessTypes'] } };
});

export default Register;
