import React, { useState } from 'react';
import styled from 'styled-components';

const STab = styled.div`
  ul {
    display: flex;
    border-bottom: 1px solid ${(p) => p.theme.gray60};
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: auto;
      padding: 20px;
      cursor: pointer;
      transition: all 0.5s ease;
      &.active {
        position: relative;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 100%;
          height: 2px;
          left: 0;
          bottom: 0;
          background-color: ${(p) => p.theme.blue};
        }
      }
    }
  }
`;

const SContent = styled.div`
  text-align: left;
  padding: 30px;
  font-size: 16px;
`;

const Tab = ({ getData }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const selectTab = (index) => {
    setCurrentTab(index);
  };
  return (
    <>
      <STab>
        <ul>
          {getData.map((item, index) => (
            <li
              className={index === currentTab ? 'item active' : 'item'}
              onClick={() => selectTab(index)}
              key={index}
            >
              {item.tab}
            </li>
          ))}
        </ul>
      </STab>
      <SContent>
        <p>{getData[currentTab].content}</p>
      </SContent>
    </>
  );
};

export default Tab;
