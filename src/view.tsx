import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import React from 'react';
import Form from '@rjsf/core';

export class ThemeEditorView extends VDomRenderer<ThemeEditorModel> {
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

  numberPicker = (props: any) => {
    const { scope } = props.options;
    return (
      <div>
        <input
          type="number"
          min="1"
          max="40"
          value={props.value}
          onChange={event => {
            this.model.setNumber(scope, event.target.valueAsNumber);
          }}
        />
      </div>
    );
  };

  render(): JSX.Element {
    return (
      <Form
        schema={{
          type: 'object',
          properties: {
            base: {
              type: 'object',
              title: 'Theme settings',
              properties: {
                'ui-font-size': {
                  title: 'UI Font size',
                  type: 'number',
                  default: 17
                },
                'content-font-size': {
                  title: 'Content font size',
                  type: 'number',
                  default: 15
                },
                'code-font-size': {
                  title: 'Code font size',
                  type: 'string',
                  default: 14
                },
                'border-width': {
                  title: 'Border width',
                  type: 'string',
                  default: 1
                },
                'border-radius': {
                  title: 'Border radius',
                  type: 'string',
                  default: 2
                },
                'accent-color': {
                  title: 'Accent color',
                  type: 'string'
                },
                'border-color': {
                  title: 'Border color',
                  type: 'string'
                },
                'brand-color': {
                  title: 'Brand color',
                  type: 'string',
                  default: ''
                },
                'error-color': {
                  title: 'Error color',
                  type: 'string'
                },
                'info-color': {
                  title: 'Info color',
                  type: 'string'
                },
                'layout-color': {
                  title: 'Layout color',
                  type: 'string'
                },
                'success-color': {
                  title: 'Success color',
                  type: 'string'
                },
                'warn-color': {
                  title: 'Warn color',
                  type: 'string'
                }
              }
            }
          }
        }}
        uiSchema={{
          classNames: 'form-class',
          base: {
            'ui-font-size': {
              'ui:widget': this.numberPicker,
              'ui:options': { scope: 'ui-font-size' }
            },
            'content-font-size': {
              'ui:widget': this.numberPicker,
              'ui:options': { scope: 'content-font-size' }
            },
            'code-font-size': {
              'ui:widget': this.numberPicker,
              'ui:options': { scope: 'code-font-size' }
            },
            'border-width': {
              'ui:widget': this.numberPicker,
              'ui:options': { scope: 'border-width' }
            },
            'border-radius': {
              'ui:widget': this.numberPicker,
              'ui:options': { scope: 'border-radius' }
            },
            'accent-color': {
              'ui:widget': this.colorPicker,
              'ui:options': { scope: 'accent' }
            },
            'border-color': {
              'ui:widget': this.colorPicker,
              'ui:options': { scope: 'border' }
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
          }
        }}
      />
    );
  }
}
