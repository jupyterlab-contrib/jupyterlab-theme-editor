import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import React from 'react';
import Form from '@rjsf/core';
import { SketchPicker } from '@hello-pangea/color-picker';

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

function colorPicker(props: any) {
  return (
    <div>
      <SketchPicker
        color={props.value}
        onChangeComplete={color => props.onChange(props.value)}
      />
    </div>
  );
}

export class ThemeEditorView extends VDomRenderer<ThemeEditorModel> {
  public uiSchema: any;
  constructor(model: ThemeEditorModel) {
    super(model);
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
        'ui:widget': colorPicker
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
          this.update();
        }}
      />
    );
  }
}
