/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  createDurationFormatter,
  getNumberFormatter,
  getNumberFormatterRegistry,
  NumberFormats,
  NumberFormatter,
  getTimeFormatterRegistry,
  SMART_DATE_ID,
  SMART_DATE_DETAILED_ID,
  SMART_DATE_VERBOSE_ID,
  createSmartDateFormatter,
  createSmartDateVerboseFormatter,
  createSmartDateDetailedFormatter,
  createMemoryFormatter,
} from '@superset-ui/core';
import { FormatLocaleDefinition } from 'd3-format';
import { TimeLocaleDefinition } from 'd3-time-format';

export default function setupFormatters(
  d3NumberFormat: Partial<FormatLocaleDefinition>,
  d3TimeFormat: Partial<TimeLocaleDefinition>,
) {
  getNumberFormatterRegistry()
    .setD3Format(d3NumberFormat)
    .registerValue('KR_Adaptive', new NumberFormatter({
      id: 'KR_Adaptive',
      formatFunc: (value) => {
        const units = ['', '만', '억', '조', '경'];
        let unitIndex = 0;
        let scaledValue = value;
        
        while (scaledValue >= 10000 && unitIndex < units.length - 1) {
          scaledValue /= 10000;
          unitIndex++;
        }
        
        return scaledValue.toFixed(scaledValue < 100 ? 1 : 0) + units[unitIndex];
      }
    }))
    .registerValue('KRW_Adaptive', new NumberFormatter({
      id: 'KRW_Adaptive',
      formatFunc: (value) => {
        const units = ['원', '만원', '억원', '조원', '경원'];
        let unitIndex = 0;
        let scaledValue = value;
        
        while (scaledValue >= 10000 && unitIndex < units.length - 1) {
          scaledValue /= 10000;
          unitIndex++;
        }
        
        return scaledValue.toFixed(scaledValue < 100 ? 1 : 0) + units[unitIndex];
      }
    }))
    .registerValue('KR_억.2f', new NumberFormatter({
      id: 'KR_억.2f',
      formatFunc: (value) => {
        const scaledValue = value / 100000000;
        return scaledValue.toFixed(2) + '억';
      }
    }))
    .registerValue('KR_만.2f', new NumberFormatter({
      id: 'KR_만.2f',
      formatFunc: (value) => {
        const scaledValue = value / 10000;
        return scaledValue.toFixed(2) + '만';
      }
    }))
    // Add shims for format strings that are deprecated or common typos.
    // Temporary solution until performing a db migration to fix this.
    .registerValue(',0', getNumberFormatter(',.4~f'))
    .registerValue('null', getNumberFormatter(',.4~f'))
    .registerValue('%', getNumberFormatter('.0%'))
    .registerValue('.', getNumberFormatter('.4~f'))
    .registerValue(',f', getNumberFormatter(',d'))
    .registerValue(',r', getNumberFormatter(',.4f'))
    .registerValue('0f', getNumberFormatter(',d'))
    .registerValue(',#', getNumberFormatter(',.4~f'))
    .registerValue('$,f', getNumberFormatter('$,d'))
    .registerValue('0%', getNumberFormatter('.0%'))
    .registerValue('f', getNumberFormatter(',d'))
    .registerValue(',.', getNumberFormatter(',.4~f'))
    .registerValue('.1%f', getNumberFormatter('.1%'))
    .registerValue('1%', getNumberFormatter('.0%'))
    .registerValue('3%', getNumberFormatter('.0%'))
    .registerValue(',%', getNumberFormatter(',.0%'))
    .registerValue('.r', getNumberFormatter('.4~f'))
    .registerValue('$,.0', getNumberFormatter('$,d'))
    .registerValue('$,.1', getNumberFormatter('$,.1~f'))
    .registerValue(',0s', getNumberFormatter(',.4~f'))
    .registerValue('%%%', getNumberFormatter('.0%'))
    .registerValue(',0f', getNumberFormatter(',d'))
    .registerValue('+,%', getNumberFormatter('+,.0%'))
    .registerValue('$f', getNumberFormatter('$,d'))
    .registerValue('+,', getNumberFormatter(NumberFormats.INTEGER_SIGNED))
    .registerValue(',2f', getNumberFormatter(',.4~f'))
    .registerValue(',g', getNumberFormatter(',.4~f'))
    .registerValue('int', getNumberFormatter(NumberFormats.INTEGER))
    .registerValue('.0%f', getNumberFormatter('.1%'))
    .registerValue('$,0', getNumberFormatter('$,.4f'))
    .registerValue('$,0f', getNumberFormatter('$,.4f'))
    .registerValue('$,.f', getNumberFormatter('$,.4f'))
    .registerValue('DURATION', createDurationFormatter())
    .registerValue(
      'DURATION_SUB',
      createDurationFormatter({ formatSubMilliseconds: true }),
    )
    .registerValue(
      'DURATION_COL',
      createDurationFormatter({ colonNotation: true }),
    )
    .registerValue('MEMORY_DECIMAL', createMemoryFormatter({ binary: false }))
    .registerValue('MEMORY_BINARY', createMemoryFormatter({ binary: true }))
    .registerValue(
      'MEMORY_TRANSFER_RATE_DECIMAL',
      createMemoryFormatter({ binary: false, transfer: true }),
    )
    .registerValue(
      'MEMORY_TRANSFER_RATE_BINARY',
      createMemoryFormatter({ binary: true, transfer: true }),
    );

  const timeFormatterRegistry = getTimeFormatterRegistry();

  timeFormatterRegistry
    .setD3Format(d3TimeFormat)
    .registerValue(
      SMART_DATE_ID,
      createSmartDateFormatter(timeFormatterRegistry.d3Format),
    )
    .registerValue(
      SMART_DATE_VERBOSE_ID,
      createSmartDateVerboseFormatter(timeFormatterRegistry.d3Format),
    )
    .registerValue(
      SMART_DATE_DETAILED_ID,
      createSmartDateDetailedFormatter(timeFormatterRegistry.d3Format),
    )
    .setDefaultKey(SMART_DATE_ID);
}
