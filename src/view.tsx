import { VDomRenderer } from '@jupyterlab/apputils';
import { ThemeEditorLightModel } from './model';
import React from 'react';

export class ThemeEditorLightView extends VDomRenderer<ThemeEditorLightModel> {
  render(): JSX.Element {
    return (
      <div>
        <label>
          <input
            type="color"
            value={this.model.baseColor}
            onChange={event => {
              this.model.baseColor = event.target.value;
            }}
          ></input>
        </label>
      </div>
    );
  }
}
