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

const PLUGIN_ID = 'jupyter-theme-editor:plugin';

/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [IThemeManager],
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    settings: ISettingRegistry
  ) => {
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

      /**
       * Load the settings for this extension
       *
       * @param setting Extension settings
       */

      function loadSetting(setting: ISettingRegistry.ISettings): void {
        // Read the settings and convert to the correct type
        const settingsValues: any = {};
        for (const key of Object.keys(model.formData)) {
          if (key.includes('color') || key.includes('font-family')) {
            settingsValues[key] = setting.get(key).composite as string;
          } else {
            settingsValues[key] = setting.get(key).composite as number;
          }
        }
        return settingsValues;
      }

      // Wait for the application to be restored and
      // for the settings for this plugin to be loaded

      const onModelChanged = () => {
        console.log('Model is changed ! We are using the theme parameters');
        Promise.all([app.restored, settings.load(PLUGIN_ID)]).then(
          ([, setting]) => {
            // Read the settings
            let settingsValues: any = {};
            settingsValues = loadSetting(setting);
            // Listen for your plugin setting changes using Signal
            setting.changed.connect(loadSetting);
            for (const key of Object.keys(model.formData)) {
              if (settingsValues[key] !== model.formData[key]) {
                console.log(`For key ${key}, set new value`);
                setting.set(key, model.formData[key]);
              }
            }
          }
        );
      };

      model.stateChanged.connect(onModelChanged);
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
