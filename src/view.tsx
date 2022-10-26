import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import React from 'react';
import Form from '@rjsf/core';

export class ThemeEditorView extends VDomRenderer<ThemeEditorModel> {
  colorPicker = (props: any) => {
    const { options } = props;
    const { scope } = options;

    return (
      <input
        type="color"
        /*value={this.model.getColor(scope)}*/
        onChange={event => {
          this.model.setColor(scope, event.target.value);
        }}
      />
    );
  };

  numberPicker = (props: any) => {
    const { options } = props;
    const { scope } = options;
    return (
      <input
        type="number"
        min="1"
        max="20"
        onChange={event => {
          this.model.setNumber(scope, event.target.valueAsNumber);
        }}
      />
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
                'font-size': {
                  title: 'Font size',
                  type: 'string'
                },
                'border-width': {
                  title: 'Border width',
                  type: 'string'
                },
                'border-radius': {
                  title: 'Border radius',
                  type: 'string'
                },
                'accent-color': {
                  title: 'Accent color',
                  type: 'string'
                },
                'brand-color': {
                  title: 'Brand color',
                  type: 'string'
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
            'font-size': {
              'ui:widget': this.numberPicker,
              'ui:options': { scope: 'font-size' }
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
