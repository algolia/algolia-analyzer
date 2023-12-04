import {
  AutoComplete,
  Button,
  Card,
  EmptyState,
  Medallion,
  TooltipWrapper,
} from '@algolia/satellite';
import isEqual from 'lodash/isEqual';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { HelpCircle, Search } from 'react-feather';

import { getLocalStorageValue, setLocalStorageValue, type Request } from 'utils';

import {
  allFilterTypes,
  generalTypes,
  type GeneralOption,
  type UrlOption,
  urlTypes,
} from './FilteringOption';
import { GeneralOptionItemComponent } from './GeneralOption';
import { RequestLine } from './RequestLine';
import { UrlOptionItemComponent } from './UrlOption';
import { filterByType } from './filterByType';
import { getOptions } from './getOptions';

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
    const newGeneralOptions = selectedGeneralOptions;
    const newUrlOptions = selectedUrlOptions;
    try {
      await setLocalStorageValue(generalOptionsKey, newGeneralOptions);
      setDefaultGeneralOptions(newGeneralOptions);
      await setLocalStorageValue(urlOptionsKey, newUrlOptions);
      setDefaultUrlOptions(newUrlOptions);
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
    const allOptions = [...selectedGeneralOptions, ...selectedUrlOptions];
    let filteredRequests = requests;
    for (const type of allFilterTypes) {
      filteredRequests = filterByType(filteredRequests, allOptions, type);
    }
    return filteredRequests;
  }, [requests, selectedGeneralOptions, selectedUrlOptions]);

  const generalOptions = useMemo(
    () => getOptions<GeneralOption>(selectedRequests, generalTypes),
    [selectedRequests],
  );

  const urlOptions = useMemo(
    () => getOptions<UrlOption>(selectedRequests, urlTypes),
    [selectedRequests],
  );

  const deleteGeneralOption = useCallback(
    (option: GeneralOption) =>
      setSelectedGeneralOptions((options) => options.filter((o) => o.value !== option.value)),
    [],
  );

  const deleteUrlOption = useCallback(
    (option: UrlOption) =>
      setSelectedUrlOptions((options) => options.filter((o) => o.value !== option.value)),
    [],
  );

  const reverseGeneralOption = useCallback(
    (option: GeneralOption) =>
      setSelectedGeneralOptions((options) =>
        options.map((o) =>
          o.value === option.value ? { ...option, reversed: !option.reversed } : o,
        ),
      ),
    [],
  );

  const reverseUrlOption = useCallback(
    (option: UrlOption) =>
      setSelectedUrlOptions((options) =>
        options.map((o) =>
          o.value === option.value ? { ...option, reversed: !option.reversed } : o,
        ),
      ),
    [],
  );

  return (
    <Card fullBleed={true} className="w-[calc(100%-1rem)] mx-2 mb-2">
      <div>
        <table className="stl-table-with-highlight stl-table table-fixed">
          <thead>
            <tr className="capitalize">
              <th className="!font-bold w-48">
                <div className="flex items-center space-x-2">
                  <span>general</span>
                  <ReverseTagInfo />
                </div>
              </th>
              <th className="!font-bold">
                <div className="flex items-center space-x-2">
                  <span>url</span>
                  <ReverseTagInfo />
                </div>
              </th>
            </tr>
            <tr>
              <th>
                <div className="flex items-baseline">
                  <AutoComplete
                    className="max-w-full"
                    valuesClassName="max-w-full py-1.5"
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
                </div>
              </th>
              <th>
                <div className="flex space-x-2 items-baseline">
                  <AutoComplete
                    className="grow"
                    valuesClassName="py-1.5"
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
              leadIllustration={<Medallion icon={Search} />}
              title="No request to Algolia has been intercepted yet."
              usageContext="result"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
