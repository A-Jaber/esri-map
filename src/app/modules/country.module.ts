/**
 * Country Module
 */
export class CountryModule {
    constructor(
        public fid: number,
        public name: string,
        public isoCC: string,
        public geometry: any
    ) { }
}