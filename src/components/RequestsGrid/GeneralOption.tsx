import type { Option } from '@algolia/satellite';
import cx from 'classnames';
import { type FC, type MouseEventHandler } from 'react';

import { type CustomTagProps, MethodTag, StatusCodeTag } from 'components/Tags';

export interface GeneralOption extends Option {
  type: 'method' | 'statusCode';
  reversed: boolean;
}

interface GeneralOptionItemComponentProps {
  option: GeneralOption;
  deleteOption?: (option: GeneralOption) => void;
  reverseOption?: (option: GeneralOption) => void;
}

export const GeneralOptionItemComponent: FC<GeneralOptionItemComponentProps> = ({
  option,
  deleteOption,
  reverseOption,
}) => {
  const onDelete = deleteOption ? (): void => deleteOption(option as GeneralOption) : undefined;
  const onClick: MouseEventHandler<HTMLSpanElement> | undefined = reverseOption
    ? (event): void => {
        event.stopPropagation();
        reverseOption(option as GeneralOption);
      }
    : undefined;

  const props: CustomTagProps = {
    className: cx('mr-1', onClick && 'cursor-pointer'),
    reversed: onClick !== undefined && option.reversed,
    onDelete,
    onClick,
  };

  switch ((option as GeneralOption).type) {
    case 'method':
      return <MethodTag {...props} method={option.value as string} />;
    case 'statusCode':
      return <StatusCodeTag {...props} statusCode={option.value as number} />;
    default:
      return null;
  }
};
