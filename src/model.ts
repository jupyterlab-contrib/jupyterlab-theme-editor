import { VDomModel } from '@jupyterlab/apputils';
import {
  ColorPalette,
  ColorInterpolationSpace,
  ColorRGBA64,
  contrastRatio,
  hslToRGB,
  rgbToHSL,
  ColorHSL
} from '@microsoft/fast-colors';

const black = new ColorRGBA64(0, 0, 0, 1);
const white = new ColorRGBA64(1, 1, 1, 1);

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

function rgba_string_to_ColorRGBA64(colorValueRGBAstr: number[]) {
  const colorRGBA64 = new ColorRGBA64(
    colorValueRGBAstr[0],
    colorValueRGBAstr[1],
    colorValueRGBAstr[2],
    colorValueRGBAstr[3]
  );
  return colorRGBA64;
}

function set_css_properties(name: string, values: ColorRGBA64[], start = 0) {
  let counter = start;
  for (const v of values) {
    document.body.style.setProperty(`${name}${counter++}`, v.toStringHexRGB());
  }
}

function set_text_to_black_or_white(
  name: string,
  values: ColorRGBA64[],
  threshold: number,
  start = 0
) {
  let color = black;
  let counter = start;

  for (const v of values) {
    const ratio = contrastRatio(v, black);
    if (ratio < threshold && color === black) {
      color = white;
    } else if (ratio < threshold && color === white) {
      color = black;
    }

    document.body.style.setProperty(
      `${name}${counter++}`,
      color.toStringHexRGB()
    );
  }
}

export class ThemeEditorLightModel extends VDomModel {
  private _baseColor = '#FFFFFF';

  public get baseColor(): string {
    return this._baseColor;
  }

  public set baseColor(colorHEXstr: string) {
    if (this._baseColor !== colorHEXstr) {
      this._baseColor = colorHEXstr;
      const colorValueRGBAstr = hexToRGBA(colorHEXstr);
      this.stateChanged.emit();
      const colorRGBA64 = rgba_string_to_ColorRGBA64(colorValueRGBAstr);

      const palette: ColorPalette = new ColorPalette({
        baseColor: colorRGBA64,
        steps: 5,
        interpolationMode: ColorInterpolationSpace.RGB
      });
      const threshold = 7;
      const colorHSL = rgbToHSL(colorRGBA64);
      const h = colorHSL.h;
      const s = colorHSL.s;
      const l = colorHSL.l;

      const inverseColorHSL = new ColorHSL(h, s, 1 - l);
      const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
      const inversePalette: ColorPalette = new ColorPalette({
        baseColor: inverseColorRGBA64,
        steps: 5,
        interpolationMode: ColorInterpolationSpace.RGB
      });
      set_css_properties('--jp-layout-color', palette.palette);
      set_css_properties('--jp-inverse-layout-color', inversePalette.palette);
      set_text_to_black_or_white(
        '--jp-ui-font-color',
        palette.palette,
        threshold
      );
      set_text_to_black_or_white(
        '--jp-ui-inverse-font-color',
        inversePalette.palette,
        threshold
      );
    }
  }
}
