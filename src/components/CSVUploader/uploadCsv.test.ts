import { validData } from './uploadCsv';

describe('CSVUploader', () => {
    it('can verify data', () => {
        expect(validData(undefined)).toBe(false);
    });
});
