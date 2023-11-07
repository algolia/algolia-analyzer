import cx from 'classnames';
import { type FC, type MouseEventHandler } from 'react';

import { type CustomTagProps, MethodTag, StatusCodeTag } from 'components/Tags';

import { type GeneralOption } from './FilteringOption';

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
  const onRemove = deleteOption ? (): void => deleteOption(option as GeneralOption) : undefined;
  const onClick: MouseEventHandler<HTMLSpanElement> | undefined = reverseOption
    ? (event): void => {
        event.stopPropagation();
        reverseOption(option as GeneralOption);
      }
    : undefined;

  const props: CustomTagProps = {
    className: cx('mr-1', onClick && 'cursor-pointer'),
    reversed: onClick !== undefined && option.reversed,
    onRemove,
    onClick,
  };

  switch (option.type) {
    case 'method':
      return <MethodTag {...props} method={option.value as string} />;
    case 'statusCode':
      return <StatusCodeTag {...props} statusCode={option.value as number} />;
    default:
      return null;
  }
};
