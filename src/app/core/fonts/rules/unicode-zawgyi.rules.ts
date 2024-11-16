import { Rule } from '../types/font.types';

export const unicodeToZawgyiRules: Rule[] = [
  {
    from: '\u1004\u103a\u1039',
    to: '\u1064',
  },
  {
    from: '\u1039\u1010\u103d',
    to: '\u1096',
  },
  {
    from: '\u102b\u103a',
    to: '\u105a',
  },
  {
    from: '\u102d\u1036',
    to: '\u108e',
  },
  {
    from: '\u104e\u1004\u103a\u1038',
    to: '\u104e',
  },
  {
    from: '[\u1025\u1009](?=\u1039)',
    to: '\u106a',
  },
  {
    from: '\u1009(?=[\u102f\u1030])',
    to: '\u1025',
  },
  {
    from: '[\u1025\u1009](?=[\u1037]?[\u103a])',
    to: '\u1025',
  },
  {
    from: '\u100a(?=[\u1039\u103d])',
    to: '\u106b',
  },
  {
    from: '(\u1039[\u1000-\u1021])(\u102D){0,1}\u102f',
    to: '$1$2\u1033',
  },
  {
    from: '(\u1039[\u1000-\u1021])\u1030',
    to: '$1\u1034',
  },
  {
    from: '\u1014(?=[\u102d\u102e\u102f\u103A]?[\u1030\u103d\u103e\u102f\u1039])',
    to: '\u108f',
  },
  {
    from: '\u1014(?=\u103A\u102F )',
    to: '\u108f',
  },
  {
    from: '\u1014\u103c',
    to: '\u108f\u103c',
  },
  {
    from: '\u1039\u1000',
    to: '\u1060',
  },
  {
    from: '\u1039\u1001',
    to: '\u1061',
  },
  {
    from: '\u1039\u1002',
    to: '\u1062',
  },
  {
    from: '\u1039\u1003',
    to: '\u1063',
  },
  {
    from: '\u1039\u1005',
    to: '\u1065',
  },
  {
    from: '\u1039\u1006',
    to: '\u1066',
  },
  {
    from: '\u1039\u1007',
    to: '\u1068',
  },
  {
    from: '\u1039\u1008',
    to: '\u1069',
  },
  {
    from: '\u1039\u100b',
    to: '\u106c',
  },
  {
    from: '\u100b\u1039\u100c',
    to: '\u1092',
  },
  {
    from: '\u1039\u100c',
    to: '\u106d',
  },
  {
    from: '\u100d\u1039\u100d',
    to: '\u106e',
  },
  {
    from: '\u100d\u1039\u100e',
    to: '\u106f',
  },
  {
    from: '\u1039\u100f',
    to: '\u1070',
  },
  {
    from: '\u1039\u1010',
    to: '\u1071',
  },
  {
    from: '\u1039\u1011',
    to: '\u1073',
  },
  {
    from: '\u1039\u1012',
    to: '\u1075',
  },
  {
    from: '\u1039\u1013',
    to: '\u1076',
  },
  {
    from: '\u1039[\u1014\u108f]',
    to: '\u1077',
  },
  {
    from: '\u1039\u1015',
    to: '\u1078',
  },
  {
    from: '\u1039\u1016',
    to: '\u1079',
  },
  {
    from: '\u1039\u1017',
    to: '\u107a',
  },
  {
    from: '\u1039\u1018',
    to: '\u107b',
  },
  {
    from: '\u1039\u1019',
    to: '\u107c',
  },
  {
    from: '\u1039\u101c',
    to: '\u1085',
  },
  {
    from: '\u103f',
    to: '\u1086',
  },
  {
    from: '\u103d\u103e',
    to: '\u108a',
  },
  {
    from: '(\u1064)([\u1000-\u1021])([\u103b\u103c]?)\u102d',
    to: '$2$3\u108b',
  },
  {
    from: '(\u1064)([\u1000-\u1021])([\u103b\u103c]?)\u102e',
    to: '$2$3\u108c',
  },
  {
    from: '(\u1064)([\u1000-\u1021])([\u103b\u103c]?)\u1036',
    to: '$2$3\u108d',
  },
  {
    from: '(\u1064)([\u1000-\u1021\u1040-\u1049])([\u103b\u103c]?)([\u1031]?)',
    to: '$2$3$4$1',
  },
  {
    from: '\u101b(?=([\u102d\u102e]?)[\u102f\u1030\u103d\u108a])',
    to: '\u1090',
  },
  {
    from: '\u100f\u1039\u100d',
    to: '\u1091',
  },
  {
    from: '\u100b\u1039\u100b',
    to: '\u1097',
  },
  {
    from: '([\u1000-\u1021\u108f\u1029\u106a\u106e\u106f\u1086\u1090\u1091\u1092\u1097\u1096])([\u1060-\u1069\u106c\u106d\u1070-\u107c\u1085\u108a])?([\u103b-\u103e]*)?\u1031',
    to: '\u1031$1$2$3',
  },
  {
    from: '\u103c\u103e',
    to: '\u103c\u1087',
  },
  {
    from: '([\u1000-\u1021\u108f\u1029])([\u1060-\u1069\u106c\u106d\u1070-\u107c\u1085])?(\u103c)',
    to: '$3$1$2',
  },
  {
    from: '\u103a',
    to: '\u1039',
  },
  {
    from: '\u103b',
    to: '\u103a',
  },
  {
    from: '\u103c',
    to: '\u103b',
  },
  {
    from: '\u103d',
    to: '\u103c',
  },
  {
    from: '\u103e',
    to: '\u103d',
  },
  {
    from: '([^\u103a\u100a])\u103d([\u102d\u102e]?)\u102f',
    to: '$1\u1088$2',
  },
  {
    from: '([\u101b\u103a\u103c\u108a\u1088\u1090])([\u1030\u103d])?([\u1032\u1036\u1039\u102d\u102e\u108b\u108c\u108d\u108e]?)(\u102f)?\u1037',
    to: '$1$2$3$4\u1095',
  },
  {
    from: '([\u102f\u1014\u1030\u103d])([\u1032\u1036\u1039\u102d\u102e\u108b\u108c\u108d\u108e]?)\u1037',
    to: '$1$2\u1094',
  },
  {
    from: '([\u103b])([\u1000-\u1021])([\u1087]?)([\u1036\u102d\u102e\u108b\u108c\u108d\u108e]?)\u102f',
    to: '$1$2$3$4\u1033',
  },
  {
    from: '([\u103b])([\u1000-\u1021])([\u1087]?)([\u1036\u102d\u102e\u108b\u108c\u108d\u108e]?)\u1030',
    to: '$1$2$3$4\u1034',
  },
  {
    from: '([\u103a\u103c\u100a\u1008\u100b\u100c\u100d\u1020\u1025])([\u103d]?)([\u1036\u102d\u102e\u108b\u108c\u108d\u108e]?)\u102f',
    to: '$1$2$3\u1033',
  },
  {
    from: '([\u103a\u103c\u100a\u1008\u100b\u100c\u100d\u1020\u1025])(\u103d?)([\u1036\u102d\u102e\u108b\u108c\u108d\u108e]?)\u1030',
    to: '$1$2$3\u1034',
  },
  {
    from: '([\u100a\u1020\u1009])\u103d',
    to: '$1\u1087',
  },
  {
    from: '\u103d\u1030',
    to: '\u1089',
  },
  {
    from: '\u103b([\u1000\u1003\u1006\u100f\u1010\u1011\u1018\u101a\u101c\u101a\u101e\u101f])',
    to: '\u107e$1',
  },
  {
    from: '\u107e([\u1000\u1003\u1006\u100f\u1010\u1011\u1018\u101a\u101c\u101a\u101e\u101f])([\u103c\u108a])([\u1032\u1036\u102d\u102e\u108b\u108c\u108d\u108e])',
    to: '\u1084$1$2$3',
  },
  {
    from: '\u107e([\u1000\u1003\u1006\u100f\u1010\u1011\u1018\u101a\u101c\u101a\u101e\u101f])([\u103c\u108a])',
    to: '\u1082$1$2',
  },
  {
    from: '\u107e([\u1000\u1003\u1006\u100f\u1010\u1011\u1018\u101a\u101c\u101a\u101e\u101f])([\u1033\u1034]?)([\u1032\u1036\u102d\u102e\u108b\u108c\u108d\u108e])',
    to: '\u1080$1$2$3',
  },
  {
    from: '\u103b([\u1000-\u1021])([\u103c\u108a])([\u1032\u1036\u102d\u102e\u108b\u108c\u108d\u108e])',
    to: '\u1083$1$2$3',
  },
  {
    from: '\u103b([\u1000-\u1021])([\u103c\u108a])',
    to: '\u1081$1$2',
  },
  {
    from: '\u103b([\u1000-\u1021])([\u1033\u1034]?)([\u1032\u1036\u102d\u102e\u108b\u108c\u108d\u108e])',
    to: '\u107f$1$2$3',
  },
  {
    from: '\u103a\u103d',
    to: '\u103d\u103a',
  },
  {
    from: '\u103a([\u103c\u108a])',
    to: '$1\u107d',
  },
  {
    from: '([\u1033\u1034])(\u1036?)\u1094',
    to: '$1$2\u1095',
  },
  {
    from: '\u108F\u1071',
    to: '\u108F\u1072',
  },
  {
    from: '\u108F\u1073',
    to: '\u108F\u1074',
  },
  {
    from: '([\u1000-\u1021])([\u107B\u1066])\u102C',
    to: '$1\u102C$2',
  },
  {
    from: '\u102C([\u107B\u1066])\u1037',
    to: '\u102C$1\u1094',
  },
  {
    from: '\u1047((?=[\u1000-\u1021]\u1039)|(?=[\u102c-\u1030\u1032\u1036-\u1038\u103c\u103d]))',
    to: '\u101b',
  },
];
