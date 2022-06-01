import { GaxiosError, GaxiosResponse } from 'gaxios';
import { danger, warning } from '../../components/Notification/Notification';

function isAxiosError(error: GaxiosError | unknown): error is GaxiosError {
    const gerror = error as GaxiosError;
    return gerror.response !== undefined && gerror.code !== undefined;
}

const handleError = <T>(error: GaxiosError<T> | unknown) => {
    if (isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response) {
            console.error('axiosError', axiosError.response);
            if (axiosError.response.data?.errorKey) {
                warning({ title: axiosError.response.data.errorKey, message: axiosError.response.data.errorMessage });
            } else if (axiosError.response.data?.errorMessage) {
                danger({ title: axiosError.response.statusText, message: axiosError.response.data.errorMessage });
            } else {
                danger({ message: axiosError.response.statusText });
            }
        }
    } else {
        danger({ message: error as string });
        console.error(error);
    }
};
export const errorHandlingWrapper = async <A = never, B = GaxiosResponse<A>>(
    workhorse: () => Promise<B>
): Promise<B | undefined> => {
    return workhorse().catch((e) => {
        handleError(e);
        return Promise.resolve(undefined);
    });
};
export const useErrorHandlingWrapper = <T>(workhorse: () => { data: T | undefined; loading: boolean }) => {
    try {
        return workhorse();
    } catch (error) {
        handleError(error);
        return { data: undefined, loading: false };
    }
};
