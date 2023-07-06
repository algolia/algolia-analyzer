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
import { getLocalStorageValue, setLocalStorageValue, type Request, type ApiType } from 'utils';

import { type GeneralOption, type UrlOption } from './FilteringOption';
import { GeneralOptionItemComponent } from './GeneralOption';
import { RequestLine } from './RequestLine';
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
      filteredRequests = filteredRequests.filter(
        (r) => r.cluster && selectedClusters.includes(r.cluster)
      );
    }
    if (reversedSelectedClusters.length > 0) {
      filteredRequests = filteredRequests.filter(
        (r) => !r.cluster || !reversedSelectedClusters.includes(r.cluster)
      );
    }

    const selectedApis: ApiType[] = selectedUrlOptions
      .filter((o) => o.type === 'api' && !o.reversed)
      .map((o) => (o.value ?? null) as ApiType);
    const reversedSelectedApis: ApiType[] = selectedUrlOptions
      .filter((o) => o.type === 'api' && o.reversed)
      .map((o) => (o.value ?? null) as ApiType);
    if (selectedApis.length > 0) {
      filteredRequests = filteredRequests.filter((r) => selectedApis.includes(r.api));
    }
    if (reversedSelectedApis.length > 0) {
      filteredRequests = filteredRequests.filter((r) => !reversedSelectedApis.includes(r.api));
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

    const selectedSubPaths: Array<string | null> = selectedUrlOptions
      .filter((o) => o.type === 'apiSubPath' && !o.reversed)
      .map((o) => (o.value ?? null) as string | null);
    const reversedSelectedSubPaths: Array<string | null> = selectedUrlOptions
      .filter((o) => o.type === 'apiSubPath' && o.reversed)
      .map((o) => (o.value ?? null) as string | null);
    if (selectedSubPaths.length > 0) {
      filteredRequests = filteredRequests.filter(
        (r) =>
          (!r.apiSubPath && selectedSubPaths.find((i) => !i) !== undefined) || // selected subPath is "no apiSupPath"
          selectedSubPaths.includes(r.apiSubPath)
      );
    }
    if (reversedSelectedSubPaths.length > 0) {
      filteredRequests = filteredRequests.filter((r) =>
        !r.apiSubPath
          ? reversedSelectedSubPaths.find((i) => !i) === undefined // selected subPath is !"no apiSupPath"
          : !reversedSelectedSubPaths.includes(r.apiSubPath)
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
    const clusters = uniq(
      selectedRequests.filter((r) => r.cluster).map((r) => r.cluster)
    ) as string[];
    const indices = uniq(selectedRequests.map((r) => r.index));
    const subPaths = uniq(selectedRequests.map((r) => r.apiSubPath));
    const apis = uniq(selectedRequests.map((r) => r.api));
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
      subPaths.map((subPath) => ({
        value: subPath ?? '',
        label: subPath ?? 'no API path',
        type: 'apiSubPath',
        reversed: false,
      })),
      apis.map((api) => ({
        value: api,
        label: api,
        type: 'api',
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
              <th className={cx('!font-bold', selectedLine === undefined && 'w-48')}>
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
              <th>
                <div className="flex space-x-2 items-baseline">
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
                  {selectedLine === undefined && (
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
                  )}
                </div>
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
