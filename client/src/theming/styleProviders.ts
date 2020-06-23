import { themeInputs } from '~/theming/themeInputs';

type ThemeInput = typeof themeInputs;

export const getBorderStyle = (borderStyleInputs: ThemeInput['border']['borderStyle']) => ({
    bs1: borderStyleInputs.bs1 + 'px solid',
    bs2: borderStyleInputs.bs2 + 'px solid',
    bs3: borderStyleInputs.bs3 + 'px solid',
});

export const generateColorShades = ({
    hue: h = 220,
    middleLightness: l = 50,
    saturation: s = 50,
    saturationIncrement: si = 2,
    lightnessIncrement: li = 10,
    lightnessDecrement: ld = 10,
    hueDecrement: hd = 0,
}: Partial<ThemeInput['colors']['core']>) => ({
    cs1: `hsl(${h}, ${s + 8 * si}%, ${l + 4 * li}%)`,
    cs2: `hsl(${h}, ${s + 4 * si}%, ${l + 3 * li}%)`,
    cs3: `hsl(${h}, ${s + 2 * si}%, ${l + 2 * li}%)`,
    cs4: `hsl(${h}, ${s + si}%, ${l + li}%)`,
    cs5: `hsl(${h}, ${s}%, ${l}%)`,
    cs6: `hsl(${h - hd}, ${s + si}%, ${l - ld}%)`,
    cs7: `hsl(${h - 2 * hd}, ${s + 2 * si}%, ${l - 2 * ld}%)`,
    cs8: `hsl(${h - 3 * hd}, ${s + 4 * si}%, ${l - 3 * ld}%)`,
    cs9: `hsl(${h - 4 * hd}, ${s + 8 * si}%, ${l - 4 * ld}%)`,
});

export const getBorderRadius = (bri: ThemeInput['border']['borderRadius']) => ({
    br1: bri.br1 + 'px',
    br2: bri.br2 + 'px',
});

export const getIconSize = (disi: ThemeInput['icons']['iconSizes']) => ({
    is1: disi.is1 + 'px',
    is2: disi.is2 + 'px',
    is3: disi.is3 + 'px',
    is4: disi.is4 + 'px',
});

export const getFontSize = (dfsi: ThemeInput['typography']['fontSizes']) => ({
    fs1: dfsi.fs1 + 'px',
    fs2: dfsi.fs2 + 'px',
    fs3: dfsi.fs3 + 'px',
    fs4: dfsi.fs4 + 'px',
    fs5: dfsi.fs5 + 'px',
    fs6: dfsi.fs6 + 'px',
    fs7: dfsi.fs7 + 'px',
    fs8: dfsi.fs8 + 'px',
    fs9: dfsi.fs9 + 'px',
    fs10: dfsi.fs10 + 'px',
    fs11: dfsi.fs11 + 'px',
});

export const getSpacing = (dssi: ThemeInput['spacing']) => ({
    ss1: dssi.ss1 + 'px',
    ss2: dssi.ss2 + 'px',
    ss3: dssi.ss3 + 'px',
    ss4: dssi.ss4 + 'px',
    ss6: dssi.ss6 + 'px',
    ss8: dssi.ss8 + 'px',
    ss12: dssi.ss12 + 'px',
    ss16: dssi.ss16 + 'px',
    ss24: dssi.ss24 + 'px',
    ss32: dssi.ss32 + 'px',
    ss48: dssi.ss48 + 'px',
    ss64: dssi.ss64 + 'px',
    ss96: dssi.ss96 + 'px',
    ss128: dssi.ss128 + 'px',
    ss160: dssi.ss160 + 'px',
    ss192: dssi.ss192 + 'px',
    horizontalMaxWidth: {
        paragraph: '640px',
    },
});

const convertOffsetsToBoxShadow = (colorInput: string) => (offset: string) => `${offset} ${colorInput}`;

const boxShadowOffsets = {
    bso1: ['0 1px 3px', '0 1px 2px'],
    bso2: ['0 3px 6px', '0 2px 4px'],
    bso3: ['0 10px 20px', '0 3px 6px'],
    bso4: ['0 15px 25px', '0 5px 10px'],
    bso5: ['0 20px 40px', '0 7px 14px'],
};

export const getBoxShadow = (colorInput: string) => ({
    bs1: boxShadowOffsets.bso1.map(convertOffsetsToBoxShadow(colorInput)).join(', '),
    bs2: boxShadowOffsets.bso2.map(convertOffsetsToBoxShadow(colorInput)).join(', '),
    bs3: boxShadowOffsets.bso3.map(convertOffsetsToBoxShadow(colorInput)).join(', '),
    bs4: boxShadowOffsets.bso4.map(convertOffsetsToBoxShadow(colorInput)).join(', '),
    bs5: boxShadowOffsets.bso5.map(convertOffsetsToBoxShadow(colorInput)).join(', '),
});

const transitionTimingFunction = 'cubic-bezier(0.645, 0.045, 0.355, 1.000)';

export const getTransitions = (transitions: ThemeInput['transitions']) => ({
    fast: `${transitions.fast}ms ${transitionTimingFunction}`,
    medium: `${transitions.medium}ms ${transitionTimingFunction}`,
    slow: `${transitions.slow}ms ${transitionTimingFunction}`,
    durations: {
        fast: transitions.fast,
        medium: transitions.medium,
        slow: transitions.slow,
    },
    transitionTimingFunction,
});
