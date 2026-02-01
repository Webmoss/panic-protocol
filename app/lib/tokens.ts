import type { Address } from "viem";

export type TokenConfig = {
  symbol: string;
  address: Address;
  decimals: number;
  isStable: boolean;
};

type BuildTokenListOptions = {
  isProduction: boolean;
  usdcMainnetAddress?: Address;
  usdcSepoliaAddress?: Address;
  testUsdcAddress?: Address;
  testMossAddress?: Address;
  testGuardAddress?: Address;
};

export const getUsdcAddress = ({
  isProduction,
  usdcMainnetAddress,
  usdcSepoliaAddress,
}: Pick<
  BuildTokenListOptions,
  "isProduction" | "usdcMainnetAddress" | "usdcSepoliaAddress"
>) => {
  return isProduction ? usdcMainnetAddress : usdcSepoliaAddress;
};

export const buildTokenList = ({
  isProduction,
  usdcMainnetAddress,
  usdcSepoliaAddress,
  testUsdcAddress,
  testMossAddress,
  testGuardAddress,
}: BuildTokenListOptions): TokenConfig[] => {
  if (isProduction) {
    return usdcMainnetAddress
      ? [
          {
            symbol: "USDC",
            address: usdcMainnetAddress,
            decimals: 6,
            isStable: true,
          },
        ]
      : [];
  }

  return [
    testUsdcAddress
      ? {
          symbol: "tUSDC",
          address: testUsdcAddress,
          decimals: 6,
          isStable: true,
        }
      : null,
    testMossAddress
      ? {
          symbol: "tMOSS",
          address: testMossAddress,
          decimals: 18,
          isStable: false,
        }
      : null,
    testGuardAddress
      ? {
          symbol: "tGUARD",
          address: testGuardAddress,
          decimals: 18,
          isStable: false,
        }
      : null,
  ].filter((token): token is TokenConfig => token !== null);
};
