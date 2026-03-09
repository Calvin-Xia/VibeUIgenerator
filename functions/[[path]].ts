export interface PagesFunctionContext {
  next: () => Response | Promise<Response>;
}

export const onRequest = (context: PagesFunctionContext) => {
  return context.next();
};
