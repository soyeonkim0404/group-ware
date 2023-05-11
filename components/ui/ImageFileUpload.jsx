import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { MdClose, MdOutlineAdd } from 'react-icons/md';

const maxLength = 5; //첨부파일 최대갯수
const maxSize = 10; // megabyte
const maxFileSize = maxSize * 1024 * 1024;

const ImageFileUpload = () => {
  const [images, setImages] = useState([]);
  const handleFile = (e) => {
    const fileArray = [...e.target.files];
    handleChange(fileArray);
  };
  const handleChange = (files) => {
    const uploaded = [...images];

    if (files.size > maxFileSize) {
      alert(`파일 크기는 개당 ${maxSize}MByte 이하만 업로드 할 수 있습니다.`);
      return false;
    }

    if (uploaded.length >= maxLength) {
      alert(`파일은 최대 ${maxLength}개만 등록 가능합니다.`);
      return false;
    }

    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
    });

    setImages(uploaded);
  };
  const handleFileDelete = (index) => {
    setImages((files) => {
      return files.filter((file, idx) => idx !== index);
    });
  };
  return (
    <>
      <SFile>
        <SFileInput accept="image/*" type="file" id="imageFile" onChange={handleFile} />
        <label htmlFor="imageFile">
          <MdOutlineAdd />
        </label>
        <SUl>
          {images.map((file, index) => (
            <li key={index}>
              <Image
                src={URL.createObjectURL(file)}
                width={80}
                height={80}
                alt={`image${index}`}
                className="image"
              />
              <button className="delete" onClick={() => handleFileDelete(index)}>
                <MdClose />
              </button>
            </li>
          ))}
        </SUl>
      </SFile>
      <SFileDesc>파일은 최대 {maxLength}개만 등록 가능합니다.</SFileDesc>
    </>
  );
};

const SFile = styled.div`
  display: inline-flex;
  .mobile & {
    width: 100%;
    overflow: hidden;
  }
`;

const SFileInput = styled.input`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  width: 1px;
  & + label {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background-color: ${(p) => p.theme.gray60};
    color: ${(p) => p.theme.white};
    border-radius: 4px;
    font-size: 30px;
    user-select: none;
    cursor: pointer;
    box-sizing: border-box;
    &:focus,
    &:hover {
      opacity: 0.5;
    }
    &:focus {
      outline: 1px dotted ${(p) => p.theme.white};
    }
  }
`;

const SUl = styled.ul`
  display: inline-flex;
  margin-left: 10px;
  li {
    position: relative;
    width: 80px;
    height: 80px;
    > span {
      width: 80px !important;
      height: 80px !important;
    }
    img {
      border-radius: 4px;
    }
    .delete {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
      svg {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 20px;
        padding: 5px;
        color: ${(p) => p.theme.white};
      }
    }
    & + li {
      margin-left: 10px;
    }
  }
  .mobile & {
    width: calc(100% - 90px);
    overflow: hidden;
    overflow-x: auto;
  }
`;

const SFileDesc = styled.span`
  display: block;
  font-size: 11px;
  color: ${(p) => p.theme.gray40};
  margin-top: 10px;
`;

export default ImageFileUpload;
