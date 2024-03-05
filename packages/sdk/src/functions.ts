import { err, ok, Result } from "neverthrow";
import { ZodSchema } from "zod";

export const safeTry = <TResult>(fn: () => TResult): Result<TResult, string> => {
  let result;

  try {
    result = ok(fn());
  } catch (ex) {
    result = err(String(err));
  }

  return result;
};

export const getOrThrow = <TResult>(fn: () => TResult, fnEx: (err: string) => Error): TResult => {
  let result;

  try {
    result = fn();
  } catch (ex) {
    throw fnEx(String(err));
  }

  return result;
};

export const unwrapOrThrow = <TResult, TErr>(toUnwrap: Result<TResult, TErr>, fnEx: (err: TErr) => Error): TResult => {
  let result: TResult;

  if (toUnwrap.isOk()) {
    result = toUnwrap.value;
  } else {
    throw fnEx(toUnwrap.error);
  }

  return result;
};

export const parseOrThrow = <TResult>(
  schema: ZodSchema<TResult>,
  val: unknown,
  fnEx: (err: string) => Error,
): TResult => {
  let result: TResult;
  const parseResult = schema.safeParse(val);

  if (parseResult.success) {
    result = parseResult.data;
  } else {
    throw fnEx(parseResult.error.toString());
  }

  return result;
};
