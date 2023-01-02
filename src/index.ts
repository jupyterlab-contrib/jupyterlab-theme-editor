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
/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-theme-editor:plugin',
  autoStart: true,
  requires: [IThemeManager],
  activate: async (app: JupyterFrontEnd, themeManager: IThemeManager) => {
    const onThemeChanged = (
      themeManager: IThemeManager,
      changes: IChangedArgs<string, string | null, string>
    ) => {
      themeManager.themeChanged.disconnect(onThemeChanged);

      /*  const model = new ThemeEditorModel();
      const view = new ThemeEditorView(model);
      view.addClass('jp-theme-editor-view-panel');
      view.id = 'theme-editor';
      view.title.icon = themeEditorIcon;
      app.shell.add(view, 'left'); */
      // POST request

      /* requestAPI('get_example', {
        body: JSON.stringify(model.formData),
        method: 'POST'
      })
        .then(data => {
          console.log(data);
        })
        .catch(reason => {
          console.error(
            `The jupyter_theme_editor server extension appears to be missing.\n${reason}`
          );
        }); */

      console.log(
        'JupyterLab server extension jupyter-theme-editor is activated!'
      );
    };
    themeManager.themeChanged.connect(onThemeChanged);
    const model = new ThemeEditorModel();
    const view = new ThemeEditorView(model);
    view.addClass('jp-theme-editor-view-panel');
    view.id = 'theme-editor';
    view.title.icon = themeEditorIcon;
    app.shell.add(view, 'left');

    requestAPI('get_example', {
      body: JSON.stringify(model.formData),
      method: 'POST'
    })
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The jupyter_theme_editor server extension appears to be missing.\n${reason}`
        );
      });

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
