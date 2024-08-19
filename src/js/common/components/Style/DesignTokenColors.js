const primitiveColorNames = {
  blue50: '#E6F3FF',
  blue100: '#B2D6F8',
  blue200: '#8BBCE9',
  blue300: '#66A2D8',
  blue400: '#4187C6',
  blue500: '#206DB3',
  blue600: '#0858A1',
  blue700: '#074986',
  blue800: '#053C6D',
  blue900: '#042B4E',
  blueUI50: '#E2F2FD',
  blueUI100: '#BADCFF',
  blueUI200: '#8CC7FF',
  blueUI300: '#66B7F2',
  blueUI400: '#35A1FF',
  blueUI500: '#1293F5',
  blueUI600: '#1285E7',
  blueUI700: '#1073D4',
  blueUI800: '#0E62C2',
  blueUI900: '#0943A3',

  gray50: '#F2F2F0',
  gray100: '#D2D2D2',
  gray200: '#B7B7B7',
  gray300: '#9D9D9D',
  gray400: '#848484',
  gray500: '#6B6B6B',
  gray600: '#5E5E5B',
  gray700: '#484848',
  gray800: '#3B3B3B',
  gray900: '#2A2A2C',
  grayUI50: '#EEEEEE',
  grayUI100: '#DADADA',
  grayUI200: '#C5C5C5',
  grayUI300: '#B0B0B0',
  grayUI400: '#9A9A9A',
  grayUI500: '#848484',
  grayUI600: '#6E6E6E',
  grayUI700: '#575757',
  grayUI800: '#4A4A4A',
  grayUI900: '#3D3D3D',

  greenUI50: '#E5F4E3',
  greenUI100: '#C1E4BB',
  greenUI200: '#9CD299',
  greenUI300: '#5DB664',
  greenUI400: '#45B63B',
  greenUI500: '#06A900',
  greenUI600: '#009A00',
  greenUI700: '#008900',
  greenUI800: '#007800',
  greenUI900: '#005A00',

  orange50: '#FCEFE4',
  orange100: '#FBC89C',
  orange200: '#FBA255',
  orange300: '#FB7704',
  orange400: '#D46505',
  orange500: '#AC5204',
  orange600: '#8F4403',
  orange700: '#743703',
  orange800: '#602E02',
  orange900: '#442102',
  orangeUI50: '#FCE9E7',
  orangeUI100: '#FECEBB',
  orangeUI200: '#FEAE8F',
  orangeUI300: '#FD8E64',
  orangeUI400: '#FD7642',
  orangeUI500: '#FD6124',
  orangeUI600: '#F25B20',
  orangeUI700: '#E4531B',
  orangeUI800: '#D74C19',
  orangeUI900: '#BE3E14',

  redUI50: '#FFE8EB',
  redUI100: '#FEC8CC',
  redUI200: '#F4908E',
  redUI300: '#EB6163',
  redUI400: '#F3363D',
  redUI500: '#EF0716',
  redUI600: '#DC2B23',
  redUI700: '#CB201E',
  redUI800: '#BE1717',
  redUI900: '#AC060C',
  red50: '#FFEDF1',
  red100: '#FFC3D0',
  red200: '#FF98AE',
  red300: '#FA708D',
  red400: '#E1516F',
  red500: '#CB2649',
  red600: '#AA203D',
  red700: '#8B1A32',
  red800: '#74162A',
  red900: '#53101E',

  steel50: '#ECF2F7',
  steel100: '#C8D4DF',
  steel200: '#A7BACD',
  steel300: '#87A0B9',
  steel400: '#6888A5',
  steel500: '#4E6E8E',
  steel600: '#3A5B7C',
  steel700: '#2C4A66',
  steel800: '#1F3A53',
  steel900: '#142B41',

  white: '#FFFFFF',

  yellowUI50: '#FBF6DF',
  yellowUI100: '#FAE8AE',
  yellowUI200: '#F6DA79',
  yellowUI300: '#F2CC40',
  yellowUI400: '#F0C000',
  yellowUI500: '#EEB600',
  yellowUI600: '#DDAD00',
  yellowUI700: '#CCA101',
  yellowUI800: '#BE9500',
  yellowUI900: '#9E7100',
};

// These are semanticColorNames
const DesignTokenColors = {
  accent50: primitiveColorNames.orange50,
  accent100: primitiveColorNames.orange100,
  accent200: primitiveColorNames.orange200,
  accent300: primitiveColorNames.orange300,
  accent400: primitiveColorNames.orange400,
  accent500: primitiveColorNames.orange500,
  accent600: primitiveColorNames.orange600,
  accent700: primitiveColorNames.orange700,
  accent800: primitiveColorNames.orange800,
  accent900: primitiveColorNames.orange900,

  alert50: primitiveColorNames.redUI50,
  alert100: primitiveColorNames.redUI100,
  alert200: primitiveColorNames.redUI200,
  alert300: primitiveColorNames.redUI300,
  alert400: primitiveColorNames.redUI400,
  alert500: primitiveColorNames.redUI500,
  alert600: primitiveColorNames.redUI600,
  alert700: primitiveColorNames.redUI700,
  alert800: primitiveColorNames.redUI800,
  alert900: primitiveColorNames.redUI900,

  caution50: primitiveColorNames.yellowUI50,
  caution100: primitiveColorNames.yellowUI100,
  caution200: primitiveColorNames.yellowUI200,
  caution300: primitiveColorNames.yellowUI300,
  caution400: primitiveColorNames.yellowUI400,
  caution500: primitiveColorNames.yellowUI500,
  caution600: primitiveColorNames.yellowUI600,
  caution700: primitiveColorNames.yellowUI700,
  caution800: primitiveColorNames.yellowUI800,
  caution900: primitiveColorNames.yellowUI900,

  confirmation50: primitiveColorNames.greenUI50,
  confirmation100: primitiveColorNames.greenUI100,
  confirmation200: primitiveColorNames.greenUI200,
  confirmation300: primitiveColorNames.greenUI300,
  confirmation400: primitiveColorNames.greenUI400,
  confirmation500: primitiveColorNames.greenUI500,
  confirmation600: primitiveColorNames.greenUI600,
  confirmation700: primitiveColorNames.greenUI700,
  confirmation800: primitiveColorNames.greenUI800,
  confirmation900: primitiveColorNames.greenUI900,

  info50: primitiveColorNames.blueUI50,
  info100: primitiveColorNames.blueUI100,
  info200: primitiveColorNames.blueUI200,
  info300: primitiveColorNames.blueUI300,
  info400: primitiveColorNames.blueUI400,
  info500: primitiveColorNames.blueUI500,
  info600: primitiveColorNames.blueUI600,
  info700: primitiveColorNames.blueUI700,
  info800: primitiveColorNames.blueUI800,
  info900: primitiveColorNames.blueUI900,

  neutral50: primitiveColorNames.gray50,
  neutral100: primitiveColorNames.gray100,
  neutral200: primitiveColorNames.gray200,
  neutral300: primitiveColorNames.gray300,
  neutral400: primitiveColorNames.gray400,
  neutral500: primitiveColorNames.gray500,
  neutral600: primitiveColorNames.gray600,
  neutral700: primitiveColorNames.gray700,
  neutral800: primitiveColorNames.gray800,
  neutral900: primitiveColorNames.gray900,

  neutralUI50: primitiveColorNames.grayUI50,
  neutralUI100: primitiveColorNames.grayUI100,
  neutralUI200: primitiveColorNames.grayUI200,
  neutralUI300: primitiveColorNames.grayUI300,
  neutralUI400: primitiveColorNames.grayUI400,
  neutralUI500: primitiveColorNames.grayUI500,
  neutralUI600: primitiveColorNames.grayUI600,
  neutralUI700: primitiveColorNames.grayUI700,
  neutralUI800: primitiveColorNames.grayUI800,
  neutralUI900: primitiveColorNames.grayUI900,

  primary50: primitiveColorNames.blue50,
  primary100: primitiveColorNames.blue100,
  primary200: primitiveColorNames.blue200,
  primary300: primitiveColorNames.blue300,
  primary400: primitiveColorNames.blue400,
  primary500: primitiveColorNames.blue500,
  primary600: primitiveColorNames.blue600,
  primary700: primitiveColorNames.blue700,
  primary800: primitiveColorNames.blue800,
  primary900: primitiveColorNames.blue900,

  secondary50: primitiveColorNames.steel50,
  secondary100: primitiveColorNames.steel100,
  secondary200: primitiveColorNames.steel200,
  secondary300: primitiveColorNames.steel300,
  secondary400: primitiveColorNames.steel400,
  secondary500: primitiveColorNames.steel500,
  secondary600: primitiveColorNames.steel600,
  secondary700: primitiveColorNames.steel700,
  secondary800: primitiveColorNames.steel800,
  secondary900: primitiveColorNames.steel900,

  tertiary50: primitiveColorNames.red50,
  tertiary100: primitiveColorNames.red100,
  tertiary200: primitiveColorNames.red200,
  tertiary300: primitiveColorNames.red300,
  tertiary400: primitiveColorNames.red400,
  tertiary500: primitiveColorNames.red500,
  tertiary600: primitiveColorNames.red600,
  tertiary700: primitiveColorNames.red700,
  tertiary800: primitiveColorNames.red800,
  tertiary900: primitiveColorNames.red900,

  warning50: primitiveColorNames.orangeUI50,
  warning100: primitiveColorNames.orangeUI100,
  warning200: primitiveColorNames.orangeUI200,
  warning300: primitiveColorNames.orangeUI300,
  warning400: primitiveColorNames.orangeUI400,
  warning500: primitiveColorNames.orangeUI500,
  warning600: primitiveColorNames.orangeUI600,
  warning700: primitiveColorNames.orangeUI700,
  warning800: primitiveColorNames.orangeUI800,
  warning900: primitiveColorNames.orangeUI900,

  whiteUI: primitiveColorNames.white,
};

export default DesignTokenColors;