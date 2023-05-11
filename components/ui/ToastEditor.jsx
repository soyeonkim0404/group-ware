import { apiPostMDImageFile } from '@api';
import useErrorHandler from '@lib/hooks/useErrorHandler';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '@components/ui/Loading';

import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';

import chart from '@toast-ui/editor-plugin-chart';
import '@toast-ui/chart/dist/toastui-chart.css';

import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import uml from '@toast-ui/editor-plugin-uml';
import styled from 'styled-components';

const ToastEditor = ({ initialValue, setEditor, changeEditor }) => {
  const editorRef = useRef();

  const { defaultErrorHandler } = useErrorHandler();

  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    editorRef.current.getInstance().setMarkdown(initialValue, false);
  }, [init]);

  useEffect(() => {
    setEditor(changeEditor);
    editorRef.current.getInstance().setMarkdown(changeEditor, false);
  }, [changeEditor]);

  const chartOptions = {
    width: 'auto',
    height: 'auto',
    minWidth: 100,
    minHeight: 100,
    maxWidth: 600,
    maxHeight: 300,
  };
  const colorSyntaxOptions = {
    preset: ['#FFE15D', '#F49D1A', '#DC3535', '#B01E68'],
  };

  const imageHook = async (blob, callback) => {
    setLoading(true);

    try {
      const response = await apiPostMDImageFile({ file: blob });
      const path =
        '/' +
        response.data.path +
        '/' +
        response.data.savedFilename +
        '.' +
        response.data.extension;
      callback(path, response.data.originalFilename);
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const onChangeEditor = () => {
    setEditor(editorRef.current.getInstance().getMarkdown());
  };

  return (
    <SToast>
      <Editor
        ref={editorRef}
        placeholder="마크다운을 사용하여 자유롭게 게시글을 작성해보아요"
        previewStyle="vertical"
        height="600px"
        initialEditType={
          /* 차트 플러그인을 사용한 경우 첫 로딩이 wysiwyg 모드이면 브라우저 에러 발생(버그) */
          (initialValue || '').includes('$$chart') ? 'markdown' : 'wysiwyg'
        }
        useCommandShortcut={true}
        hooks={{ addImageBlobHook: imageHook }}
        language={'ko-KR'}
        onLoad={(e) => setInit(true)}
        onChange={onChangeEditor}
        plugins={[
          [chart, chartOptions],
          codeSyntaxHighlight,
          [colorSyntax, colorSyntaxOptions],
          uml,
        ]}
      />
      {loading && <Loading />}
    </SToast>
  );
};

const SToast = styled.div`
  h1,
  h2 {
    border-bottom: none !important;
  }
`;

export default ToastEditor;
