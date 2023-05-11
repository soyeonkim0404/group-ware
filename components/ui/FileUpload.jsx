import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { apiPostUploadTempFile } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import Loading from '@components/ui/Loading';

const FileUpload = ({ fileData, defaultValue, max, error }) => {
  const { defaultErrorHandler } = useErrorHandler();

  const [loading, setLoading] = useState(false);

  const [uploadFiles, setUploadFile] = useState([]);
  const maxLength = max || 3; //첨부파일 최대갯수
  const maxSize = 30; // mb
  const maxFileSize = maxSize * 1024 * 1024; // 30mb
  const availableMimeType = [
    'image/gif', // .gif
    'image/jpeg', // .jpg, .jpeg
    'image/png', // .png
    'application/zip', // .zip
    'application/x-7z-compressed', // .7z
    'application/pdf', // .pdf
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/haansoftxls', // .xls (한글 2010)
    'application/haansoftxlsx', // .xlsx (한글 2010)
    'application/haansoftppt', // .ppt (한글 2010)
    'application/haansoftpptx', // .pptx (한글 2010)
    'application/haansoftdoc', // .doc (한글 2010)
    'application/haansoftdocx', // .docx (한글 2010)
    'application/haansofthwp', // .hwp (한글 2010)
    'application/haansofthwpx', // .hwpx (한글 2010)
  ];

  useEffect(() => {
    if (defaultValue) setUploadFile(defaultValue);
  }, []);

  useEffect(() => {
    fileData(uploadFiles);
  }, [uploadFiles]);

  const handleFile = async (e) => {
    setLoading(true);

    try {
      await handleChange([...e.target.files]);
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = async (files) => {
    if (!files || files.length === 0) return;

    const uploaded = [...uploadFiles];

    if (!availableMimeType.includes(files[0].type)) {
      console.log(files[0].type);
      alert(`허용되지 않는 확장자 입니다.`);
      return false;
    }

    if (files[0].size > maxFileSize) {
      alert(`파일 크기는 개당 ${maxSize}MByte 이하만 업로드 할 수 있습니다.`);
      return false;
    }

    if (uploaded.length >= maxLength) {
      alert(`파일은 최대 ${maxLength}개만 등록 가능합니다.`);
      return false;
    }

    files.some(async (file) => {
      if (uploaded.findIndex((f) => f.originalFilename === file.name) === -1) {
        const response = await apiPostUploadTempFile({ file: file });

        file.id = response.data.id;
        file.path = response.data.path;
        file.originalFilename = response.data.originalFilename;
        file.savedFilename = response.data.savedFilename;
        file.fileFullPath = response.data.fileFullPath;
        file.fileSize = response.data.fileSize;
        file.extension = response.data.extension;

        setUploadFile((prevState) => [...prevState, file]);
      }
    });
  };
  const handleFileDelete = (index) => {
    setUploadFile((files) => {
      return files.filter((file, idx) => idx !== index);
    });
  };

  return (
    <>
      <SFileInput
        type="file"
        id="file"
        onChange={handleFile}
        accept={availableMimeType}
      />
      <label htmlFor="file">파일 첨부</label>
      {error ? (
        <SFileError>{error}</SFileError>
      ) : (
        <SFileDesc>파일은 최대 {maxLength}개만 등록 가능합니다.</SFileDesc>
      )}

      <SFileListWrap>
        <SUl>
          {uploadFiles.map((file, index) => {
            return (
              <li key={index}>
                {file.name || file.originalFilename}
                <button className="delete" onClick={() => handleFileDelete(index)}>
                  <MdClose />
                </button>
              </li>
            );
          })}
        </SUl>
      </SFileListWrap>
      {loading && <Loading />}
    </>
  );
};

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
    min-width: 95px;
    height: 36px;
    padding: 6px 16px;
    background-color: ${(p) => p.theme.black};
    color: ${(p) => p.theme.white};
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
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
const SFileListWrap = styled.div``;
const SFileDesc = styled.span`
  display: block;
  font-size: 11px;
  color: ${(p) => p.theme.gray40};
  margin-top: 10px;
`;
const SFileError = styled.span`
  display: block;
  font-size: 11px;
  color: ${(p) => p.theme.red};
  margin-top: 10px;
`;
const SUl = styled.ul`
  margin: 20px 0;
  li {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: ${(p) => p.theme.gray30};
    margin-right: 30px;
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 22px;
      height: 22px;
      cursor: pointer;
      margin-left: 10px;
      background: ${(p) => p.theme.gray50};
      border-radius: 100%;
      svg {
        font-size: 14px;
        color: ${(p) => p.theme.white};
      }
    }
  }
`;

FileUpload.defaultProps = {};

export default FileUpload;
