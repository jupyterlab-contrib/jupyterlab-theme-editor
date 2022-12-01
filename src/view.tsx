import { VDomRenderer } from '@jupyterlab/apputils';
/*import { ReactWidget } from '@jupyterlab/apputils';*/
import { ThemeEditorModel } from './model';
import React from 'react';
import Form from '@rjsf/core';
/*import Select from "react-dropdown-select"*/

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

export class ThemeEditorView extends VDomRenderer<ThemeEditorModel> {
  public uiSchema: any;
  constructor(model: ThemeEditorModel) {
    super(model);
    this.uiSchema = {
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
      'border-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'border' }
      },
      'accent-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'accent' }
      },
      'brand-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'brand' }
      },
      'error-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'error' }
      },
      'info-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'info' }
      },
      'layout-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'layout' }
      },
      'success-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'success' }
      },
      'warn-color': {
        'ui:widget': this.colorPicker,
        'ui:options': { scope: 'warn' }
      }
    };
  }

  colorPicker = (props: any) => {
    const { scope } = props.options;
    return (
      <div>
        <input
          type="color"
          value={props.value}
          onChange={event => {
            this.model.setColor(scope, event.target.value);
          }}
        />
      </div>
    );
  };

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
