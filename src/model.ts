import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  hslToRGB,
  rgbToHSL,
  ColorHSL
} from '@microsoft/fast-colors';

function hexToRGBA(h: string) {
  let r = '0',
    g = '0',
    b = '0';

  // 4 digits
  if (h.length === 4) {
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];

    // 6 digits
  } else if (h.length === 7) {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
  }
  const a = '1';
  const rgba = [Number(r) / 256, Number(g) / 256, Number(b) / 256, Number(a)];
  return rgba;
}

function rgbaStringToColorRGBA64(colorValueRGBAstr: number[]) {
  const colorRGBA64 = new ColorRGBA64(
    colorValueRGBAstr[0],
    colorValueRGBAstr[1],
    colorValueRGBAstr[2],
    colorValueRGBAstr[3]
  );
  return colorRGBA64;
}

function getNumberFromCSSProperties(CSSInfos: any, name: string) {
  const propertyValueStr = getStringCSSProperties(CSSInfos, name);
  const propertyValue = Number(propertyValueStr.split('px')[0]);
  return propertyValue;
}

function getStringCSSProperties(CSSInfos: any, name: string) {
  const propertyValueStr = CSSInfos.getPropertyValue(name);
  return propertyValueStr;
}

function setCssColorProperties(name: string, values: ColorRGBA64[], start = 0) {
  setCssProperties(
    name,
    values.map(v => v.toStringHexRGB()),
    start
  );
}

function setCssProperties(name: string, values: string[], start = 0) {
  let counter = start;
  for (const v of values) {
    document.body.style.setProperty(name + String(counter), v);
    counter++;
  }
}

function definePalette(color: ColorRGBA64, steps: number) {
  const palette: ColorPalette = new ColorPalette({
    baseColor: color,
    steps: steps,
    interpolationMode: ColorInterpolationSpace.RGB
  });
  return palette;
}
function applyPalette(palette: ColorPalette, cssVariable: string) {
  setCssColorProperties(cssVariable, palette.palette);
}

function defineAndApplyPaletteFrom1hexColor(
  hexcolor: string,
  steps: number,
  cssVariable: string
) {
  const colorValueRGBAstr = hexToRGBA(hexcolor);
  const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
  const palette = definePalette(colorRGBA64, steps);
  applyPalette(palette, cssVariable);
}

function shiftLuminanceRGBAColor(colorRGBA: ColorRGBA64) {
  let l = getLuminanceRGBAColor(colorRGBA);
  const h = getHueRGBAColor(colorRGBA);
  const s = getSaturationRGBAColor(colorRGBA);

  if (l > 0.3 && l < 0.4) {
    l = l - 0.15;
  }
  if (l >= 0.4 && l < 0.5) {
    l = l - 0.25;
  }
  if (l >= 0.5 && l < 0.6) {
    l = l + 0.15;
  } else if (l >= 0.6 && l < 0.7) {
    l = l + 0.25;
  }

  const colorHSLshifted = new ColorHSL(h, s, l);
  const colorRGBA64shifted = hslToRGB(colorHSLshifted);
  return colorRGBA64shifted;
}

function getLuminanceRGBAColor(colorRGBA: ColorRGBA64) {
  const colorHSL = rgbToHSL(colorRGBA);
  return colorHSL.l;
}

function getSaturationRGBAColor(colorRGBA: ColorRGBA64) {
  const colorHSL = rgbToHSL(colorRGBA);
  return colorHSL.s;
}

function getHueRGBAColor(colorRGBA: ColorRGBA64) {
  const colorHSL = rgbToHSL(colorRGBA);
  return colorHSL.h;
}
export class ThemeEditorModel extends VDomModel {
  /*   private _accentColor: string;
  private _brandColor: string;
  private _borderColor: string;
  private _errorColor: string;
  private _infoColor: string;
  private _layoutColor: string;
  private _successColor: string;
  private _warnColor: string;
  private _uiFontFamily: string;
  private _contentFontFamily: string;
  private _codeFontFamily: string; */
  private _uiFontScale: number;
  private _contentFontScale: number;
  private _schema: any;
  private _formData: any;
  private _formDataSetter: any;
  private _fontList = [
    'system-ui',
    'helvetica',
    'arial',
    'sans-serif',
    'JetBrains Mono',
    'Great Vibes',
    'Little Days'
  ];
  private _codeFontList = [
    'menlo',
    'consolas',
    'DejaVu Sans Mono',
    'monospace',
    'Space Mono'
  ];
  constructor() {
    super();
    const CSSInfos = window.getComputedStyle(document.body);
    /* this._accentColor = getStringCSSProperties(CSSInfos, '--jp-accent-color1');
    this._borderColor = getStringCSSProperties(CSSInfos, '--jp-border-color1');
    this._brandColor = getStringCSSProperties(CSSInfos, '--jp-brand-color1');
    this._errorColor = getStringCSSProperties(CSSInfos, '--jp-error-color1');
    this._infoColor = getStringCSSProperties(CSSInfos, '--jp-info-color1');
    this._layoutColor = getStringCSSProperties(CSSInfos, '--jp-layout-color1');
    this._successColor = getStringCSSProperties(
      CSSInfos,
      '--jp-success-color1'
    );
    this._warnColor = getStringCSSProperties(CSSInfos, '--jp-warn-color1');
*/

    this._uiFontScale = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-ui-font-scale-factor'
    );
    this._contentFontScale = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-content-font-scale-factor'
    );

    this._schema = {
      title: 'THEME EDITOR',
      description: 'You can tune the parameters',
      type: 'object',
      properties: {
        'layout-color': {
          title: 'Layout color',
          type: 'string'
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
        'success-color': {
          title: 'Success color',
          type: 'string'
        },
        'warn-color': {
          title: 'Warn color',
          type: 'string'
        },
        'ui-font-size': {
          title: 'UI Font size',
          type: 'integer',
          minimum: 6,
          maximum: 30,
          default: getNumberFromCSSProperties(CSSInfos, '--jp-ui-font-size1')
        },
        'content-font-size': {
          title: 'Content font size',
          type: 'integer',
          minimum: 6,
          maximum: 30,
          default: getNumberFromCSSProperties(
            CSSInfos,
            '--jp-content-font-size1'
          )
        },
        'code-font-size': {
          title: 'Code font size',
          type: 'integer',
          minimum: 6,
          maximum: 30,
          default: getNumberFromCSSProperties(CSSInfos, '--jp-code-font-size1')
        },
        'border-width': {
          title: 'Border width',
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: getNumberFromCSSProperties(CSSInfos, '--jp-border-width')
        },
        'border-radius': {
          title: 'Border radius',
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: getNumberFromCSSProperties(CSSInfos, '--jp-border-radius')
        },
        'ui-font-family': {
          title: 'User Interface Font family',
          type: 'string',
          enum: this._fontList
        },
        'content-font-family': {
          title: 'Content Font family',
          type: 'string',
          enum: this._fontList
        },
        'code-font-family': {
          title: 'Code Font family',
          type: 'string',
          enum: this._codeFontList
        }
      }
    };

    this._formData = {
      'ui-font-family': 'helvetica',
      'content-font-family': 'system-ui',
      'code-font-family': 'consolas',
      'ui-font-size': 13,
      'content-font-size': 14,
      'code-font-size': 14,
      'border-width': 1,
      'border-radius': 2,
      'accent-color': '#ffffff',
      'border-color': '#ffffff',
      'brand-color': '#ffffff',
      'error-color': '#ffffff',
      'info-color': '#ffffff',
      'layout-color': '#ffffff',
      'success-color': '#ffffff',
      'warn-color': '#ffffff'
    };

    this._formDataSetter = {
      'ui-font-family': (value: string) => {
        document.body.style.setProperty(`${'--jp-ui-font-family'}`, value);
      },
      'content-font-family': (value: string) => {
        document.body.style.setProperty(`${'--jp-content-font-family'}`, value);
      },
      'code-font-family': (value: string) => {
        document.body.style.setProperty(`${'--jp-code-font-family'}`, value);
      },
      'ui-font-size': (value: number) => {
        const fontsize_list = [];
        for (let i = 0; i < 4; i++) {
          fontsize_list[i] =
            String(Math.pow(this._uiFontScale, i - 1) * value) + 'px';
        }
        setCssProperties('--jp-ui-font-size', fontsize_list);
      },
      'content-font-size': (value: number) => {
        const fontsize_list = [];
        for (let i = 0; i < 6; i++) {
          fontsize_list[i] =
            String(Math.pow(this._contentFontScale, i - 1) * value) + 'px';
        }
        setCssProperties('--jp-content-font-size', fontsize_list);
      },
      'code-font-size': (value: number) => {
        document.body.style.setProperty(
          `${'--jp-code-font-size'}`,
          String(value) + 'px'
        );
        this.stateChanged.emit();
      },
      'border-width': (value: number) => {
        document.body.style.setProperty(
          `${'--jp-border-width'}`,
          String(value) + 'px'
        );
        this.stateChanged.emit();
      },
      'border-radius': (value: number) => {
        document.body.style.setProperty(
          `${'--jp-border-radius'}`,
          String(value) + 'px'
        );
      },
      'accent-color': (value: string) => {
        defineAndApplyPaletteFrom1hexColor(value, 4, '--jp-accent-color');
      },
      'border-color': (value: string) => {
        defineAndApplyPaletteFrom1hexColor(value, 4, '--jp-border-color');
      },
      'brand-color': (value: string) => {
        defineAndApplyPaletteFrom1hexColor(value, 4, '--jp-brand-color');
      },
      'error-color': (value: string) => {
        defineAndApplyPaletteFrom1hexColor(value, 4, '--jp-error-color');
      },
      'info-color': (value: string) => {
        defineAndApplyPaletteFrom1hexColor(value, 4, '--jp-info-color');
      },
      'layout-color': (value: string) => {
        const colorValueRGBAstr = hexToRGBA(value);
        const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
        const colorRGBA64shifted = shiftLuminanceRGBAColor(colorRGBA64);
        const palette = definePalette(colorRGBA64shifted, 4);
        applyPalette(palette, '--jp-layout-color');

        const shiftedLuminance = getLuminanceRGBAColor(colorRGBA64shifted);
        const complementaryL = 1 - shiftedLuminance;
        const inverseColorHSL = new ColorHSL(
          getHueRGBAColor(colorRGBA64),
          getSaturationRGBAColor(colorRGBA64),
          complementaryL
        );
        const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
        const inversePalette = definePalette(inverseColorRGBA64, 5);
        applyPalette(inversePalette, '--jp-inverse-layout-color');
        applyPalette(inversePalette, '--jp-ui-font-color');
      },
      'success-color': (value: string) => {
        const colorValueRGBAstr = hexToRGBA(value);
        const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
        const palette = definePalette(colorRGBA64, 4);
        applyPalette(palette, '--jp-success-color');
      },
      'warn-color': (value: string) => {
        const colorValueRGBAstr = hexToRGBA(value);
        const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
        const palette = definePalette(colorRGBA64, 4);
        applyPalette(palette, '--jp-warn-color');
      }
    };
  }

  public get schema(): any {
    return this._schema;
  }

  public get formData(): any {
    return this._formData;
  }

  public set formData(data: any) {
    for (const key in this._formData) {
      const newValue = data[key];
      console.log('newValue:', newValue);
      this.stateChanged.emit();
      this._formDataSetter[key](newValue);
    }
    console.log('data:', data);
  }
}
