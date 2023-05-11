import { useState, useEffect } from 'react';
import CheckBox from '@components/ui/CheckBox2';

function CheckBoxGroup({ checkObj, allText, setOption = null }) {
  const [originalChk, setOriginalChk] = useState(checkObj);
  const [modifiedChk, setModifiedChk] = useState(originalChk);
  const [all, setAll] = useState(false);
  const usableOptions = originalChk.list
    .map((each) => {
      return !each.disabled && each;
    })
    .filter((id) => id);
  useEffect(() => {
    if (usableOptions.length === modifiedChk.checked.length) {
      setAll(true);
    } else {
      setAll(false);
    }
    if (setOption) {
      setOption(modifiedChk);
    }
  }, [modifiedChk]);

  const onChange = (e) => {
    const { id, checked } = e.target;
    const modifiedOptions = modifiedChk.list.map((each) => {
      return each.id.toString() === id
        ? {
            ...each,
            checked: checked,
          }
        : each;
    });
    const modifiedCheckedArr = modifiedOptions.filter((it) => it.checked);

    setModifiedChk((prevState) => ({
      ...prevState,
      list: modifiedOptions,
      checked: modifiedCheckedArr,
    }));
    checkObj.list = modifiedOptions;
    checkObj.checked = modifiedCheckedArr;
  };

  const onAllChange = (e) => {
    if (usableOptions.length === modifiedChk.checked.length) {
      setModifiedChk((prevState) => ({
        ...prevState,
        checked: [],
        list: prevState.list.map((el) => {
          if (!el.disabled) {
            return { ...el, ...(el.checked = false) };
          } else {
            return { ...el };
          }
        }),
      }));
    } else {
      setModifiedChk((prevState) => ({
        ...prevState,
        checked: prevState.list
          .map((el) => {
            if (!el.disabled) {
              return el.id;
            }
          })
          .filter((id) => id),
        list: prevState.list.map((el) => {
          if (!el.disabled) {
            return { ...el, ...(el.checked = true) };
          } else {
            return { ...el };
          }
        }),
      }));
    }
  };

  return (
    <div>
      {allText && (
        <CheckBox
          key="allChk"
          checked={all}
          onChange={onAllChange}
          id={`allChk-${originalChk.name}`}
          name={originalChk.name}
          label={allText}
          allText={allText}
        />
      )}
      {modifiedChk.list &&
        modifiedChk.list
          ?.sort((a, b) => a.positionSort - b.positionSort)
          .map((user, idx) => (
            <CheckBox
              key={idx}
              id={user.id}
              name={originalChk.name}
              label={user.name}
              checked={user.checked ? user.checked : false}
              disabled={user.disabled}
              onChange={(e) => {
                onChange(e);
              }}
            >
              {user.organization && (
                <>
                  <span key={user.id} className="chk-option">
                    {user.organization}
                  </span>
                  <span className="chk-option">{user.position}</span>
                </>
              )}
            </CheckBox>
          ))}
    </div>
  );
}

export default CheckBoxGroup;
