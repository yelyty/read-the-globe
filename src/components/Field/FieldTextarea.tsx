import type { ComponentProps } from 'react';

import { joinClass, useFieldControl } from './fieldControl';

/**
 * Shows a textarea in a Field. It takes the id, the class, and the aria props of the field.
 */
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
