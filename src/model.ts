import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  hslToRGB,
  rgbToHSL,
  ColorHSL
} from '@microsoft/fast-colors';

function stringtoHex(s: string) {
  if (s === 'white') {
    return '#000000';
  }
  if (s === 'black') {
    return '#ffffff';
  }
  if (s.includes('rgba')) {
    const s1 = s.split('rgba(')[1];
    const r = Number(s1.split(',')[0]);
    const g = Number(s1.split(',')[1]);
    const b = Number(s1.split(',')[2]);
    const hexstring =
      '#' +
      [r, g, b]
        .map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');

    return hexstring;
  } else {
    return s;
  }
}
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
  const propertyValueStr = CSSInfos.getPropertyValue(name);
  const propertyValue = Number(propertyValueStr.split('px')[0]);
  return propertyValue;
}

function getFontSizeFromCSSProperties(
  CSSInfos: any,
  nameRoot: string,
  step: number
) {
  const baseFontSize = getNumberFromCSSProperties(CSSInfos, nameRoot + '1');
  const s = CSSInfos.getPropertyValue(nameRoot + String(step));
  if (s.includes('em')) {
    const s1 = Number(s.split('em')[0]);
    const font = s1 * baseFontSize;
    return font;
  } else {
    return baseFontSize;
  }
}

function getHexColorFromCSSProperties(CSSInfos: any, name: string) {
  const propertyValueStr = CSSInfos.getPropertyValue(name);
  const hexcolor = stringtoHex(propertyValueStr);
  return hexcolor;
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
  private _uiFontScale: number;
  private _contentFontScale: number;
  private _schema: any;
  private _formData: any;
  private _formDataSetter: any;
  private _fontList = [
    'Arial',
    'Dancing Script',
    'Helvetica',
    'JetBrains Mono',
    'Lobster',
    'Oxygen',
    'Pacifico',
    'Prompt',
    'Righteous',
    'Single Day',
    'system-ui',
    'Satisfy',
    'Times New Roman',
    'Ultra',
    'Urbanist'
  ];
  private _codeFontList = ['DejaVu Sans Mono', 'Space Mono'];
  constructor() {
    super();
    const CSSInfos = window.getComputedStyle(document.body);
    this._uiFontScale = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-ui-font-scale-factor'
    );
    this._contentFontScale = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-content-font-scale-factor'
    );

    this._schema = {
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
          maximum: 30
        },
        'content-font-size': {
          title: 'Content font size',
          type: 'integer',
          minimum: 6,
          maximum: 30
        },
        'code-font-size': {
          title: 'Code font size',
          type: 'integer',
          minimum: 6,
          maximum: 30
        },
        'border-width': {
          title: 'Border width',
          type: 'integer',
          minimum: 1,
          maximum: 10
        },
        'border-radius': {
          title: 'Border radius',
          type: 'integer',
          minimum: 1,
          maximum: 10
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
      'ui-font-family': 'system-ui',
      'content-font-family': 'system-ui',
      'code-font-family': 'Menlo',
      'ui-font-size': getFontSizeFromCSSProperties(
        CSSInfos,
        '--jp-ui-font-size',
        1
      ),
      'content-font-size': getFontSizeFromCSSProperties(
        CSSInfos,
        '--jp-content-font-size',
        1
      ),
      'code-font-size': getNumberFromCSSProperties(
        CSSInfos,
        '--jp-code-font-size'
      ),
      'border-width': getNumberFromCSSProperties(CSSInfos, '--jp-border-width'),
      'border-radius': getNumberFromCSSProperties(
        CSSInfos,
        '--jp-border-radius'
      ),
      'layout-color': getHexColorFromCSSProperties(
        CSSInfos,
        '--jp-layout-color1'
      ),
      'accent-color': getHexColorFromCSSProperties(
        CSSInfos,
        '--jp-accent-color1'
      ),
      'border-color': getHexColorFromCSSProperties(
        CSSInfos,
        '--jp-border-color1'
      ),
      'brand-color': getHexColorFromCSSProperties(
        CSSInfos,
        '--jp-brand-color1'
      ),
      'error-color': getHexColorFromCSSProperties(
        CSSInfos,
        '--jp-error-color1'
      ),
      'info-color': getHexColorFromCSSProperties(CSSInfos, '--jp-info-color1'),
      'success-color': getHexColorFromCSSProperties(
        CSSInfos,
        '--jp-success-color1'
      ),
      'warn-color': getHexColorFromCSSProperties(CSSInfos, '--jp-warn-color1')
    };

    this._formDataSetter = {
      'ui-font-family': (value: string) => {
        document.body.style.setProperty('--jp-ui-font-family', value);
      },
      'content-font-family': (value: string) => {
        document.body.style.setProperty('--jp-content-font-family', value);
      },
      'code-font-family': (value: string) => {
        document.body.style.setProperty('--jp-code-font-family', value);
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
          '--jp-code-font-size',
          String(value) + 'px'
        );
      },
      'border-width': (value: number) => {
        document.body.style.setProperty(
          '--jp-border-width',
          String(value) + 'px'
        );
      },
      'border-radius': (value: number) => {
        document.body.style.setProperty(
          '--jp-border-radius',
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
      this._formDataSetter[key](newValue);
    }
    this._formData = data;
    this.stateChanged.emit();
  }
}
