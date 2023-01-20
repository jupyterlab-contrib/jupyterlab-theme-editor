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
  const s1 = s.replace(/\s/g, '');
  if (s1 === 'white') {
    return '#ffffff';
  }
  if (s1 === 'black') {
    return '#000000';
  }
  if (s.includes('rgba')) {
    const s2 = s1.split('rgba(')[1];
    const r = Number(s2.split(',')[0]);
    const g = Number(s2.split(',')[1]);
    const b = Number(s2.split(',')[2]);
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

function defineColorProperties(
  rootName: string,
  palette: ColorPalette,
  cssProperties: any,
  steps: number
) {
  const list = [];
  for (let i = 0; i < steps; i++) {
    const value = palette.palette[i].toStringHexRGB();
    const key = rootName + String(i);
    list.push((cssProperties[key] = value));
  }
}

function defineFontProperties(
  rootName: string,
  fontList: string[],
  cssProperties: any,
  steps: number
) {
  const list = [];
  for (let i = 0; i < steps; i++) {
    const value = fontList[i];
    const key = rootName + String(i);
    list.push((cssProperties[key] = value));
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

function definePaletteFromHexColor(
  hexcolor: string,
  steps: number,
  cssVariable: string
) {
  const colorRGBA64 = parseColorHexRGB(
    hexcolor.replace(/\s/g, '').toUpperCase()
  );
  const palette = definePaletteFromColorRGBA64(colorRGBA64!, steps);
  return palette;
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

export class ThemeEditorModel extends VDomModel {
  private _uiFontScale: number;
  private _contentFontScale: number;
  public schema: any;
  private _formData: any;
  private _formDataSetter: any;
  private _cssProperties: { [key: string]: string | null };

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

    this._formData = initializeFormData();
    this._cssProperties = {};
    this._formDataSetter = {
      'ui-font-family': (value: string) => {
        this._cssProperties['--jp-ui-font-family'] = value;
      },
      'content-font-family': (value: string) => {
        this._cssProperties['--jp-content-font-family'] = value;
      },
      'code-font-family': (value: string) => {
        this._cssProperties['--jp-code-font-family'] = value;
      },
      'ui-font-size': (value: number) => {
        const fontsizeList = [];
        const steps = 4;
        const rootName = '--jp-ui-font-size';
        for (let i = 0; i < steps; i++) {
          const rounded_value = (
            Math.pow(this._uiFontScale, i - 1) * value
          ).toFixed(3);
          fontsizeList[i] = String(rounded_value) + 'px';
        }
        defineFontProperties(
          rootName,
          fontsizeList,
          this._cssProperties,
          steps
        );
      },
      'content-font-size': (value: number) => {
        const fontsizeList = [];
        const steps = 6;
        const rootName = '--jp-content-font-size';
        for (let i = 0; i < steps; i++) {
          const rounded_value = (
            Math.pow(this._contentFontScale, i - 1) * value
          ).toFixed(3);
          fontsizeList[i] = String(rounded_value) + 'px';
        }
        defineFontProperties(
          rootName,
          fontsizeList,
          this._cssProperties,
          steps
        );
      },
      'code-font-size': (value: number) => {
        this._cssProperties['--jp-code-font-size'] = String(value) + 'px';
      },
      'border-width': (value: number) => {
        this._cssProperties['--jp-border-width'] = String(value) + 'px';
      },
      'border-radius': (value: number) => {
        this._cssProperties['--jp-border-radius'] = String(value) + 'px';
      },
      'accent-color': (value: string) => {
        const rootName = '--jp-accent-color';
        const steps = 4;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        defineColorProperties(rootName, palette, this._cssProperties, steps);
      },
      'border-color': (value: string) => {
        const rootName = '--jp-border-color';
        const steps = 4;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        defineColorProperties(rootName, palette, this._cssProperties, steps);
      },
      'brand-color': (value: string) => {
        const rootName = '--jp-brand-color';
        const steps = 5;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        defineColorProperties(rootName, palette, this._cssProperties, steps);
      },
      'error-color': (value: string) => {
        const rootName = '--jp-error-color';
        const steps = 4;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        defineColorProperties(rootName, palette, this._cssProperties, steps);
      },
      'info-color': (value: string) => {
        const rootName = '--jp-info-color';
        const steps = 4;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        defineColorProperties(rootName, palette, this._cssProperties, steps);
      },
      'layout-color': (value: string) => {
        const colorRGBA64 = parseColorHexRGB(
          value.replace(/\s/g, '').toUpperCase()
        );
        const colorRGBA64shifted = shiftLuminanceRGBAColor(colorRGBA64!);
        const palette = definePaletteFromColorRGBA64(colorRGBA64shifted, 5);
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
        defineColorProperties(
          '--jp-layout-color',
          palette,
          this.cssProperties,
          5
        );
        defineColorProperties(
          '--jp-inverse-layout-color',
          inversePalette,
          this.cssProperties,
          4
        );

        defineColorProperties(
          '--jp-ui-font-color',
          inversePalette,
          this.cssProperties,
          4
        );
        defineColorProperties(
          '--jp-ui-inverse-font-color',
          palette,
          this.cssProperties,
          4
        );
      },
      'success-color': (value: string) => {
        const rootName = '--jp-success-color';
        const steps = 4;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        return defineColorProperties(
          rootName,
          palette,
          this._cssProperties,
          steps
        );
      },
      'warn-color': (value: string) => {
        const rootName = '--jp-warn-color';
        const steps = 4;
        const palette = definePaletteFromHexColor(value, steps, rootName);
        return defineColorProperties(
          rootName,
          palette,
          this._cssProperties,
          steps
        );
      }
    };
  }

  public get cssProperties(): any {
    return this._cssProperties;
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
    for (const key in this._cssProperties) {
      document.body.style.setProperty(key, this._cssProperties[key]);
    }
    this.stateChanged.emit();
  }
}
