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
export class ThemeEditorModel extends VDomModel {
  private _accentColor: string;
  private _brandColor: string;
  private _borderColor: string;
  private _errorColor: string;
  private _infoColor: string;
  private _layoutColor: string;
  private _successColor: string;
  private _warnColor: string;
  private _uiFontFamily: string;
  private _contentFontFamily: string;
  private _codeFontFamily: string;
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
  private _fontList = [
    'system-ui',
    'Segoe UI',
    'helvetica',
    'arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'JetBrains Mono'
  ];
  private _codeFontList = [
    'menlo',
    'consolas',
    'DejaVu Sans Mono',
    'monospace'
  ];
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
    this._uiFontFamily = getStringCSSProperties(
      CSSInfos,
      '--jp-ui-font-family'
    );
    this._contentFontFamily = getStringCSSProperties(
      CSSInfos,
      '--jp-content-font-family'
    );
    this._codeFontFamily = getStringCSSProperties(
      CSSInfos,
      '--jp-code-font-family'
    );
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
      title: 'THEME EDITOR',
      description: 'You can tune the parameters',
      type: 'object',
      properties: {
        type: 'object',
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
      'ui-font-family': `${this._fontList}`,
      'content-font-family': `${this._fontList}`,
      'code-font-family': `${this._codeFontList}`,
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
      'ui-font-family': (value: string) => {
        this.uiFontFamily = value;
      },
      'content-font-family': (value: string) => {
        this.contentFontFamily = value;
      },
      'code-font-family': (value: string) => {
        this.codeFontFamily = value;
      },
      'ui-font-size': (value: number) => {
        this.uiFontSize = value;
      },
      'content-font-size': (value: number) => {
        this.contentFontSize = value;
      },
      'code-font-size': (value: number) => {
        this.codeFontSize = value;
      },
      'border-width': (value: number) => {
        this.borderWidth = value;
      },
      'border-radius': (value: number) => {
        this.borderRadius = value;
      },
      'accent-color': (value: string) => {
        this.accentColor = value;
      },
      'border-color': (value: string) => {
        this.borderColor = value;
      },
      'brand-color': (value: string) => {
        this.brandColor = value;
      },
      'error-color': (value: string) => {
        this.errorColor = value;
      },
      'info-color': (value: string) => {
        this.infoColor = value;
      },
      'layout-color': (value: string) => {
        this.layoutColor = value;
      },
      'success-color': (value: string) => {
        this._successColor = value;
      },
      'warn-color': (value: string) => {
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

  public get uiFontFamily(): string {
    return this._uiFontFamily;
  }

  public set uiFontFamily(fontfamily: string) {
    if (this._uiFontFamily !== fontfamily) {
      this._uiFontFamily = fontfamily;
      this.stateChanged.emit();
    }
  }

  public get contentFontFamily(): string {
    return this._contentFontFamily;
  }

  public set contentFontFamily(fontfamily: string) {
    if (this._contentFontFamily !== fontfamily) {
      this._contentFontFamily = fontfamily;
      this.stateChanged.emit();
    }
  }

  public get codeFontFamily(): string {
    return this._codeFontFamily;
  }

  public set codeFontFamily(fontfamily: string) {
    if (this._codeFontFamily !== fontfamily) {
      this._codeFontFamily = fontfamily;
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
      let l = colorHSL.l;

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
      let isDark: boolean;
      if (l < 0.5) {
        isDark = true;
      } else {
        isDark = false;
      }
      if (isDark) {
        console.log('Theme is dark, l is:', l);
      } else {
        console.log('Theme is light, l is:', l);
      }

      const colorRGBA64shifted = hslToRGB(colorHSLshifted);
      const palette = definePalette(colorRGBA64shifted, 4);
      applyPalette(palette, '--jp-layout-color');

      const complementaryL = 1 - l;
      const inverseColorHSL = new ColorHSL(h, s, complementaryL);
      const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
      const inversePalette = definePalette(inverseColorRGBA64, 5);
      applyPalette(inversePalette, '--jp-inverse-layout-color');
      applyPalette(inversePalette, '--jp-ui-font-color');
    }
  }
}
