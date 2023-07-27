// function that will loop through sickLeaves and check if its ongoing or if its in the past

export function checkSickLeaves(
  sickLeaves: { id: string; start: bigint; end: bigint }[]
): [
  { id: string; start: bigint; end: bigint }[],
  { id: string; start: bigint; end: bigint }?
] {
  const today = new Date().getTime();

  const currentSickLeave = sickLeaves.find((sickLeave) => {
    return sickLeave.start < BigInt(today) && sickLeave.end > BigInt(today);
  });

  const pastSickLeaves = sickLeaves.filter((sickLeave) => {
    return sickLeave.end < BigInt(today);
  });

  return [pastSickLeaves, currentSickLeave];
}
