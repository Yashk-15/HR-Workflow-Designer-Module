export const getAutomations = () =>
  fetch('/api/automations').then((r) => r.json());
