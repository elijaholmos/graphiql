import {
  DocsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Dropdown,
  EditorContext,
  EditorContextProvider,
  ExecuteButton,
  ExecutionContext,
  ExecutionContextProvider,
  ExplorerContext,
  ExplorerContextProvider,
  History,
  HistoryContext,
  HistoryContextProvider,
  HistoryIcon,
  ImagePreview,
  KeyboardShortcutIcon,
  onHasCompletion,
  PlayIcon,
  PrettifyIcon,
  SchemaContext,
  SchemaContextProvider,
  SettingsIcon,
  StopIcon,
  StorageContext,
  StorageContextProvider,
  ToolbarButton,
  UnstyledButton,
  useAutoCompleteLeafs,
  useCopyQuery,
  useDragResize,
  useEditorContext,
  useExecutionContext,
  useExplorerContext,
  useHistoryContext,
  useMergeQuery,
  usePrettifyEditors,
  useSchemaContext,
  useSelectHistoryItem,
  useStorageContext,
  HeaderEditor as _HeaderEditor,
  QueryEditor as _QueryEditor,
  ResponseEditor as _ResponseEditor,
  VariableEditor as _VariableEditor,
  useHeaderEditor as _useHeaderEditor,
  useQueryEditor as _useQueryEditor,
  useResponseEditor as _useResponseEditor,
  useVariableEditor as _useVariableEditor,
} from '@graphiql/react';
import type {
  EditorContextType,
  ExecutionContextType,
  ExplorerContextType,
  ExplorerFieldDef,
  ExplorerNavStack,
  ExplorerNavStackItem,
  HistoryContextType,
  ResponseTooltipType,
  SchemaContextType,
  StorageContextType,
  TabsState,
  UseHeaderEditorArgs,
  UseResponseEditorArgs,
  UseQueryEditorArgs,
  UseVariableEditorArgs,
} from '@graphiql/react';
import React, { useEffect, useRef, useState } from 'react';

export {
  DocsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Dropdown,
  EditorContext,
  EditorContextProvider,
  ExecuteButton,
  ExecutionContext,
  ExecutionContextProvider,
  ExplorerContext,
  ExplorerContextProvider,
  History,
  HistoryContext,
  HistoryContextProvider,
  HistoryIcon,
  ImagePreview,
  KeyboardShortcutIcon,
  onHasCompletion,
  PlayIcon,
  PrettifyIcon,
  SchemaContext,
  SchemaContextProvider,
  SettingsIcon,
  StopIcon,
  StorageContext,
  StorageContextProvider,
  ToolbarButton,
  UnstyledButton,
  useAutoCompleteLeafs,
  useCopyQuery,
  useDragResize,
  useEditorContext,
  useExecutionContext,
  useExplorerContext,
  useHistoryContext,
  useMergeQuery,
  usePrettifyEditors,
  useSchemaContext,
  useSelectHistoryItem,
  useStorageContext,
};

export type {
  EditorContextType,
  ExecutionContextType,
  ExplorerContextType,
  ExplorerFieldDef,
  ExplorerNavStack,
  ExplorerNavStackItem,
  HistoryContextType,
  ResponseTooltipType,
  SchemaContextType,
  StorageContextType,
  TabsState,
  UseHeaderEditorArgs,
  UseResponseEditorArgs,
  UseQueryEditorArgs,
  UseVariableEditorArgs,
};

type Name = 'query' | 'variable' | 'header' | 'response';

const NAME_TO_INITIAL_VALUE: Record<
  Name,
  'initialQuery' | 'initialVariables' | 'initialHeaders' | undefined
> = {
  query: 'initialQuery',
  variable: 'initialVariables',
  header: 'initialHeaders',
  response: undefined,
};

function useMockedEditor(
  name: Name,
  value?: string,
  onEdit?: (newValue: string) => void,
) {
  const editorContext = useEditorContext({ nonNull: true });
  const [code, setCode] = useState(
    value ?? editorContext[NAME_TO_INITIAL_VALUE[name]],
  );
  const ref = useRef<HTMLDivElement>(null);

  const setEditor =
    editorContext[`set${name.slice(0, 1).toUpperCase()}${name.slice(1)}Editor`];

  const getValueRef = useRef<() => string>();
  useEffect(() => {
    getValueRef.current = () => code;
  }, [code]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (ref.current.childElementCount > 0) {
      return;
    }

    const mockGutter = document.createElement('div');
    mockGutter.className = 'CodeMirror-gutter';

    const mockTextArea = document.createElement('textarea');
    mockTextArea.className = 'mockCodeMirror';

    const mockWrapper = document.createElement('div');
    mockWrapper.appendChild(mockGutter);
    mockWrapper.appendChild(mockTextArea);

    ref.current.appendChild(mockWrapper);

    setEditor({
      getValue() {
        return getValueRef.current();
      },
      setValue(newValue: string) {
        setCode(newValue);
      },
      refresh() {},
    });
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const textarea = ref.current.querySelector('.mockCodeMirror');
    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }

    function handleChange(event: Event) {
      const newValue = (event.target as HTMLTextAreaElement).value;
      setCode(newValue);
      onEdit?.(newValue);
    }

    textarea.addEventListener('change', handleChange);
    return () => textarea.removeEventListener('change', handleChange);
  }, [onEdit]);

  useEffect(() => {
    if (value) {
      setCode(value);
    }
  }, [value]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const textarea = ref.current.querySelector('.mockCodeMirror');
    if (!(textarea instanceof HTMLTextAreaElement)) {
      return;
    }

    textarea.value = code;
  }, [code]);

  return ref;
}

export const useHeaderEditor: typeof _useHeaderEditor = function useHeaderEditor({
  onEdit,
}) {
  return useMockedEditor('header', undefined, onEdit);
};

export const useQueryEditor: typeof _useQueryEditor = function useQueryEditor({
  onEdit,
}) {
  return useMockedEditor('query', undefined, onEdit);
};

export const useResponseEditor: typeof _useResponseEditor = function useResponseEditor({
  value,
}) {
  return useMockedEditor('response', value);
};

export const useVariableEditor: typeof _useVariableEditor = function useVariableEditor({
  onEdit,
}) {
  return useMockedEditor('variable', undefined, onEdit);
};

export const HeaderEditor: typeof _HeaderEditor = function HeaderEditor(props) {
  const ref = useHeaderEditor(props);
  return <div ref={ref} />;
};

export const QueryEditor: typeof _QueryEditor = function QueryEditor(props) {
  const ref = useQueryEditor(props);
  return <div data-testid="query-editor" ref={ref} />;
};

export const ResponseEditor: typeof _ResponseEditor = function ResponseEditor(
  props,
) {
  const ref = useResponseEditor(props);
  return <div ref={ref} />;
};

export const VariableEditor: typeof _VariableEditor = function VariableEditor(
  props,
) {
  const ref = useVariableEditor(props);
  return <div ref={ref} />;
};