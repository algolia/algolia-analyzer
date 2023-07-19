import uniq from 'lodash/uniq';

import { type Request } from 'utils';

import { noValueText, type FilteringOption } from './FilteringOption';

export const getOptions = <T extends FilteringOption>(
  requests: Request[],
  types: ReadonlyArray<T['type']>
): T[] =>
  types.flatMap((type) =>
    uniq(requests.map((r) => r[type])).map((value) => {
      // @ts-expect-error to improve
      const option: T = {
        value: value ?? '',
        label: value ? value.toString() : noValueText[type],
        type,
        reversed: false,
      };
      return option;
    })
  );
