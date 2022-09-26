import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
//import { settingsIcon } from '@jupyterlab/ui-components';
//import { MainAreaWidget } from '@jupyterlab/apputils';
import { ThemeEditorLightModel } from './model';
import { ThemeEditorLightView } from './view';

/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-theme-editor:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const view = new ThemeEditorLightView(new ThemeEditorLightModel());
    view.addClass('jp-themeEditorViewPanel');
    view.title.label = 'Theme Editor';
    //view.title.icon = settingsIcon;
    view.id = 'theme-editor';
    app.shell.add(view, 'left');
    console.log('JupyterLab extension jupyter-theme-editor is activated!');
  }
};

export default plugin;
