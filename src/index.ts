import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IThemeManager } from '@jupyterlab/apputils';
import { themeEditorIcon } from './icons';
import { ThemeEditorModel } from './model';
import { ThemeEditorView } from './view';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { requestAPI } from './handler';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-theme-editor:plugin',
  autoStart: true,
  requires: [IThemeManager, ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    settings: ISettingRegistry
  ) => {
    const { commands } = app;
    const command = 'jlab-examples:main-menu';
    commands.addCommand(command, {
      label: 'Execute jlab-examples:main-menu Command',
      caption: 'Execute jlab-examples:main-menu Command',
      execute: (args: any) => {
        console.log(
          `jlab-examples:main-menu has been called ${args['origin']}.`
        );
        window.alert(
          `jlab-examples:main-menu has been called ${args['origin']}.`
        );
      }
    });
    const onThemeChanged = (
      themeManager: IThemeManager,
      changes: IChangedArgs<string, string | null, string>
    ) => {
      themeManager.themeChanged.disconnect(onThemeChanged);

      const model = new ThemeEditorModel();
      const view = new ThemeEditorView(model);
      view.addClass('jp-theme-editor-view-panel');
      view.id = 'theme-editor';
      view.title.icon = themeEditorIcon;
      app.shell.add(view, 'left');

      console.log('JupyterLab extension jupyter-theme-editor is activated!');
    };
    themeManager.themeChanged.connect(onThemeChanged);
    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyter_theme_editor server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default plugin;
