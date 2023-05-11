import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { MdOutlineCameraAlt, MdOutlinePersonOutline } from 'react-icons/md';
import { apiPostUploadTempFile } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';

const ProfileImage = (props) => {
  const imgSrc = props.src ? props.src : '';
  const [uploadProfile, setUploadProfile] = useState();
  const { defaultErrorHandle } = useErrorHandler();

  useEffect(() => {
    if (props?.src) setUploadProfile(props.src);
  }, []);
  // 이미지 핸들러
  const handleImageFile = async (e) => {
    try {
      const resp = await apiPostUploadTempFile({ file: e.target.files[0] });
      setUploadProfile(resp.data.fileFullPath);

      if (typeof props?.callback === 'function') props?.callback(resp.data);
    } catch (err) {
      defaultErrorHandle(err);
    }
  };

  return (
    <SFileWrap size={props.size}>
      <SFile size={props.size}>
        <SFileInput
          accept="image/*"
          type="file"
          id="fileImage"
          onChange={handleImageFile}
          size={props.size}
        />
        <label htmlFor="fileImage">
          <MdOutlineCameraAlt />
        </label>
        {imgSrc || uploadProfile ? (
          <Image
            width={parseInt(props.size)}
            height={parseInt(props.size)}
            src={uploadProfile ? uploadProfile : imgSrc}
            alt="preview"
            className="preview"
          />
        ) : (
          <span className="default">
            <MdOutlinePersonOutline />
          </span>
        )}
      </SFile>
      <SFileDesc>파일은 최대 1개만 등록 가능합니다.</SFileDesc>
    </SFileWrap>
  );
};

const SFileWrap = styled.div`
  max-width: ${(props) => props.size}px;
`;
const SFile = styled.div`
  position: relative;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  .default {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 100%;
    background: ${(p) => p.theme.gray80};
    svg {
      color: ${(p) => p.theme.gray50};
      font-size: calc(${(props) => props.size}px / 3);
    }
  }

  .preview {
    border-radius: 100%;
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
    position: absolute;
    bottom: 3px;
    right: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(${(props) => props.size}px / 4);
    height: calc(${(props) => props.size}px / 4);
    background-color: ${(p) => p.theme.gray50};
    color: ${(p) => p.theme.white};
    border-radius: 100%;
    font-size: calc(${(props) => props.size}px / 8);
    user-select: none;
    cursor: pointer;
    box-sizing: border-box;
    z-index: 2;
  }
`;

const SFileDesc = styled.span`
  display: block;
  text-align: center;
  font-size: 11px;
  color: ${(p) => p.theme.gray40};
  margin-top: 20px;
`;

export default ProfileImage;
