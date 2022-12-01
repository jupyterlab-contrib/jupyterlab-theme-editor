import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IThemeManager, ICommandPalette } from '@jupyterlab/apputils';
import { paletteIcon } from '@jupyterlab/ui-components';
import { ThemeEditorModel } from './model';
import { ThemeEditorView } from './view';
import { IChangedArgs } from '@jupyterlab/coreutils';

/**
 * Initialization data for the jupyter-theme-editor extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyter-theme-editor:plugin',
  autoStart: true,
  requires: [IThemeManager, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    palette: ICommandPalette
  ) => {
    let model: ThemeEditorModel;
    let view: ThemeEditorView;
    const onThemeChanged = (
      themeManager: IThemeManager,
      changes: IChangedArgs<string, string | null, string>
    ) => {
      themeManager.themeChanged.disconnect(onThemeChanged);

      model = new ThemeEditorModel();

      console.log('JupyterLab extension jupyter-theme-editor is activated!');
    };
    themeManager.themeChanged.connect(onThemeChanged);

    const command = 'jupyter-theme-editor:open';
    app.commands.addCommand(command, {
      label: 'Open Theme Editor',
      execute: () => {
        if (!view || view.isDisposed) {
          view = new ThemeEditorView(model);
          view.addClass('jp-theme-editor-view-panel');
          view.title.icon = paletteIcon;
          view.id = 'theme-editor';
        }
        if (!view.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(view, 'left', { mode: 'split-bottom' });
        }
        // Activate the widget
        app.shell.activateById(view.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Tutorial' });
  }
};

export default plugin;
