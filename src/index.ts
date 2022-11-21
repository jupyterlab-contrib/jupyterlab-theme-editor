import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IThemeManager } from '@jupyterlab/apputils';
//import { settingsIcon } from '@jupyterlab/ui-components';
//import { MainAreaWidget } from '@jupyterlab/apputils';
import { ThemeEditorModel } from './model';
import { ThemeEditorView } from './view';
/*import { MyWidget } from './view';*/
import { IChangedArgs } from '@jupyterlab/coreutils';

/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-theme-editor:plugin',
  autoStart: true,
  requires: [IThemeManager],
  activate: (app: JupyterFrontEnd, themeManager: IThemeManager) => {
    const onThemeChanged = (
      themeManager: IThemeManager,
      changes: IChangedArgs<string, string | null, string>
    ) => {
      themeManager.themeChanged.disconnect(onThemeChanged);
      const model = new ThemeEditorModel();
      const view = new ThemeEditorView(model);
      view.addClass('jp-theme-editor-view-panel');
      view.title.label = 'Theme Editor';
      view.id = 'theme-editor';
      app.shell.add(view, 'left');
      console.log('JupyterLab extension jupyter-theme-editor is activated!');
    };
    themeManager.themeChanged.connect(onThemeChanged);
  }
};

export default plugin;
