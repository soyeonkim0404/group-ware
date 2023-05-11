import ReactModal from 'react-modal';
import ModalComponents from '@components/ui/modals/index';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import React, { useContext, useEffect, useState } from 'react';
import { getEmployeeALl } from '@api';
import Loading from '@components/ui/Loading';
import CheckBoxGroup from '@components/ui/CheckBoxGroup';
import _ from 'lodash';
import { ReadyContext } from '@lib/context/ReadyContext';
import useErrorHandler from '@lib/hooks/useErrorHandler';

const RegisterMember = ({ onClose, onSubmit, text, size }) => {
  const [data, setData] = useState(_.clone(text.data));
  const [employee, setEmployee] = useState({
    name: '',
    checked: [],
    list: [],
  });
  const { defaultErrorHandler } = useErrorHandler();
  const [isReady, setReady] = useContext(ReadyContext);

  // 직원 정보 조회
  const getEmployeeAll = () => {
    setReady(false);
    // depth가 3이면 본부, 4이면 팀
    const paramCode = data.depth == 3 ? data.code : data.parentCode;
    getEmployeeALl({ organization: paramCode })
      .then((res) => {
        // 등록된 팀원과 조회된 팀원에서 제외
        if (
          res.data &&
          res.data.length > 0 &&
          data.memberList &&
          data.memberList.length > 0
        ) {
          loop: for (let i = 0; i < res.data.length; ) {
            for (let j = 0; j < data.memberList.length; j++) {
              if (res.data[i].id == data.memberList[j].userId) {
                res.data.splice(i, 1);
                i = 0;
                continue loop;
              }
            }
            i++;
          }
        }

        setEmployee({
          name: 'chkList',
          checked: [],
          list: res.data,
        });

        setReady(true);
      })
      .catch((err) => {
        defaultErrorHandler(err);
      });
  };

  // 조직원 등록시
  const onSubmitModal = () => {
    onSubmit(employee.checked);
  };

  useEffect(() => {
    getEmployeeAll();
  }, []);

  return (
    <ReactModal onRequestClose={onClose}>
      <div className={`modal-wrap ${size}`}>
        <ModalComponents.Header closeButton={onClose}>
          {text.header}
        </ModalComponents.Header>
        <ModalComponents.Body>
          <Input.Group>
            <Input
              name="부문"
              label="부문"
              value={text.sectorName}
              placeholder="사업부를 입력해주세요"
              readonly
            />
            <Input
              name="본부"
              label="본부"
              value={text.hqName}
              placeholder="본부명을 입력해주세요"
              readonly
            />
          </Input.Group>
          <div className="modal-department-option">
            {isReady ? (
              employee.list?.length > 0 ? (
                <>
                  <div className="tit">팀원을 선택해주세요.</div>
                  <div className="members">
                    <CheckBoxGroup checkObj={employee} />
                  </div>
                </>
              ) : (
                <div className="tit">해당 본부에 속한 직원이 없습니다.</div>
              )
            ) : null}
          </div>
        </ModalComponents.Body>
        <ModalComponents.Footer align="right">
          <Button onClick={onSubmitModal} color="gray">
            등록
          </Button>
        </ModalComponents.Footer>
      </div>
    </ReactModal>
  );
};

export default RegisterMember;
