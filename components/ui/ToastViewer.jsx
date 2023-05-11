import React from 'react';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import chart from '@toast-ui/editor-plugin-chart';
import '@toast-ui/chart/dist/toastui-chart.css';

import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

import uml from '@toast-ui/editor-plugin-uml';
import styled from 'styled-components';

const ToastViewer = (props) => {
  const chartOptions = {
    width: 'auto',
    height: 'auto',
    minWidth: 100,
    minHeight: 100,
    maxWidth: 600,
    maxHeight: 300,
  };

  return (
    <SToast>
      <Viewer
        initialValue={props.initialValue || ''}
        plugins={[[chart, chartOptions], codeSyntaxHighlight, uml]}
      />
    </SToast>
  );
};

const SToast = styled.div`
  h1,
  h2 {
    border-bottom: none !important;
  }

  .toastui-editor-contents {
    table {
      max-width: 100%;
      th {
      }
      td {
        min-width: 120px;
      }
    }
  }
`;

export default ToastViewer;
