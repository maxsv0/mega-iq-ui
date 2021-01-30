import {InjectionToken} from '@angular/core';
import {ApiResponseTests, ApiResponseUsersList, ApiResponseUsersTop} from '../_models';
import {ApiResponsePublicTestResultList} from '../_models/api-response-public-test-result-list';

export const DATA_TEST_TYPE = new InjectionToken<ApiResponseTests>('ApiResponseTestsToken');
export const DATA_USERS_TOP = new InjectionToken<ApiResponseUsersTop>('ApiResponseUsersTopToken');
export const DATA_TEST_RESULT = new InjectionToken<ApiResponsePublicTestResultList>('ApiResponsePublicTestResultListToken');
export const DATA_USERS_LIST = new InjectionToken<ApiResponseUsersList>('ApiResponseUsersListToken');



