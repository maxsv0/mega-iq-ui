import {InjectionToken} from '@angular/core';
import {ApiResponseTests, ApiResponseUsersList, ApiResponseUsersTop} from '../_models';
import {ApiResponsePublicTestResultList} from '@/_models/api-response-public-test-result-list';
import {makeStateKey} from '@angular/platform-browser';

export const DATA_TESTS = new InjectionToken<ApiResponseTests>('ApiResponseTestsToken');
export const DATA_USERS_TOP = new InjectionToken<ApiResponseUsersTop>('ApiResponseUsersTopToken');
export const DATA_TEST_RESULT = new InjectionToken<ApiResponsePublicTestResultList>('ApiResponsePublicTestResultListToken');
export const DATA_USERS_LIST = new InjectionToken<ApiResponseUsersList>('ApiResponseUsersListToken');

export const STATE_KEY_TESTS = makeStateKey('tests');
export const STATE_KEY_USERS_TOP = makeStateKey('usersTop');
export const STATE_KEY_TEST_RESULT = makeStateKey('listLatest');
export const STATE_KEY_USERS_LIST = makeStateKey('usersList');
export const STATE_KEY_USER_PUBLIC = makeStateKey('userPublic');
export const STATE_KEY_TEST_PUBLIC = makeStateKey('testPublic');



