let lastComparisonResult: any = null;

export const setComparisonResult = (result: any) => {
  lastComparisonResult = result;
};

export const getComparisonResult = () => {
  return lastComparisonResult;
};
