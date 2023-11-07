import { GetApiKeyResponse, Settings } from '@algolia/client-search';
import {
  Alert,
  AutoComplete,
  Badge,
  Button,
  Card,
  IconButton,
  Input,
  type Option,
  stl,
} from '@algolia/satellite';
import algoliasearch, { type SearchClient } from 'algoliasearch';
import { type FC, useCallback, useEffect, useState, useTransition } from 'react';
import { Slash, Settings as Cog } from 'react-feather';

import { Code } from './Code';

const indexToOption = (name: string): Option => ({ label: name, value: name });

export const Tools: FC = () => {
  const [pending, startTransition] = useTransition();
  const [appId, setAppId] = useState<string>();
  const [apiKey, setApiKey] = useState<string>();
  const [algoliaClient, setAlgoliaClient] = useState<SearchClient>();
  const [indexNames, setIndexNames] = useState<string[]>([]);
  const [indexName, setIndexName] = useState<string>();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [apiKeyInfo, setApiKeyInfo] = useState<GetApiKeyResponse | null>(null);

  const resetInput = useCallback(() => {
    setAppId('');
    setApiKey('');
    setIndexName('');
    setSettings(null);
  }, []);

  const getIndexSettings = async (name: string): Promise<void> => {
    if (!algoliaClient) return;
    const index = algoliaClient.initIndex(name);
    setSettings(await index.getSettings());
  };

  useEffect(() => {
    if (!appId || !apiKey) {
      startTransition(() => {
        setApiKeyInfo(null);
      });
    } else {
      const client = algoliasearch(appId, apiKey);
      setAlgoliaClient(client);
      client
        .getApiKey(apiKey)
        .then((value) => {
          startTransition(() => {
            setApiKeyInfo(value);
          });
        })
        .catch(() => {
          startTransition(() => {
            setApiKeyInfo(null);
          });
        });
    }
  }, [appId, apiKey]);

  useEffect(() => {
    if (algoliaClient && (apiKeyInfo?.acl ?? []).includes('listIndexes')) {
      algoliaClient.listIndices().then((res) => {
        setIndexNames(res.items.map((i) => i.name));
      });
    }
  }, [algoliaClient, apiKeyInfo?.acl]);

  return (
    <div className="mx-2 space-y-4 mb-4">
      <Card className="space-y-4">
        <h2 className={stl`display-small`}>Check API Key</h2>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            id="AppId"
            placeholder="Application Id"
            className="w-[7.5rem]"
            value={appId}
            onChange={(e): void => setAppId(e.currentTarget.value)}
          />
          <Input
            type="text"
            id="ApiKey"
            placeholder="API Key"
            className="w-[17.5rem]"
            value={apiKey}
            onChange={(e): void => setApiKey(e.currentTarget.value)}
          />
          <IconButton
            icon={Slash}
            variant="subtle"
            size="large"
            title="clear inputs"
            disabled={!appId && !apiKey}
            onClick={resetInput}
          />
        </div>
        {!pending && apiKeyInfo && (
          <>
            <div className="space-x-1 space-y-1">
              {apiKeyInfo.acl.length > 0 ? (
                <>
                  ACL ({apiKeyInfo.acl.length}):{' '}
                  {apiKeyInfo.acl.map((value) => (
                    <Badge value={value} key={value} />
                  ))}
                </>
              ) : (
                'no ACL 🙅'
              )}
            </div>
            <div className="space-x-1 space-y-1">
              {apiKeyInfo.indexes && apiKeyInfo.indexes.length > 0 ? (
                <>
                  indices:{' '}
                  {apiKeyInfo.indexes.map((index) => (
                    <Badge value={index} key={index} />
                  ))}
                </>
              ) : (
                'no indices restrictions'
              )}
            </div>
          </>
        )}
      </Card>
      <Card className="space-y-2">
        {!apiKeyInfo ||
          (!apiKeyInfo.acl.includes('settings') && (
            <Alert usageContext="section">
              Your ACL must contain <Badge value="settings" /> to get settings.
            </Alert>
          ))}
        <div className="flex items-center space-x-2">
          <AutoComplete
            multiple={false}
            clearable={true}
            creatable={true}
            placeholder="Index Name"
            className="w-[17.5rem]"
            options={indexNames.map(indexToOption)}
            value={indexName ? indexToOption(indexName) : undefined}
            onChange={(value): void => setIndexName(value?.value.toString())}
          />
          <Button
            startIcon={Cog}
            variant="neutral"
            size="large"
            title="get index settings"
            disabled={!indexName || !apiKeyInfo || !apiKeyInfo.acl.includes('settings')}
            onClick={(): Promise<void> => getIndexSettings(indexName!)}
          >
            get settings
          </Button>
        </div>
        <Code code={settings} leftPadding={false} />
      </Card>
    </div>
  );
};
