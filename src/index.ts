import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IThemeManager } from '@jupyterlab/apputils';
import { themeEditorIcon } from './icons';
import { ThemeEditorModel } from './model';
import { ThemeEditorView } from './view';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ITranslator } from '@jupyterlab/translation';

const PLUGIN_ID = 'jupyter-theme-editor:plugin';

/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [IThemeManager],
  optional: [ISettingRegistry, ITranslator],
  activate: (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    settingRegistry: ISettingRegistry,
    translator: ITranslator
  ) => {
    const onThemeChanged = (themeManager: IThemeManager) => {
      themeManager.themeChanged.disconnect(onThemeChanged);
      const model = new ThemeEditorModel();
      const view = new ThemeEditorView(model, translator);
      view.addClass('jp-theme-editor-view-panel');
      view.id = 'theme-editor';
      view.title.icon = themeEditorIcon;
      model.schema = {};
      app.shell.add(view, 'left');
      console.log('JupyterLab extension jupyter-theme-editor is activated!');

      Promise.all([app.restored, settingRegistry.load(PLUGIN_ID)]).then(
        ([, setting]) => {
          model.schema = setting.schema.properties?.customStyles ?? {};
          model.stateChanged.emit();
          let useSettings: any = null;
          let customStyles: any = {};
          const onModelChanged = () => {
            for (const key of Object.keys(model.formData)) {
              if (typeof model.formData[key] === 'string') {
                model.formData[key] = model.formData[key].trim();
              }
            }
            // Expanding will result in a copy
            customStyles = { ...model.formData };
            setting.set('customStyles', customStyles);
          };

          loadSetting();
          setting.changed.connect(loadSetting);

          function loadSetting() {
            // Read the settings and convert to the correct type
            const candidate = setting.get('useSettings').composite as boolean;
            customStyles = setting.get('customStyles').composite as any;
            if (candidate !== useSettings) {
              useSettings = candidate;

              // ... apply needed change
              if (useSettings === false) {
                model.stateChanged.connect(onModelChanged);
              } else {
                model.stateChanged.disconnect(onModelChanged);
                model.formData = { ...customStyles };
                model.stateChanged.emit();
                model.stateChanged.connect(onModelChanged);
              }
            }
          }
        }
      );
    };
    themeManager.themeChanged.connect(onThemeChanged);
  }
};

export default plugin;
