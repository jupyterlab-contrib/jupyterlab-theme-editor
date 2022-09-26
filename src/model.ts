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

/*const black = new ColorRGBA64(0, 0, 0, 1);
const white = new ColorRGBA64(1, 1, 1, 1);

function set_black_or_white(
  backgroundcolor: ColorRGBA64,
  color: ColorRGBA64,
  threshold: number
) {
  const ratio = contrastRatio(backgroundcolor, color);
  if (ratio < threshold && color === black) {
    color = white;
  } else if (ratio < threshold && color === white) {
    color = black;
  }
  console.log('ratio is:', ratio);
  return color;
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

function set_layout_colors_light(palette: ColorPalette) {
  document.body.style.setProperty(
    '--jp-layout-color0',
    palette.palette[0].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-layout-color1',
    palette.palette[1].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-layout-color2',
    palette.palette[2].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-layout-color3',
    palette.palette[3].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-layout-color4',
    palette.palette[4].toStringHexRGB()
  );
}

function set_inverse_layout_colors_light(palette: ColorPalette) {
  document.body.style.setProperty(
    '--jp-inverse-layout-color0',
    palette.palette[0].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-inverse-layout-color1',
    palette.palette[1].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-inverse-layout-color2',
    palette.palette[2].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-inverse-layout-color3',
    palette.palette[3].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-inverse-layout-color4',
    palette.palette[4].toStringHexRGB()
  );
}

/* function switch_text_to_black_or_white_light(
  palette: ColorPalette,
  threshold: number
) {
  const element_color = [];
  const color = black;
  for (let i = 0; i < palette.palette.length; i++) {
    element_color[i] = set_black_or_white(palette.palette[i], color, threshold);
  }

  document.body.style.setProperty(
    '--jp-ui-font-color0',
    element_color[0].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-ui-font-color1',
    element_color[1].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-ui-font-color2',
    element_color[2].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-ui-font-color3',
    element_color[3].toStringHexRGB()
  );
} */

function set_ui_font_light(palette: ColorPalette) {
  document.body.style.setProperty(
    '--jp-ui-font-color0',
    palette.palette[1].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-ui-font-color1',
    palette.palette[2].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-ui-font-color2',
    palette.palette[3].toStringHexRGB()
  );
  document.body.style.setProperty(
    '--jp-ui-font-color3',
    palette.palette[4].toStringHexRGB()
  );
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
      const colorRGBA64 = new ColorRGBA64(
        colorValueRGBAstr[0],
        colorValueRGBAstr[1],
        colorValueRGBAstr[2],
        colorValueRGBAstr[3]
      );

      const palette: ColorPalette = new ColorPalette({
        baseColor: colorRGBA64,
        steps: 5,
        interpolationMode: ColorInterpolationSpace.RGB
      });
      const colorHSL = rgbToHSL(colorRGBA64);
      const h = colorHSL.h;
      const s = colorHSL.s;
      let l = 1 - colorHSL.l;

      if (l > 0.2 && l <= 0.5) {
        l = 0.05;
      } else if (l > 0.5 && l <= 0.75) {
        l = 0.95;
      } else {
        //pass
      }

      const inverseColorHSL = new ColorHSL(h, s, l);
      const inverseColorRGBA64 = hslToRGB(inverseColorHSL, 1);
      const inversePalette: ColorPalette = new ColorPalette({
        baseColor: inverseColorRGBA64,
        steps: 5,
        interpolationMode: ColorInterpolationSpace.RGB
      });
      set_layout_colors_light(palette);
      set_inverse_layout_colors_light(inversePalette);
      /*switch_text_to_black_or_white_light(palette, 5);*/
      set_ui_font_light(inversePalette);
    }
  }
}
