import { type Request } from 'utils';

import type { FilterType, FilteringOption } from './FilteringOption';

type OptionsValue = boolean | number | string;

export const filterByType = (
  requests: Request[],
  filters: FilteringOption[],
  type: FilterType,
): Request[] => {
  let filteredRequests = requests;

  const selectedValues = filters.filter((o) => o.type === type && !o.reversed).map((o) => o.value);
  const reverseSelectedValues = filters
    .filter((o) => o.type === type && o.reversed)
    .map((o) => o.value);

  switch (type) {
    // basic options: non nullable & non optional
    case 'api':
    case 'method':
    case 'statusCode':
      if (selectedValues.length > 0) {
        filteredRequests = filteredRequests.filter((r) =>
          selectedValues.includes(r[type] as OptionsValue),
        );
      }
      if (reverseSelectedValues.length > 0) {
        filteredRequests = filteredRequests.filter(
          (r) => !reverseSelectedValues.includes(r[type] as OptionsValue),
        );
      }
      break;
    // optional options
    case 'cluster':
      if (selectedValues.length > 0) {
        filteredRequests = filteredRequests.filter(
          (r) => r[type] && selectedValues.includes(r[type] as OptionsValue),
        );
      }
      if (reverseSelectedValues.length > 0) {
        filteredRequests = filteredRequests.filter(
          (r) => !r[type] || !reverseSelectedValues.includes(r[type] as OptionsValue),
        );
      }
      break;
    // nullable & non-optional options
    // (& there is a "no apiSupPath/index" that is selectable)
    case 'apiSubPath':
    case 'index':
      if (selectedValues.length > 0) {
        const nullableSelectedValues = selectedValues.map(
          (v) => v ?? null,
        ) as Array<OptionsValue | null>;
        filteredRequests = filteredRequests.filter(
          (r) =>
            (!r[type] && nullableSelectedValues.find((i) => !i) !== undefined) || // selected subPath is "no apiSupPath/index"
            nullableSelectedValues.includes(r[type] as OptionsValue | null),
        );
      }
      if (reverseSelectedValues.length > 0) {
        const nullableReversedSelectedValues = reverseSelectedValues.map(
          (v) => v ?? null,
        ) as Array<OptionsValue | null>;
        filteredRequests = filteredRequests.filter((r) =>
          !r[type]
            ? nullableReversedSelectedValues.find((i) => !i) === undefined // selected subPath is !"no apiSupPath/index"
            : !nullableReversedSelectedValues.includes(r[type] as OptionsValue | null),
        );
      }
      break;
  }
  return filteredRequests;
};
