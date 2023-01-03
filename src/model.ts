import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  hslToRGB,
  rgbToHSL,
  ColorHSL,
  parseColorHexRGB
} from '@microsoft/fast-colors';

function stringtoHex(s: string) {
  /* Convert other color formats present in variable.css to hexadecimal colors */
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

function getNumberFromCSSProperties(CSSInfos: any, name: string) {
  /* Get the numerical value of a given ccs variable*/
  const propertyValueStr = CSSInfos.getPropertyValue(name);
  const propertyValue = Number(propertyValueStr.split('px')[0]);
  return propertyValue;
}

function getFontSizeFromCSSProperties(
  /* Get the font size value of a given indexed ccs variable*/
  /* If it is not in px but derived from the baseFontSize with a scaling, conversion is made */
  CSSInfos: any,
  nameRoot: string,
  index: number
) {
  const baseFontSize = getNumberFromCSSProperties(CSSInfos, nameRoot + '1');
  const s = CSSInfos.getPropertyValue(nameRoot + String(index));
  if (s.includes('em')) {
    const s1 = Number(s.split('em')[0]);
    const font = s1 * baseFontSize;
    return font;
  } else {
    return baseFontSize;
  }
}

function defineHexColorFromCSSProperties(CSSInfos: any, name: string) {
  /* Define the hex color string from a css properties that is not defined this way in the css files */
  /* For instance colors are defined with string 'white' or 'rgba(0, 0, 0, 0.25)'*/
  const propertyValueStr = CSSInfos.getPropertyValue(name);
  const hexcolor = stringtoHex(propertyValueStr);
  return hexcolor;
}

function setCSSColorProperties(name: string, values: ColorRGBA64[], start = 0) {
  /* Set the css color properties of a group of indexed color variables with name as prefix
  /* Conversion of the color is made from colorRGBA64 to hex strings.  */
  setCSSProperties(
    name,
    values.map(v => v.toStringHexRGB()),
    start
  );
}

function setCSSProperties(name: string, values: string[], start = 0) {
  /* Set the css properties of a group of indexed variables with name as prefix  */
  let counter = start;
  for (const v of values) {
    const variableName = name + String(counter);
    document.body.style.setProperty(variableName, v);
    counter++;
  }
}

function definePaletteFromColorRGBA64(color: ColorRGBA64, steps: number) {
  /* define a palette from a single ColorRGBA64 color*/
  const palette: ColorPalette = new ColorPalette({
    baseColor: color,
    steps: steps,
    interpolationMode: ColorInterpolationSpace.RGB
  });
  return palette;
}
function applyPaletteToCSSVariable(palette: ColorPalette, cssVariable: string) {
  /*apply a palette to a given set of css variables*/
  setCSSColorProperties(cssVariable, palette.palette);
}

function setPaletteFromHexColor(
  /* From a hex string converted to a ColorRGBA64 color, a palette with a given steps number is defined*/
  /* The colors of this palette are used to overload the colors of a group of indexed css colors*/
  hexcolor: string,
  steps: number,
  cssVariable: string
) {
  const colorRGBA64 = parseColorHexRGB(
    hexcolor.replace(/\s/g, '').toUpperCase()
  );
  const palette = definePaletteFromColorRGBA64(colorRGBA64!, steps);
  applyPaletteToCSSVariable(palette, cssVariable);
}

function shiftLuminanceRGBAColor(colorRGBA: ColorRGBA64) {
  /* Apply a shift defined by interval, to the luminance of a colorRGBA64 color*/
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

function initializeFormData() {
  const CSSInfos = window.getComputedStyle(document.body);
  const formData = {
    'ui-font-family': 'system-ui',
    'content-font-family': 'system-ui',
    'code-font-family': 'monospace',
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
    'border-radius': getNumberFromCSSProperties(CSSInfos, '--jp-border-radius'),
    'layout-color': defineHexColorFromCSSProperties(
      CSSInfos,
      '--jp-layout-color1'
    ),
    'accent-color': defineHexColorFromCSSProperties(
      CSSInfos,
      '--jp-accent-color1'
    ),
    'border-color': defineHexColorFromCSSProperties(
      CSSInfos,
      '--jp-border-color1'
    ),
    'brand-color': defineHexColorFromCSSProperties(
      CSSInfos,
      '--jp-brand-color1'
    ),
    'error-color': defineHexColorFromCSSProperties(
      CSSInfos,
      '--jp-error-color1'
    ),
    'info-color': defineHexColorFromCSSProperties(CSSInfos, '--jp-info-color1'),
    'success-color': defineHexColorFromCSSProperties(
      CSSInfos,
      '--jp-success-color1'
    ),
    'warn-color': defineHexColorFromCSSProperties(CSSInfos, '--jp-warn-color1')
  };

  return formData;
}

function initializeSchema() {
  const fontList = [
    'Arial',
    'Dancing Script',
    'Dosis',
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
  const codeFontList = ['monospace', 'Space Mono', 'DejaVuSans Mono'];
  const Schema = {
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
        title: 'UI font size',
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
        enum: fontList
      },
      'content-font-family': {
        title: 'Content Font family',
        type: 'string',
        enum: fontList
      },
      'code-font-family': {
        title: 'Code Font family',
        type: 'string',
        enum: codeFontList
      }
    }
  };
  return Schema;
}
export class ThemeEditorModel extends VDomModel {
  private _uiFontScale: number;
  private _contentFontScale: number;
  private _schema: any;
  private _formData: any;
  private _formDataSetter: any;

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

    this._schema = initializeSchema();
    this._formData = initializeFormData();
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
        setCSSProperties('--jp-ui-font-size', fontsize_list);
      },
      'content-font-size': (value: number) => {
        const fontsize_list = [];
        for (let i = 0; i < 6; i++) {
          fontsize_list[i] =
            String(Math.pow(this._contentFontScale, i - 1) * value) + 'px';
        }
        setCSSProperties('--jp-content-font-size', fontsize_list);
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
        setPaletteFromHexColor(value, 4, '--jp-accent-color');
      },
      'border-color': (value: string) => {
        setPaletteFromHexColor(value, 4, '--jp-border-color');
      },
      'brand-color': (value: string) => {
        setPaletteFromHexColor(value, 4, '--jp-brand-color');
      },
      'error-color': (value: string) => {
        setPaletteFromHexColor(value, 4, '--jp-error-color');
      },
      'info-color': (value: string) => {
        setPaletteFromHexColor(value, 4, '--jp-info-color');
      },
      'layout-color': (value: string) => {
        const colorRGBA64 = parseColorHexRGB(
          value.replace(/\s/g, '').toUpperCase()
        );

        const colorRGBA64shifted = shiftLuminanceRGBAColor(colorRGBA64!);
        const palette = definePaletteFromColorRGBA64(colorRGBA64shifted, 4);
        applyPaletteToCSSVariable(palette, '--jp-layout-color');

        const shiftedLuminance = getLuminanceRGBAColor(colorRGBA64shifted);
        const complementaryL = 1 - shiftedLuminance;
        const inverseColorHSL = new ColorHSL(
          getHueRGBAColor(colorRGBA64!),
          getSaturationRGBAColor(colorRGBA64!),
          complementaryL
        );
        const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
        const inversePalette = definePaletteFromColorRGBA64(
          inverseColorRGBA64,
          5
        );
        applyPaletteToCSSVariable(inversePalette, '--jp-inverse-layout-color');
        applyPaletteToCSSVariable(inversePalette, '--jp-ui-font-color');
      },
      'success-color': (value: string) => {
        setPaletteFromHexColor(value, 4, '--jp-success-color');
      },
      'warn-color': (value: string) => {
        setPaletteFromHexColor(value, 4, '--jp-warn-color');
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
