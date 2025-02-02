import { SetMetadata, Type } from '@nestjs/common';

export const SerializeWith = (classToIntercept: Type) =>
  SetMetadata('classToIntercept', classToIntercept);
