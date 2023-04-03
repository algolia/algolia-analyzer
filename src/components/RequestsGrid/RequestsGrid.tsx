import {
  AutoComplete,
  Button,
  Card,
  EmptyState,
  Medallion,
  TooltipWrapper,
} from '@algolia/satellite';
import cx from 'classnames';
import concat from 'lodash/concat';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { HelpCircle, Search } from 'react-feather';

import { useSidebar } from 'components/SidebarContent';
import { getLocalStorageValue, setLocalStorageValue, type Request } from 'utils';

import type { GeneralOption } from './GeneralOption';
import { GeneralOptionItemComponent } from './GeneralOption';
import { RequestLine } from './RequestLine';
import type { UrlOption } from './UrlOption';
import { UrlOptionItemComponent } from './UrlOption';

interface RequestsGridProps {
  requests: Request[];
}

const generalOptionsKey = 'default-general-options';
const urlOptionsKey = 'default-url-options';

const ReverseTagInfo: FC = () => (
  <TooltipWrapper content='You can click on a selected tag below to reverse the filter effect. It will then be marked with a leading exclamation mark "!".'>
    <HelpCircle className="w-3 h-3 text-grey-700" />
  </TooltipWrapper>
);

export const RequestsGrid: FC<RequestsGridProps> = ({ requests }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [defaultGeneralOptions, setDefaultGeneralOptions] = useState<GeneralOption[]>([]);
  const [defaultUrlOptions, setDefaultUrlOptions] = useState<UrlOption[]>([]);
  const [selectedGeneralOptions, setSelectedGeneralOptions] = useState<GeneralOption[]>([]);
  const [selectedUrlOptions, setSelectedUrlOptions] = useState<UrlOption[]>([]);
  const { selectedLine } = useSidebar();

  useEffect(() => {
    getLocalStorageValue<GeneralOption[]>(generalOptionsKey).then((generalOptions) => {
      if (!generalOptions) return;
      setSelectedGeneralOptions(generalOptions);
      setDefaultGeneralOptions(generalOptions);
    });

    getLocalStorageValue<UrlOption[]>(urlOptionsKey).then((urlOptions) => {
      if (!urlOptions) return;
      setSelectedUrlOptions(urlOptions);
      setDefaultUrlOptions(urlOptions);
    });
  }, []);

  const saveDefaultOptions = async (): Promise<void> => {
    setIsSaving(true);
    try {
      await setLocalStorageValue(generalOptionsKey, selectedGeneralOptions);
      await setLocalStorageValue(urlOptionsKey, selectedUrlOptions);
    } finally {
      setIsSaving(false);
    }
  };

  const canSaveOptions: boolean = useMemo(() => {
    if (selectedGeneralOptions.length <= 0 && selectedUrlOptions.length <= 0) return false;
    return (
      !isEqual(selectedGeneralOptions, defaultGeneralOptions) ||
      !isEqual(selectedUrlOptions, defaultUrlOptions)
    );
  }, [defaultGeneralOptions, defaultUrlOptions, selectedGeneralOptions, selectedUrlOptions]);

  const selectedRequests = useMemo(() => {
    let filteredRequests = requests;
    const selectedMethods: string[] = selectedGeneralOptions
      .filter((o) => o.type === 'method' && !o.reversed)
      .map((o) => o.value as string);
    const reverseSelectedMethods: string[] = selectedGeneralOptions
      .filter((o) => o.type === 'method' && o.reversed)
      .map((o) => o.value as string);
    if (selectedMethods.length > 0) {
      filteredRequests = filteredRequests.filter((r) => selectedMethods.includes(r.method));
    }
    if (reverseSelectedMethods.length > 0) {
      filteredRequests = filteredRequests.filter((r) => !reverseSelectedMethods.includes(r.method));
    }

    const selectedStatusCodes: number[] = selectedGeneralOptions
      .filter((o) => o.type === 'statusCode' && !o.reversed)
      .map((o) => o.value as number);
    const reverseSelectedStatusCodes: number[] = selectedGeneralOptions
      .filter((o) => o.type === 'statusCode' && o.reversed)
      .map((o) => o.value as number);
    if (selectedStatusCodes.length > 0) {
      filteredRequests = filteredRequests.filter((r) => selectedStatusCodes.includes(r.statusCode));
    }
    if (reverseSelectedStatusCodes.length > 0) {
      filteredRequests = filteredRequests.filter(
        (r) => !reverseSelectedStatusCodes.includes(r.statusCode)
      );
    }

    const selectedClusters: string[] = selectedUrlOptions
      .filter((o) => o.type === 'cluster' && !o.reversed)
      .map((o) => o.value as string);
    const reversedSelectedClusters: string[] = selectedUrlOptions
      .filter((o) => o.type === 'cluster' && o.reversed)
      .map((o) => o.value as string);
    if (selectedClusters.length > 0) {
      filteredRequests = filteredRequests.filter((r) => selectedClusters.includes(r.cluster));
    }
    if (reversedSelectedClusters.length > 0) {
      filteredRequests = filteredRequests.filter(
        (r) => !reversedSelectedClusters.includes(r.cluster)
      );
    }

    const selectedIndices: Array<string | null> = selectedUrlOptions
      .filter((o) => o.type === 'index' && !o.reversed)
      .map((o) => (o.value ?? null) as string | null);
    const reversedSelectedIndices: Array<string | null> = selectedUrlOptions
      .filter((o) => o.type === 'index' && o.reversed)
      .map((o) => (o.value ?? null) as string | null);
    if (selectedIndices.length > 0) {
      filteredRequests = filteredRequests.filter(
        (r) =>
          (!r.index && selectedIndices.find((i) => !i) !== undefined) || // selected index is "no index"
          selectedIndices.includes(r.index)
      );
    }
    if (reversedSelectedIndices.length > 0) {
      filteredRequests = filteredRequests.filter((r) =>
        !r.index
          ? reversedSelectedIndices.find((i) => !i) === undefined // selected index is !"no index"
          : !reversedSelectedIndices.includes(r.index)
      );
    }

    const selectedApiSubPaths: Array<string | null> = selectedUrlOptions
      .filter((o) => o.type === 'apiSubPath' && !o.reversed)
      .map((o) => (o.value ?? null) as string | null);
    const reversedSelectedApiSubPaths: Array<string | null> = selectedUrlOptions
      .filter((o) => o.type === 'apiSubPath' && o.reversed)
      .map((o) => (o.value ?? null) as string | null);
    if (selectedApiSubPaths.length > 0) {
      filteredRequests = filteredRequests.filter(
        (r) =>
          (!r.apiSubPath && selectedApiSubPaths.find((i) => !i) !== undefined) || // selected apiSubPath is "no apiSupPath"
          selectedApiSubPaths.includes(r.apiSubPath)
      );
    }
    if (reversedSelectedApiSubPaths.length > 0) {
      filteredRequests = filteredRequests.filter((r) =>
        !r.apiSubPath
          ? reversedSelectedApiSubPaths.find((i) => !i) === undefined // selected apiSubPath is !"no apiSupPath"
          : !reversedSelectedApiSubPaths.includes(r.apiSubPath)
      );
    }
    return filteredRequests;
  }, [requests, selectedGeneralOptions, selectedUrlOptions]);

  const generalOptions: GeneralOption[] = useMemo(() => {
    const methods = uniq(selectedRequests.map((r) => r.method));
    const statusCodes = uniq(selectedRequests.map((r) => r.statusCode));
    return concat<GeneralOption>(
      methods.map((method) => ({
        value: method,
        label: method,
        type: 'method',
        reversed: false,
      })),
      statusCodes.map((code) => ({
        value: code,
        label: code.toString(),
        type: 'statusCode',
        reversed: false,
      }))
    );
  }, [selectedRequests]);

  const urlOptions: UrlOption[] = useMemo(() => {
    const clusters = uniq(selectedRequests.map((r) => r.cluster));
    const indices = uniq(selectedRequests.map((r) => r.index));
    const apiSubPaths = uniq(selectedRequests.map((r) => r.apiSubPath));
    return concat<UrlOption>(
      clusters.map((cluster) => ({
        value: cluster,
        label: cluster,
        type: 'cluster',
        reversed: false,
      })),
      indices.map((index) => ({
        value: index ?? '',
        label: index ?? 'no index',
        type: 'index',
        reversed: false,
      })),
      apiSubPaths.map((apiSubPath) => ({
        value: apiSubPath ?? '',
        label: apiSubPath ?? 'no API path',
        type: 'apiSubPath',
        reversed: false,
      }))
    );
  }, [selectedRequests]);

  const deleteGeneralOption = useCallback(
    (option: GeneralOption) =>
      setSelectedGeneralOptions((options) => options.filter((o) => o.value !== option.value)),
    []
  );

  const deleteUrlOption = useCallback(
    (option: UrlOption) =>
      setSelectedUrlOptions((options) => options.filter((o) => o.value !== option.value)),
    []
  );

  const reverseGeneralOption = useCallback(
    (option: GeneralOption) =>
      setSelectedGeneralOptions((options) =>
        options.map((o) =>
          o.value === option.value ? { ...option, reversed: !option.reversed } : o
        )
      ),
    []
  );

  const reverseUrlOption = useCallback(
    (option: UrlOption) =>
      setSelectedUrlOptions((options) =>
        options.map((o) =>
          o.value === option.value ? { ...option, reversed: !option.reversed } : o
        )
      ),
    []
  );

  return (
    <Card fullBleed={true} className="w-[calc(100%-1rem)] mx-2 mb-2">
      <div>
        <table className="stl-table-with-highlight stl-table table-fixed">
          <thead>
            <tr className="capitalize">
              <th className={cx('!font-bold', selectedLine === undefined && 'w-72')}>
                general <ReverseTagInfo />
              </th>
              <th className="!font-bold">
                url <ReverseTagInfo />
              </th>
            </tr>
            <tr>
              <th>
                <AutoComplete
                  multiple={true}
                  options={generalOptions}
                  value={selectedGeneralOptions}
                  optionItemComponent={GeneralOptionItemComponent}
                  renderValueTemplate={(args): JSX.Element => (
                    <GeneralOptionItemComponent
                      {...args}
                      deleteOption={deleteGeneralOption}
                      reverseOption={reverseGeneralOption}
                    />
                  )}
                  onChange={(options): void =>
                    setSelectedGeneralOptions((options as GeneralOption[]) ?? [])
                  }
                />
              </th>
              <th className="flex space-x-2 items-baseline">
                <AutoComplete
                  className="grow"
                  multiple={true}
                  options={urlOptions}
                  value={selectedUrlOptions}
                  optionItemComponent={({ option, ...args }): JSX.Element => (
                    <UrlOptionItemComponent {...args} option={option as UrlOption} />
                  )}
                  renderValueTemplate={(args): JSX.Element => (
                    <UrlOptionItemComponent
                      {...args}
                      deleteOption={deleteUrlOption}
                      reverseOption={reverseUrlOption}
                    />
                  )}
                  onChange={(options): void =>
                    setSelectedUrlOptions((options as UrlOption[]) ?? [])
                  }
                />
                <TooltipWrapper content="Save these filters as your default for when you open this Panel.">
                  <Button
                    variant="primary"
                    loading={isSaving}
                    disabled={!canSaveOptions}
                    onClick={saveDefaultOptions}
                  >
                    Save
                  </Button>
                </TooltipWrapper>
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedRequests.length > 0 && (
              <>
                {selectedRequests.map((request) => (
                  <RequestLine request={request} key={request.id} />
                ))}
              </>
            )}
          </tbody>
        </table>
        {selectedRequests.length <= 0 && (
          <div className="flex items-center justify-center px-6 py-20">
            <EmptyState
              centered={true}
              medallion={<Medallion icon={Search} />}
              title="No request to Algolia has been intercepted yet."
              usageContext="result"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
