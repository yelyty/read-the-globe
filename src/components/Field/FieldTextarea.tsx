import type { ComponentProps } from 'react';

import { joinClass, useFieldControl } from './fieldControl';

// a textarea for Field's control: it takes the field's id, class and aria props
const FieldTextarea = ({ className, ...props }: ComponentProps<'textarea'>) => {
  const field = useFieldControl();

  return (
    <textarea
      {...field}
      {...props}
      className={joinClass(field?.className, className)}
    />
  );
};

export default FieldTextarea;
