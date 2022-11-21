import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  hslToRGB,
  rgbToHSL,
  ColorHSL
} from '@microsoft/fast-colors';

/* function isDark(color: ColorHSL) {
  let isDark: boolean;
  if (color.l > 0.5) {
    isDark = true;
  } else {
    isDark = false;
  }
  return isDark;
}*/
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

/* function shiftToLuminance(
  l: number,
  a0: number,
  sigma: number,
  center: number
) {
  const x = Math.pow((l - center) / sigma, 2);
  const y = a0 * Math.exp(-x);
  return y;
} */

export class ThemeEditorModel extends VDomModel {
  private _accentColor: string;
  private _brandColor: string;
  private _borderColor: string;
  private _errorColor: string;
  private _infoColor: string;
  private _layoutColor: string;
  private _successColor: string;
  private _warnColor: string;
  private _uiFontSize: number;
  private _uiFontScale: number;
  private _contentFontSize: number;
  private _contentFontScale: number;
  private _codeFontSize: number;
  private _borderWidth: number;
  private _borderRadius: number;
  private _schema: any;
  private _formData: any;
  private _formDataSetter: any;

  constructor() {
    super();
    const CSSInfos = window.getComputedStyle(document.body);
    this._accentColor = getStringCSSProperties(CSSInfos, '--jp-accent-color1');
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

    this._uiFontSize = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-ui-font-size1'
    );
    this._uiFontScale = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-ui-font-scale-factor'
    );
    this._contentFontSize = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-content-font-size1'
    );
    this._contentFontScale = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-content-font-scale-factor'
    );
    this._codeFontSize = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-code-font-size'
    );
    this._borderWidth = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-border-width'
    );
    this._borderRadius = getNumberFromCSSProperties(
      CSSInfos,
      '--jp-border-radius'
    );

    this._schema = {
      type: 'object',
      properties: {
        'ui-font-size': {
          title: 'UI Font size',
          type: 'integer',
          minimum: 10,
          maximum: 25,
          default: 17
        },
        'content-font-size': {
          title: 'Content font size',
          type: 'integer',
          minimum: 6,
          maximum: 30,
          default: 15
        },
        'code-font-size': {
          title: 'Code font size',
          type: 'integer',
          minimum: 12,
          maximum: 20,
          default: 14
        },
        'border-width': {
          title: 'Border width',
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: 1
        },
        'border-radius': {
          title: 'Border radius',
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: 2
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
        'layout-color': {
          title: 'Layout color',
          type: 'string'
        },
        'success-color': {
          title: 'Success color',
          type: 'string'
        },
        'warn-color': {
          title: 'Warn color',
          type: 'string'
        }
      }
    };

    this._formData = {
      'ui-font-size': `${this._uiFontSize}`,
      'content-font-size': `${this._contentFontSize}`,
      'code-font-size': `${this._codeFontSize}`,
      'border-width': `${this._borderWidth}`,
      'border-radius': `${this._borderRadius}`,
      'accent-color': `${this._accentColor}`,
      'border-color': `${this._borderColor}`,
      'brand-color': `${this._brandColor}`,
      'error-color': `${this._errorColor}`,
      'info-color': `${this._infoColor}`,
      'layout-color': `${this._layoutColor}`,
      'success-color': `${this._successColor}`,
      'warn-color': `${this._warnColor}`
    };
    this._formDataSetter = {
      'ui-font-size': (value: any) => {
        this.uiFontSize = value;
      },
      'content-font-size': (value: any) => {
        this.contentFontSize = value;
      },
      'code-font-size': (value: any) => {
        this.codeFontSize = value;
      },
      'border-width': (value: any) => {
        this.borderWidth = value;
      },
      'border-radius': (value: any) => {
        this.borderRadius = value;
      },
      'accent-color': (value: any) => {
        this.accentColor = value;
      },
      'border-color': (value: any) => {
        this.borderColor = value;
      },
      'brand-color': (value: any) => {
        this.brandColor = value;
      },
      'error-color': (value: any) => {
        this.errorColor = value;
      },
      'info-color': (value: any) => {
        this.infoColor = value;
      },
      'layout-color': (value: any) => {
        this.layoutColor = value;
      },
      'success-color': (value: any) => {
        this._successColor = value;
      },
      'warn-color': (value: any) => {
        this._warnColor = value;
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
    if (this._formData !== data) {
      this._formData = data;
      for (const key in this._formData) {
        const newValue = data[key];
        this._formDataSetter[key](newValue);
      }
      this.stateChanged.emit();
    }
  }

  public get uiFontSize(): number {
    return this._uiFontSize;
  }

  public set uiFontSize(fontsize: number) {
    if (this._uiFontSize !== fontsize) {
      this._uiFontSize = fontsize;
      this.stateChanged.emit();
      const fontsize_list = [];
      for (let i = 0; i < 4; i++) {
        fontsize_list[i] =
          String(Math.pow(this._uiFontScale, i - 1) * fontsize) + 'px';
      }
      setCssProperties('--jp-ui-font-size', fontsize_list);
    }
  }

  public get contentFontSize(): number {
    return this._contentFontSize;
  }

  public set contentFontSize(fontsize: number) {
    if (this._contentFontSize !== fontsize) {
      this._contentFontSize = fontsize;
      this.stateChanged.emit();
      const fontsize_list = [];
      for (let i = 0; i < 6; i++) {
        fontsize_list[i] =
          String(Math.pow(this._contentFontScale, i - 1) * fontsize) + 'px';
      }
      setCssProperties('--jp-content-font-size', fontsize_list);
    }
  }

  public get codeFontSize(): number {
    return this._codeFontSize;
  }

  public set codeFontSize(font: number) {
    if (this._codeFontSize !== font) {
      this._codeFontSize = font;
      this.stateChanged.emit();
    }
    document.body.style.setProperty(
      `${'--jp-code-font-size'}`,
      String(this._codeFontSize) + 'px'
    );
  }

  public get borderWidth(): number {
    return this._borderWidth;
  }

  public set borderWidth(width: number) {
    if (this._borderWidth !== width) {
      this._borderWidth = width;
      this.stateChanged.emit();
    }
    document.body.style.setProperty(
      `${'--jp-border-width'}`,
      String(this._borderWidth) + 'px'
    );
  }

  public get borderRadius(): number {
    return this._borderRadius;
  }

  public set borderRadius(radius: number) {
    if (this._borderRadius !== radius) {
      this._borderRadius = radius;
      this.stateChanged.emit();
    }
    document.body.style.setProperty(
      `${'--jp-border-radius'}`,
      String(this._borderRadius) + 'px'
    );
  }
  public getColor(scope: string) {
    switch (scope) {
      case 'accent': {
        return this._accentColor;
      }
      case 'border': {
        return this._borderColor;
      }
      case 'brand': {
        return this._brandColor;
      }
      case 'error': {
        return this._errorColor;
      }
      case 'info': {
        return this._infoColor;
      }
      case 'layout': {
        return this._layoutColor;
      }
      case 'success': {
        return this._successColor;
      }
      case 'warn': {
        return this._warnColor;
      }
    }
  }

  public setColor(scope: string, value: string) {
    switch (scope) {
      case 'accent': {
        this.accentColor = value;
        break;
      }
      case 'border': {
        this.borderColor = value;
        break;
      }
      case 'brand': {
        this.brandColor = value;
        break;
      }
      case 'error': {
        this.errorColor = value;
        break;
      }
      case 'info': {
        this.infoColor = value;
        break;
      }
      case 'layout': {
        this.layoutColor = value;
        break;
      }
      case 'success': {
        this.successColor = value;
        break;
      }
      case 'warn': {
        this.warnColor = value;
        break;
      }
    }
  }
  public get accentColor(): string {
    return this._accentColor;
  }
  public set accentColor(colorHEXstr: string) {
    if (this._accentColor !== colorHEXstr) {
      this._accentColor = colorHEXstr;
      this.stateChanged.emit();
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-accent-color');
    }
  }

  public get borderColor(): string {
    return this._borderColor;
  }

  public set borderColor(colorHEXstr: string) {
    if (this._borderColor !== colorHEXstr) {
      this._borderColor = colorHEXstr;
      this.stateChanged.emit();
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-border-color');
    }
  }

  public get brandColor(): string {
    return this._brandColor;
  }

  public set brandColor(colorHEXstr: string) {
    if (this._brandColor !== colorHEXstr) {
      this._brandColor = colorHEXstr;
      this.stateChanged.emit();
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-brand-color');
    }
  }

  public get errorColor(): string {
    return this._errorColor;
  }

  public set errorColor(colorHEXstr: string) {
    if (this._errorColor !== colorHEXstr) {
      this._errorColor = colorHEXstr;
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      this.stateChanged.emit();
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-error-color');
    }
  }

  public get warnColor(): string {
    return this._warnColor;
  }

  public set warnColor(colorHEXstr: string) {
    if (this._warnColor !== colorHEXstr) {
      this._warnColor = colorHEXstr;
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      this.stateChanged.emit();
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-warn-color');
    }
  }

  public get successColor(): string {
    return this._successColor;
  }

  public set successColor(colorHEXstr: string) {
    if (this._successColor !== colorHEXstr) {
      this._successColor = colorHEXstr;
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      this.stateChanged.emit();
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-success-color');
    }
  }

  public get infoColor(): string {
    return this._successColor;
  }

  public set infoColor(colorHEXstr: string) {
    if (this._infoColor !== colorHEXstr) {
      this._infoColor = colorHEXstr;
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      this.stateChanged.emit();
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-info-color');
    }
  }

  public get layoutColor(): string {
    return this._layoutColor;
  }

  public set layoutColor(colorHEXstr: string) {
    if (this._layoutColor !== colorHEXstr) {
      this._layoutColor = colorHEXstr;
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      this.stateChanged.emit();
      const colorRGBA64 = rgbaStringToColorRGBA64(colorValueRGBAstr);
      const colorHSL = rgbToHSL(colorRGBA64);
      const h = colorHSL.h;
      const s = colorHSL.s;
      const l = colorHSL.l;
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-layout-color');

      const complementaryL = 1 - l;
      /*  const center = 0.5;
      const sigma = 0.25;
      const a0 = 0.4;
      const shiftedLuminance =
        complementaryL - shiftToLuminance(complementaryL, a0, sigma, center);
      console.log('l is:', l);
      console.log('complementaryL is:', complementaryL);
      console.log('shifted l is:', shiftedLuminance);

      const inverseColorHSL = new ColorHSL(h, s, shiftedLuminance); */
      const inverseColorHSL = new ColorHSL(h, s, complementaryL);
      const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
      const inversePalette = definePalette(inverseColorRGBA64, 5);
      applyPalette(inversePalette, '--jp-inverse-layout-color');
      applyPalette(inversePalette, '--jp-ui-font-color');
    }
  }
}
