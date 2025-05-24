import { ComponentProps, Suspense } from "react";

interface BaseAsyncProps<T> {
  fetch: () => Promise<T>;
  children: (data: T) => React.ReactNode;
}

type AsyncProps<T> = Omit<ComponentProps<typeof Suspense>, "children"> &
  BaseAsyncProps<T>;

const Async = async <T,>({ fetch, children, ...props }: AsyncProps<T>) => {
  return (
    <Suspense {...props}>
      <AsyncContent fetch={fetch}>{children}</AsyncContent>
    </Suspense>
  );
};

const AsyncContent = async <T,>({ fetch, children }: BaseAsyncProps<T>) => {
  const data = await fetch();

  return children(data);
};

export default Async;
