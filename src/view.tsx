import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import React, { useState } from 'react';
import Form from '@rjsf/core';
import { ChromePicker } from '@hello-pangea/color-picker';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';

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
        type="button"
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
  public translator: ITranslator;

  constructor(model: ThemeEditorModel, translator: ITranslator) {
    super(model);
    this.translator = translator;
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
    const trans = (this.translator ?? nullTranslator).load(
      'jupyter_theme_editor'
    );
    return (
      <>
        <div className="jp-Toolbar">
          <button
            onClick={() => {console.log('Export button has been pressed')}}
            title={trans.__('Export the styles as a stylesheet.')}
          >
            {trans.__('Export')}
          </button>
          <button
            onClick={() => {console.log('Save button has been pressed')}}
            title={trans.__('Save the styles in the settings.')}
          >
            {trans.__('Save')}
          </button>
        </div>
        <FormComponent
          schema={this.model.schema}
          formData={this.model.formData}
          uiSchema={this.uiSchema}
          setformData={(value: any) => {
            this.model.formData = value;
          }}
        />
      </>
    );
  }
}
