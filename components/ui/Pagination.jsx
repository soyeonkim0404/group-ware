import styled from 'styled-components';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage } from 'react-icons/md';
import { useMediaQuery } from 'react-responsive';

const Pagination = ({ page, totalPages, getPage, setPage, initPage }) => {
  const mobile = useMediaQuery({ query: '(max-width:767px)' });
  page = mobile ? 5 : 10;
  const pageCount = page;
  const [currPage, setCurrPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(Math.ceil(currPage / pageCount));
  const lastNum =
    totalPages <= pageGroup * pageCount ? totalPages : pageGroup * pageCount;
  const firstNum = 1 + (pageGroup - 1) * pageCount;
  setPage = setPage == null ? () => {} : setPage;

  let listBtn = [];

  const handleGroup = (num) => {
    setCurrPage(num);
    setPageGroup(Math.ceil(num / pageCount));
  };

  useEffect(() => {
    setCurrPage(1);
  }, [initPage]);

  const handlePage = (params) => {
    if (typeof params === 'number') {
      setCurrPage(params);
      setPageGroup(Math.ceil(params / pageCount));
      scrollTop();
    } else {
      if (params === 'prev') {
        if (currPage > 1) {
          setCurrPage((prevPage) => {
            handleGroup(prevPage - 1);
            setPage(prevPage - 1);
            scrollTop();
            return prevPage - 1;
          });
        }
      }
      if (params === 'next') {
        if (currPage < totalPages) {
          setCurrPage((prevPage) => {
            handleGroup(prevPage + 1);
            setPage(prevPage + 1);
            scrollTop();
            return prevPage + 1;
          });
        }
      }
    }
  };

  for (let i = firstNum; i <= lastNum; i++) {
    listBtn.push(i);
  }
  useEffect(() => {
    listBtn = [];
    for (let i = firstNum; i <= lastNum; i++) {
      listBtn.push(i);
    }
    getPage(currPage);
  }, [currPage]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {totalPages > 0 && (
        <SPageWrap>
          <SPageBtnGroup>
            <SPageBtn
              onClick={() => {
                handleGroup(1);
                setPage(1);
              }}
              disabled={currPage === 1}
            >
              <MdFirstPage />
            </SPageBtn>
            <SPageBtn
              onClick={() => {
                handlePage('prev');
              }}
              disabled={currPage === 1}
            >
              <MdChevronLeft />
            </SPageBtn>
            {listBtn.map((el) => {
              return (
                <SPageBtn
                  key={el.toString()}
                  className={currPage === el && 'on'}
                  onClick={() => {
                    handlePage(el);
                  }}
                >
                  {el}
                </SPageBtn>
              );
            })}
            <SPageBtn
              onClick={() => {
                handlePage('next');
              }}
              disabled={currPage === totalPages}
            >
              <MdChevronRight />
            </SPageBtn>
            <SPageBtn
              onClick={() => {
                handleGroup(totalPages);
                setPage(totalPages);
              }}
              disabled={currPage === totalPages}
            >
              <MdLastPage />
            </SPageBtn>
          </SPageBtnGroup>
          <SPageNumGroup>
            <span className={'curr'}>{currPage}</span>
            <span>&nbsp;/ {totalPages}</span>
          </SPageNumGroup>
        </SPageWrap>
      )}
    </>
  );
};

const SPageBtnGroup = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

const SPageNumGroup = styled.div`
  margin-left: 20px;
  font-size: 16px;
  color: ${(p) => p.theme.gray10};
  span {
    display: inline-block;
    font-size: 16px;
    line-height: 1;
    &.curr {
      font-weight: 700;
    }
  }
  .mobile & {
    display: inline-block;
    margin: 10px 0 0;
    padding: 6px 10px;
    border-radius: 5px;
    background: ${(p) => p.theme.gray70};
    font-size: 0;
    line-height: 1;
    span {
      font-size: 14px;
    }
  }
`;

const SPageWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  .mobile & {
    display: block;
    margin-top: 30px;
    text-align: center;
  }
`;

const SPageBtn = styled.button.attrs(() => ({ type: 'button' }))`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0 5px;
  border: 1px solid ${(p) => p.theme.gray50};
  border-radius: 4px;
  padding: 10px 15px;
  background: ${(p) => p.theme.white};
  font-size: 14px;
  color: ${(p) => p.theme.gray10};
  line-height: 18px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover,
  &:focus {
    background: ${(p) => p.theme.gray90};
    box-shadow: ${(p) => p.theme.boxShadow};
  }
  &:disabled {
    cursor: default;
    opacity: 0.3;
  }
  &.on {
    border-color: ${(p) => p.theme.blue};
    background: ${(p) => p.theme.blue};
    font-weight: 700;
    color: #fff;
  }
  .mobile & {
    min-width: 20px;
    margin: 0;
    border: none;
    background: none;
    padding: 5px 10px;
    line-height: inherit;
    &.on {
      background: ${(p) => p.theme.blue};
    }
  }
`;

Pagination.propTypes = {
  page: PropTypes.number,
  getPage: PropTypes.func,
};
Pagination.defaultProps = {
  page: 5,
  getPage: function () {},
  initPage: 1,
  // 모바일이면 5, pc면 10
};

export default Pagination;
