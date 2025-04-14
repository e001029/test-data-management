import { modules, moduleFields } from '../config/moduleFields';

export function buildInitialFormInputs() {
  const inputs = {};
  modules.forEach((mod) => {
    const empty = {};
    moduleFields[mod].forEach((f) => (empty[f] = ''));
    inputs[mod] = empty;
  });
  return inputs;
}

export function buildInitialModuleData() {
  const data = {};
  modules.forEach((mod) => {
    data[mod] = [];
  });
  return data;
}
