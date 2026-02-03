import { normalize } from "viem/ens";
import type { Address } from "viem";
import { useEnsAddress, useEnsText } from "wagmi";

export type EnsTextRecord = {
  key: string;
  label: string;
  value: string;
};

const TEXT_RECORDS: Array<{ key: string; label: string }> = [
  { key: "description", label: "Description" },
  { key: "url", label: "Website" },
  { key: "com.twitter", label: "Twitter" },
  { key: "com.github", label: "GitHub" },
  { key: "com.panic.safe", label: "Panic Safe Contact" },
  { key: "com.panic.guardian", label: "Panic Guardian" },
];

export const isEnsName = (value?: string) =>
  !!value?.trim() && value.trim().toLowerCase().endsWith(".eth");

export const useEnsProfile = (value?: string, chainId = 1) => {
  const trimmed = value?.trim() ?? "";
  const isName = isEnsName(trimmed);
  const normalized = isName ? normalize(trimmed) : undefined;

  const { data: resolvedAddress, isLoading: isResolving } = useEnsAddress({
    name: normalized,
    chainId,
    query: { enabled: isName },
  });

  const recordResults = TEXT_RECORDS.map((record) =>
    useEnsText({
      name: normalized,
      key: record.key,
      chainId,
      query: { enabled: isName },
    })
  );

  const records: EnsTextRecord[] = TEXT_RECORDS.map((record, index) => {
    const value = recordResults[index]?.data ?? "";
    return value
      ? {
          key: record.key,
          label: record.label,
          value,
        }
      : null;
  }).filter((item): item is EnsTextRecord => item !== null);

  return {
    isEnsName: isName,
    normalizedName: normalized,
    resolvedAddress: resolvedAddress as Address | undefined,
    records,
    isResolving,
  };
};
