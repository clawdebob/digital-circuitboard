import * as _ from 'lodash';

export const mergeCssClasses = (classesArr: Array<string>): string => _
  .chain(classesArr)
  .filter()
  .reduce((acc, name) => acc + ' ' + name, '')
  .value();
