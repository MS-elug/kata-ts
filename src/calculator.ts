/**
 * Do the sum of numbers being contained in a string and separated with ',' or '\n' seperator.
 * A custom seperator can be provided using the following syntax '//[seperator]\n[numbers]'
 * @param input
 * @returns
 */
export function add(rawinput: string): string {
  // Returns '0' for empty string
  if (rawinput.length === 0) {
    return '0';
  }

  // Extract custom separator if any
  const [separators, input] = extractSeparator(rawinput);
  // Initiate processing variables
  const errors: string[] = [];
  let sum = 0;
  const negativeNumbers: string[] = [];
  const invalidNumbers: string[] = [];

  // Keep index of first numeric char in input
  let numberStartIndex = -1;
  // State to memorize the type of char being processed
  let processingType: 'NUMBER' | 'SEPARATOR' | 'UNKOWN' = 'UNKOWN';
  // Loop on each char on input
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const isLastChar = i === input.length - 1;

    // Iterate until non numeric char is found
    const isNumberChar = /[-. 0-9]/.test(char);
    if (isNumberChar) {
      processingType = 'NUMBER';
      // Detect start of a number and store it
      if (numberStartIndex === -1) {
        numberStartIndex = i;
      }
      // Go to next char expect if this is the last char
      if (!isLastChar) {
        continue;
      }
    }

    // Last char was of type number and an non numeric char is detected
    // Extract the number and process it
    if (processingType === 'NUMBER') {
      const numberEndIndex = isNumberChar && isLastChar ? i + 1 : i;
      const numberExtracted = input.substring(numberStartIndex, numberEndIndex);
      const number = Number(numberExtracted);
      // Store invalid numbers
      if (isNaN(number)) {
        invalidNumbers.push(numberExtracted);
      } else if (number < 0) {
        negativeNumbers.push(numberExtracted);
      } else {
        sum += number;
      }
      // Reset detection of number char
      numberStartIndex = -1;

      // If the last char is numeric, exit the loop
      if (isNumberChar && isLastChar) {
        break;
      }
      // Assume that we don't know what is the next char type if previous was a number
      processingType = 'UNKOWN';
    }

    // Test if the start of a separator is detected
    const separatorDetected = separators.find((separator) => {
      return input.length >= i + separator.length && input.substring(i, i + separator.length) === separator;
    });

    if (!separatorDetected) {
      // No Separator is detected, push it to list of errors
      errors.push(`'${separators.join(',')}' expected but '${char}' found at position ${i}.`);
    } else {
      // Detect if the previous word was a separator, it's an error
      if (processingType === 'SEPARATOR') {
        errors.push(`Number expected but '${char}' found at position ${i}.`);
      }
      processingType = 'SEPARATOR';

      // Jump to the end of the separator
      i = i + separatorDetected.length - 1;
    }
  }

  // Detect non expected EOF
  if (processingType !== 'NUMBER') {
    errors.push(`Number expected but EOF found`);
  }
  // Logs Negative numbers as error
  if (negativeNumbers.length > 0) {
    errors.push(`Negative not allowed : ${negativeNumbers.join(', ')}`);
  }
  // Logs invalid numbers as error
  if (invalidNumbers.length > 0) {
    errors.push(`Invalid number : ${invalidNumbers.join(', ')}`);
  }
  return errors.length > 0 ? errors.join('\n') : String(parseFloat(sum.toFixed(2)));
}

/**
 * Detect and extract the custom seperator in a string
 * @param input
 * @returns
 */
function extractSeparator(input: string): [string[], string] {
  const customSeparatorMarker = '//';

  if (!input.startsWith(customSeparatorMarker)) {
    return [[',', '\n'], input];
  }
  const endOfSeparatorIndex = input.indexOf('\n');
  const customSeperator = input.substring(customSeparatorMarker.length, endOfSeparatorIndex);
  return [[customSeperator], input.substring(endOfSeparatorIndex + 1)];
}
