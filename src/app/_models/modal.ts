/**
 * @interface Modal
 * @description Basic modal for DialogService.
 */
export interface Modal {
    id: string;
    title: string;
    body: string;
    primary?: string;
    secondary?: string;
    clickFunctionPrimary?: Function;
    clickFunctionSecondary?: Function;
    close: boolean;
}