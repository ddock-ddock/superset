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
import AdhocFilter from 'src/explore/components/controls/FilterControl/AdhocFilter';
import { Operators } from 'src/explore/constants';
import { ExpressionTypes, Clauses } from '../types';

describe('AdhocFilter', () => {
  it('sets filterOptionName in constructor', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: Clauses.Where,
    });
    expect(adhocFilter.filterOptionName.length).toBeGreaterThan(10);
    expect(adhocFilter).toEqual({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      datasourceWarning: false,
      comparator: '10',
      clause: Clauses.Where,
      filterOptionName: adhocFilter.filterOptionName,
      sqlExpression: null,
      isExtra: false,
      isNew: false,
    });
  });

  it('can create altered duplicates', () => {
    const adhocFilter1 = new AdhocFilter({
      isNew: true,
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: Clauses.Where,
    });
    const adhocFilter2 = adhocFilter1.duplicateWith({ operator: '<' });

    expect(adhocFilter1.subject).toBe(adhocFilter2.subject);
    expect(adhocFilter1.comparator).toBe(adhocFilter2.comparator);
    expect(adhocFilter1.clause).toBe(adhocFilter2.clause);
    expect(adhocFilter1.expressionType).toBe(adhocFilter2.expressionType);

    expect(adhocFilter1.operator).toBe('>');
    expect(adhocFilter2.operator).toBe('<');

    // duplicated clone should not be new
    expect(adhocFilter1.isNew).toBe(true);
    expect(adhocFilter2.isNew).toStrictEqual(false);
  });

  it('can verify equality', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: Clauses.Where,
    });
    const adhocFilter2 = adhocFilter1.duplicateWith({});

    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1.equals(adhocFilter2)).toBe(true);
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1 === adhocFilter2).toBe(false);
  });

  it('can verify inequality', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: Clauses.Where,
    });
    const adhocFilter2 = adhocFilter1.duplicateWith({ operator: '<' });

    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1.equals(adhocFilter2)).toBe(false);

    const adhocFilter3 = new AdhocFilter({
      expressionType: ExpressionTypes.Sql,
      sqlExpression: 'value > 10',
      clause: Clauses.Where,
    });
    const adhocFilter4 = adhocFilter3.duplicateWith({
      sqlExpression: 'value = 5',
    });

    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter3.equals(adhocFilter4)).toBe(false);
  });

  it('can determine if it is valid', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      comparator: '10',
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter1.isValid()).toBe(true);

    const adhocFilter2 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '>',
      comparator: null,
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter2.isValid()).toBe(false);

    const adhocFilter3 = new AdhocFilter({
      expressionType: ExpressionTypes.Sql,
      sqlExpression: 'some expression',
      clause: null,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter3.isValid()).toBe(false);

    const adhocFilter4 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: 'IN',
      comparator: [],
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter4.isValid()).toBe(false);

    const adhocFilter5 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: 'IN',
      comparator: ['val1'],
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter5.isValid()).toBe(true);

    const adhocFilter6 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '==',
      comparator: 1,
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter6.isValid()).toBe(true);

    const adhocFilter7 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '==',
      comparator: 0,
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter7.isValid()).toBe(true);

    const adhocFilter8 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '==',
      comparator: null,
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter8.isValid()).toBe(false);

    const adhocFilter9 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: 'IS NULL',
      clause: Clauses.Where,
    });
    expect(adhocFilter9.isValid()).toBe(true);
    const adhocFilter10 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: 'IS NOT NULL',
      clause: Clauses.Where,
    });
    // eslint-disable-next-line no-unused-expressions
    expect(adhocFilter10.isValid()).toBe(true);
  });

  it('can translate from simple expressions to sql expressions', () => {
    const adhocFilter1 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'value',
      operator: '==',
      comparator: '10',
      clause: Clauses.Where,
    });
    expect(adhocFilter1.translateToSql()).toBe('value = 10');

    const adhocFilter2 = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'SUM(value)',
      operator: '!=',
      comparator: '5',
      clause: Clauses.Having,
    });
    expect(adhocFilter2.translateToSql()).toBe('SUM(value) <> 5');
  });
  it('sets comparator to undefined when operator is IS_NULL', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'SUM(value)',
      operator: 'IS NULL',
      operatorId: Operators.IsNull,
      comparator: '5',
      clause: Clauses.Having,
    });
    expect(adhocFilter.comparator).toBe(undefined);
  });
  it('sets comparator to undefined when operator is IS_NOT_NULL', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'SUM(value)',
      operator: 'IS NOT NULL',
      operatorId: Operators.IsNotNull,
      comparator: '5',
      clause: Clauses.Having,
    });
    expect(adhocFilter.comparator).toBe(undefined);
  });
  it('sets comparator to undefined when operator is IS_TRUE', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'col',
      operator: 'IS TRUE',
      operatorId: Operators.IsTrue,
      comparator: '5',
      clause: Clauses.Having,
    });
    expect(adhocFilter.comparator).toBe(undefined);
  });
  it('sets comparator to undefined when operator is IS_FALSE', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'col',
      operator: 'IS FALSE',
      operatorId: Operators.IsFalse,
      comparator: '5',
      clause: Clauses.Having,
    });
    expect(adhocFilter.comparator).toBe(undefined);
  });
  it('sets the label properly if subject is a string', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: 'order_date',
    });
    expect(adhocFilter.getDefaultLabel()).toBe('order_date');
  });
  it('sets the label properly if subject is an object with the column_date property', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: {
        column_name: 'year',
      },
    });
    expect(adhocFilter.getDefaultLabel()).toBe('year');
  });
  it('sets the label to empty is there is no column_name in the object', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: {
        unknown: 'year',
      },
    });
    expect(adhocFilter.getDefaultLabel()).toBe('');
  });
  it('sets the label to empty is there is no subject', () => {
    const adhocFilter = new AdhocFilter({
      expressionType: ExpressionTypes.Simple,
      subject: undefined,
    });
    expect(adhocFilter.getDefaultLabel()).toBe('');
  });
});
