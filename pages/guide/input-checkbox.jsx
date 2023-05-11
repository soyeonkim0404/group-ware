import React, { useState, useEffect } from 'react';
import Card, { CardLayout } from '@components/ui/Card';
import CheckBox from '@components/ui/CheckBox';
import { inputOption, inputOption2, inputOption3 } from '@data/dummy';

const InputCheckbox = () => {
  const [check, setChecked] = useState([]);
  const [check2, setChecked2] = useState([]);
  const [check3, setChecked3] = useState([]);

  useEffect(() => {
    setChecked(inputOption);
    setChecked2(inputOption2);
    setChecked3(inputOption3);
  }, []);

  const onChange = (e) => {
    const { id, checked } = e.target;
    let arrayChk = check.map((v) => (v.id === id ? { ...v, checked: checked } : v));
    setChecked(arrayChk);
  };

  const onChange2 = (e) => {
    const { id, checked } = e.target;
    let arrayChk2 = [];

    if (id === 'allChk') {
      arrayChk2 = check2.map((val) => {
        return { ...val, checked: checked };
      });
    } else {
      arrayChk2 = check2.map((val) =>
        val.id === id ? { ...val, checked: checked } : val
      );
    }
    let resultArray = arrayChk2.filter((item) => item.checked);
    setChecked2(arrayChk2);
  };

  const onChange3 = (e) => {
    const { id, checked } = e.target;
    let arrayChk3 = [];
    if (id === 'allChk2') {
      arrayChk3 = check3.map((val) => {
        if (!val.disabled) {
          return { ...val, ...(val.checked = false) };
        } else {
          return { ...val, checked: checked };
        }
        //return { ...val, checked: checked };
      });
    } else {
      arrayChk3 = check3.map((val) => {
        return val.id === id ? { ...val, checked: checked } : val;
      });
    }
    setChecked3(arrayChk3);
  };

  return (
    <>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>Checkbox</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              {check.map((user, idx) => (
                <CheckBox
                  key={idx}
                  id={user.id}
                  checked={user?.checked}
                  onChange={onChange}
                  label={user.label}
                  disabled={user.disabled}
                />
              ))}
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>All Checkbox</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <CheckBox
                checked={!check2.some((item) => item?.checked !== true)}
                onChange={onChange2}
                label="전체"
                id="allChk"
              />
              {check2.map((item, idx) => (
                <CheckBox
                  key={idx}
                  id={item.id}
                  checked={item?.checked}
                  onChange={onChange2}
                  label={item.label}
                  disabled={item.disabled}
                />
              ))}
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
      <CardLayout>
        <Card col="12">
          <Card.Head>
            <Card.Title>disabled, checked</Card.Title>
          </Card.Head>
          <Card.Body>
            <form>
              <CheckBox onChange={onChange3} label="전체" id="allChk2" />
              {check3.map((item, idx) => (
                <CheckBox
                  key={idx}
                  id={item.id}
                  checked={item?.checked || false}
                  onChange={onChange3}
                  label={item.label}
                  disabled={item.disabled}
                />
              ))}
            </form>
          </Card.Body>
        </Card>
      </CardLayout>
    </>
  );
};

export default InputCheckbox;
