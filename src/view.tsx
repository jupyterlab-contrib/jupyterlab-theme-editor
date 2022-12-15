import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import React, { useState } from 'react';
import Form from '@rjsf/core';
import { ChromePicker } from '@hello-pangea/color-picker';

interface IProps {
  formData: any;
  schema: any;
  uiSchema: any;
  setformData: (value: any) => void;
}

function FormComponent(props: IProps) {
  return (
    <Form
      schema={props.schema}
      formData={props.formData}
      uiSchema={props.uiSchema}
      onChange={event => {
        props.setformData(event.formData);
      }}
    />
  );
}

function ColorPicker(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="jp-theme-editor-button-color"
        style={{ backgroundColor: props.value }}
        onClick={() => {
          setOpen(!open);
        }}
      ></button>
      {open && (
        <ChromePicker
          className="jp-theme-editor-color-picker"
          color={props.value}
          onChange={color => props.onChange(color.hex)}
        />
      )}
    </>
  );
}

export class ThemeEditorView extends VDomRenderer<ThemeEditorModel> {
  public uiSchema: any;
  constructor(model: ThemeEditorModel) {
    super(model);
    this.addClass('jp-theme-editor-panel');
    this.uiSchema = {
      classNames: 'form-class',
      'ui:submitButtonOptions': {
        norender: true
      },
      'ui-font-size': {
        'ui:widget': 'range'
      },
      'content-font-size': {
        'ui:widget': 'range'
      },
      'code-font-size': {
        'ui:widget': 'range'
      },
      'border-width': {
        'ui:widget': 'range'
      },
      'border-radius': {
        'ui:widget': 'range'
      },
      'layout-color': {
        'ui:widget': ColorPicker
      },
      'accent-color': {
        'ui:widget': ColorPicker
      },
      'border-color': {
        'ui:widget': ColorPicker
      },
      'brand-color': {
        'ui:widget': ColorPicker
      },
      'error-color': {
        'ui:widget': ColorPicker
      },
      'info-color': {
        'ui:widget': ColorPicker
      },
      'success-color': {
        'ui:widget': ColorPicker
      },
      'warn-color': {
        'ui:widget': ColorPicker
      }
    };
  }
  render() {
    return (
      <FormComponent
        schema={this.model.schema}
        formData={this.model.formData}
        uiSchema={this.uiSchema}
        setformData={(value: any) => {
          this.model.formData = value;
        }}
      />
    );
  }
}
