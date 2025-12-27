export const ragContextMiddleware = async (state, next) => {
  const docs = state.toolResults?.retrive_docs;
  if (!docs || docs.length === 0) return next(state);

  const contextText = docs
    .map((d, i) => `Document ${i + 1}:\n${d.pageContent}`)
    .join("\n\n");

  // REPLACE existing system message (not stack)
  state.messages = state.messages.filter(m => m.role !== "system");
  state.messages.unshift(buildRagSystemMessage(contextText));

  return next(state);
};
