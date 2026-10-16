type ParserErrors = "NAN" | "INF" | "" | "INV";
type CalculationErrors = "DI0" | "OOR" | "";

interface ParseResult {
  scaleFactor: bigint;
  parsed: bigint[];
  err: ParserErrors;
}

interface CalculationResult {
  res: {
    integer: bigint;
    divisor: bigint;
    dividend: bigint;
  };
  scaleFactor: bigint;
  err: CalculationErrors;
}

const decimalStringTrim = (str: string) => {
  let trimmed = str.trim()
  while (trimmed.endsWith("0")) {
    trimmed = trimmed.slice(0,-1)
  }
  return trimmed;
};

const isValidNumber = (str: string) => {
  let trimmed = str.trim();
  let hasDot = false;
  let isValid = true;
  const hasSign = trimmed.startsWith("+") || trimmed.startsWith("-");
  if (hasSign) {
    trimmed = trimmed.slice(1);
  }
  if (!trimmed?.length) {
    return false;
  }
  if (trimmed.startsWith(".") || trimmed.endsWith(".")) {
    return false;
  }
  for (const char of trimmed) {
    if (char >= "0" && char <= "9") {
      continue;
    }
    if (char === ".") {
      if (hasDot) {
        isValid = false;
        break;
      }
      hasDot = true;
      continue;
    }
    isValid = false;
    break;
  }
  return isValid;
};

export const toFixed = (inputs: string[]): ParseResult => {
  if (!inputs?.length) {
    return {
      scaleFactor: 0n,
      parsed: [0n],
      err: "INV",
    };
  } else {
    const parsedInputs: bigint[] = [];
    let scaleFactor = 1n;
    let err: ParserErrors = "";
    for (const parsee of inputs) {
      if (!isValidNumber(parsee)) {
        scaleFactor = 0n;
        err = "NAN";
        break;
      }
      const isDecimal = parsee.includes(".");
      if (!isDecimal) {
        continue;
      } else {
        const trimmedParsee = decimalStringTrim(parsee.trim());
        const decimalLength = trimmedParsee.split(".")[1]?.length;
        const newScaleFactor = 10n ** BigInt(decimalLength);
        if (newScaleFactor > scaleFactor) {
          scaleFactor = newScaleFactor;
        }
      }
    }
    if (!err) {
      for (const parsee of inputs) {
        const isDecimal = parsee.includes(".");
        if (!isDecimal) {
          parsedInputs.push(BigInt(parsee) * scaleFactor);
        } else {
          const trimmedParsee = decimalStringTrim(parsee.trim());
          const splitNumbers = trimmedParsee.split(".");
          const integers = splitNumbers[0];
          const decimals = splitNumbers[1];
          const normalizedParsee = integers + decimals;
          const decimalLength = decimals.length;
          const normalizeScaleFactor = 10n ** BigInt(decimalLength);
          const remainingScaleFactor = scaleFactor / normalizeScaleFactor;
          const parsedParsee = BigInt(normalizedParsee) * remainingScaleFactor;
          parsedInputs.push(parsedParsee);
        }
      }
    }
    return {
      scaleFactor,
      parsed: parsedInputs,
      err,
    };
  }
};

export const multiply = (a: bigint, b: bigint, scaleFactor: bigint) => {
  const result: CalculationResult = {
    res: {
      integer: a * b,
      divisor: 1n,
      dividend: 0n,
    },
    scaleFactor: scaleFactor * scaleFactor,
    err: "",
  };
  return result;
};

const gcd = (a: bigint, b: bigint): bigint => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;

  while (b !== 0n) {
    [a, b] = [b, a % b];
  }

  return a;
};

export const division = (
  dividend: bigint,
  divisor: bigint,
): CalculationResult => {
  if (divisor == 0n) {
    return {
      res: {
        integer: 0n,
        divisor: 1n,
        dividend: 0n,
      },
      scaleFactor: 1n,
      err: "DI0",
    };
  }
  const remainder = dividend % divisor;
  const gcdRemainder = gcd(divisor, remainder);
  const remainderDivisor = divisor / gcdRemainder;
  const remainderDividend = remainder / gcdRemainder;
  const integer = dividend / divisor;
  const result: CalculationResult = {
    res: {
      integer,
      divisor: remainderDivisor,
      dividend: remainderDividend,
    },
    scaleFactor: 1n,
    err: "",
  };
  return result;
};

export const plus = (a: bigint, b: bigint, scaleFactor: bigint) => {
  const result: CalculationResult = {
    res: {
      integer: a + b,
      divisor: 1n,
      dividend: 0n,
    },
    err: "",
    scaleFactor,
  };
  return result;
};
