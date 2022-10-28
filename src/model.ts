import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  /*contrastRatio,*/
  hslToRGB,
  rgbToHSL,
  ColorHSL
} from '@microsoft/fast-colors';

/* const black = new ColorRGBA64(0, 0, 0, 1);
const white = new ColorRGBA64(1, 1, 1, 1);
const threshold = 7; */

function isBlack(color: ColorRGBA64): boolean {
  return color.r === 0.0 && color.g === 0.0 && color.b === 0.0;
}

function isWhite(color: ColorRGBA64): boolean {
  return color.r === 1.0 && color.g === 1.0 && color.b === 1.0;
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
    document.body.style.setProperty(`${name}${counter++}`, v);
  }
}

/* function set_css_font_properties(
  name: string,
  layoutValues: ColorRGBA64[],
  fontValues: ColorRGBA64[],
  threshold: number
) {
  for (let i = 0; i < fontValues.length; i++) {
    const v2 = layoutValues[i];
    for (let v1 of fontValues) {
      const ratio = contrastRatio(v1, v2);
      if (ratio < threshold && isBlack(v1)) {
        v1 = white;
      } else {
        if (ratio < threshold && isWhite(v1)) {
          v1 = black;
        }
      }
      document.body.style.setProperty(`${name}${i}`, v1.toStringHexRGB());
    }
  }
}  */
function define_palette(color: ColorRGBA64, steps: number) {
  const palette: ColorPalette = new ColorPalette({
    baseColor: color,
    steps: steps,
    interpolationMode: ColorInterpolationSpace.RGB
  });
  return palette;
}
function apply_palette(palette: ColorPalette, cssVariable: string) {
  setCssColorProperties(cssVariable, palette.palette);
}

export class ThemeEditorModel extends VDomModel {
  private _accentColor = '#000000';
  private _brandColor = '#FFFFFF';
  private _borderColor = '#FFFFFF';
  private _errorColor = '#FFFFFF';
  private _infoColor = '#FFFFFF';
  private _layoutColor = '#FFFFFF';
  private _successColor = '#FFFFFF';
  private _warnColor = '#FFFFFF';
  /* private _uiFontColorList: ColorRGBA64[];
  private _inverse_uiFontColorList: ColorRGBA64[]; */
  private _uiFontSize: number;
  private _contentFontSize: number;
  private _codeFontSize: number;
  private _borderWidth: number;
  private _borderRadius: number;
  private _uiFontScale: number;
  private _contentFontScale: number;

  constructor() {
    super();
    /* this._uiFontColorList = [
      rgba_string_to_ColorRGBA64([0, 0, 0, 0.87]),
      rgba_string_to_ColorRGBA64([0, 0, 0, 0.87]),
      rgba_string_to_ColorRGBA64([0, 0, 0, 0.54]),
      rgba_string_to_ColorRGBA64([0, 0, 0, 0.38])
    ];

    this._inverse_uiFontColorList = [
      rgba_string_to_ColorRGBA64([1, 1, 1, 1]),
      rgba_string_to_ColorRGBA64([1, 1, 1, 0.7]),
      rgba_string_to_ColorRGBA64([1, 1, 1, 0.7]),
      rgba_string_to_ColorRGBA64([1, 1, 1, 0.5])
    ]; */
    this._uiFontSize = Number(
      document.body.style.getPropertyValue('--jp-ui-font-size')
    );
    this._contentFontSize = Number(
      document.body.style.getPropertyValue('--jp-content-font-size')
    );
    this._codeFontSize = Number(
      document.body.style.getPropertyValue('--jp-code-font-size')
    );
    this._borderWidth = Number(
      document.body.style.getPropertyValue('--jp-border-width')
    );
    this._borderRadius = Number(
      document.body.style.getPropertyValue('--jp-border-radius')
    );
    this._uiFontScale = Number(
      document.body.style.getPropertyValue('--jp-ui-font-scale-factor')
    );
    this._contentFontScale = Number(
      document.body.style.getPropertyValue(
        `${'--jp-content-font-scale-factor'}`
      )
    );
  }
  public get uiFontSize(): number {
    return this._uiFontSize;
  }

  public set uiFontSize(fontsize: number) {
    if (this._uiFontSize !== fontsize) {
      this._uiFontSize = fontsize;
      this.stateChanged.emit();
      const scale = this._uiFontScale;

      const fontsize_list = [];
      for (let i = 0; i < 4; i++) {
        fontsize_list[i] = String(Math.pow(scale, i - 1) * fontsize) + 'px';
      }
      document.body.style.setProperty(
        `${'--jp-content-font-size'}`,
        String(this._uiFontSize) + 'px'
      );
    }
  }

  public get contentFontSize(): number {
    return this._contentFontSize;
  }

  public set contentFontSize(fontsize: number) {
    if (this._contentFontSize !== fontsize) {
      this._contentFontSize = fontsize;
      this.stateChanged.emit();
      const scale = this._contentFontScale;
      const fontsize_list = [];
      for (let i = 0; i < 4; i++) {
        fontsize_list[i] = String(Math.pow(scale, i - 1) * fontsize) + 'px';
      }
      document.body.style.setProperty(
        `${'--jp-content-font-size'}`,
        String(this._contentFontSize) + 'px'
      );
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
      const test = document.body.style.getPropertyValue('--jp-border-width');
      console.log('test:', test);
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-accent-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-border-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-brand-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-error-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-warn-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-success-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-info-color');
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
      const palette = define_palette(colorRGBA64, 4);
      apply_palette(palette, '--jp-layout-color');

      const colorHSL = rgbToHSL(colorRGBA64);
      const h = colorHSL.h;
      const s = colorHSL.s;
      const l = colorHSL.l;
      /* let isLight = 'Undefined';
      if (l > 0.5) {
        isLight = 'True';
      } else {
        isLight = 'False';
      }
      const delta = 0.2;
      const direction = isLight ? 1 : -1;

      console.log('isLight is:', isLight);*/
      const inverseColorHSL = new ColorHSL(h, s, 1 - l);
      const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
      const inversePalette = define_palette(inverseColorRGBA64, 5);
      apply_palette(inversePalette, '--jp-inverse-layout-color');
      apply_palette(inversePalette, '--jp-ui-font-color');

      /*       set_text_to_black_or_white(
        '--jp-ui-font-color',
        palette.palette,
        this._uiFontColorList,
        threshold
      );
      set_text_to_black_or_white(
        '--jp-ui-inverse-font-color',
        inversePalette.palette,
        this._inverse_uiFontColorList,
        threshold
      ); */
    }
  }
}
