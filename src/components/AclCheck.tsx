import type { ApiKeyACLType } from '@algolia/client-search';
import { Badge, Card, IconButton, Input } from '@algolia/satellite';
import algoliasearch from 'algoliasearch';
import { type FC, useCallback, useEffect, useState, useTransition } from 'react';
import { Slash } from 'react-feather';

export const AclCheck: FC = () => {
  const [pending, startTransition] = useTransition();
  const [appId, setAppId] = useState<string>();
  const [apiKey, setApiKey] = useState<string>();
  const [acl, setAcl] = useState<ApiKeyACLType[]>([]);

  const resetInput = useCallback(() => {
    setAppId('');
    setApiKey('');
  }, []);

  useEffect(() => {
    if (!appId || !apiKey) {
      startTransition(() => {
        setAcl([]);
      });
    } else {
      const client = algoliasearch(appId, apiKey);
      client
        .getApiKey(apiKey)
        .then((value) => {
          startTransition(() => {
            setAcl(value.acl);
          });
        })
        .catch(() => {
          startTransition(() => {
            setAcl([]);
          });
        });
    }
  }, [appId, apiKey]);

  return (
    <Card className="m-2 space-y-2">
      <div className="flex items-center space-x-2">
        <div>Check ACL: </div>
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
      <div className="space-x-1 space-y-1">
        {!pending && acl.length > 0 ? (
          <>
            ACL ({acl.length}):{' '}
            {acl.map((value) => (
              <Badge value={value} key={value} />
            ))}
          </>
        ) : (
          'no ACL 🙅'
        )}
      </div>
    </Card>
  );
};
