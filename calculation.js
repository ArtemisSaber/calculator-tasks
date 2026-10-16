const decimalStringTrim = (str) => {
    if (str.endsWith("0") || str.endsWith(" ")) {
        const newStr = str.slice(0, -1); // remove last character
        return decimalStringTrim(newStr);
    }
    else {
        return str;
    }
};
const isValidNumber = (str) => {
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
export const toFixed = (inputs) => {
    if (!inputs?.length) {
        return {
            scaleFactor: 0n,
            parsed: [0n],
            err: "INV",
        };
    }
    else {
        const parsedInputs = [];
        let scaleFactor = 1n;
        let err = "";
        for (const parsee of inputs) {
            if (!isValidNumber(parsee)) {
                scaleFactor = 0n;
                err = "NAN";
                break;
            }
            const isDecimal = parsee.includes(".");
            if (!isDecimal) {
                continue;
            }
            else {
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
                }
                else {
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
export const multiply = (a, b, scaleFactor) => {
    const result = {
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
const gcd = (a, b) => {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
};
export const division = (dividend, divisor) => {
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
    const result = {
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
export const plus = (a, b, scaleFactor) => {
    const result = {
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
