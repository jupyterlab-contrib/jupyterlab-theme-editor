import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  hslToRGB,
  rgbToHSL,
  ColorHSL
  /*contrastRatio*/
} from '@microsoft/fast-colors';

/* function isDark(color: ColorRGBA64): boolean {
  const colorHSL = rgbToHSL(color);
  const l = colorHSL.l;
  return l < 0.5;
} */
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
  private _uiFontSize: number;
  private _uiFontScale: number;
  private _contentFontSize: number;
  private _contentFontScale: number;
  private _codeFontSize: number;
  private _borderWidth: number;
  private _borderRadius: number;

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
  public getNumber(scope: string) {
    switch (scope) {
      case 'ui-font-size': {
        return this._uiFontSize;
      }
      case 'content-font-size': {
        return this._contentFontSize;
      }
      case 'code-font-size': {
        return this._codeFontSize;
      }
      case 'border-width': {
        return this._borderWidth;
      }
      case 'border-radius': {
        return this._borderRadius;
      }
    }
  }

  public setNumber(scope: string, value: number) {
    switch (scope) {
      case 'ui-font-size': {
        this.uiFontSize = value;
        break;
      }
      case 'content-font-size': {
        this.contentFontSize = value;
        break;
      }
      case 'code-font-size': {
        this.codeFontSize = value;
        break;
      }
      case 'border-width': {
        this.borderWidth = value;
        break;
      }
      case 'border-radius': {
        this.borderRadius = value;
        break;
      }
    }
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
      const palette = definePalette(colorRGBA64, 4);
      applyPalette(palette, '--jp-layout-color');

      const colorHSL = rgbToHSL(colorRGBA64);
      const h = colorHSL.h;
      const s = colorHSL.s;
      const l = colorHSL.l;
      const complementaryL = 1 - l;

      const inverseColorHSL = new ColorHSL(h, s, complementaryL);

      const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
      const inversePalette = definePalette(inverseColorRGBA64, 5);
      applyPalette(inversePalette, '--jp-inverse-layout-color');
      applyPalette(inversePalette, '--jp-ui-font-color');
    }
  }
}
