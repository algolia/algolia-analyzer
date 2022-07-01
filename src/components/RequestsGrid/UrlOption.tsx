import type { Option } from '@algolia/satellite';
import cx from 'classnames';
import type { FC, MouseEventHandler } from 'react';

import { ApiSubPathTag, ClusterTag, type CustomTagProps, IndexTag } from 'components/Tags';

export interface UrlOption extends Option {
  type: 'apiSubPath' | 'cluster' | 'index';
  reversed: boolean;
}

interface UrlOptionItemComponentProps {
  option: UrlOption;
  deleteOption?: (option: UrlOption) => void;
  reverseOption?: (option: UrlOption) => void;
}

export const UrlOptionItemComponent: FC<UrlOptionItemComponentProps> = ({
  option,
  deleteOption,
  reverseOption,
}) => {
  const onDelete = deleteOption ? (): void => deleteOption(option as UrlOption) : undefined;
  const onClick: MouseEventHandler<HTMLSpanElement> | undefined = reverseOption
    ? (event): void => {
        event.stopPropagation();
        reverseOption(option as UrlOption);
      }
    : undefined;

  const props: CustomTagProps = {
    className: cx('mr-1', onClick && 'cursor-pointer'),
    reversed: onClick !== undefined && option.reversed,
    onDelete,
    onClick,
  };

  switch ((option as UrlOption).type) {
    case 'cluster':
      return <ClusterTag {...props} cluster={option.value as string} />;
    case 'index':
      return <IndexTag {...props} index={option.value as string | null} />;
    case 'apiSubPath':
      return <ApiSubPathTag {...props} apiSubPath={option.value as string | null} />;
    default:
      return null;
  }
};
