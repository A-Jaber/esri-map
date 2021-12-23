import { Injectable, Inject, OnInit } from '@angular/core';
import { CountryModule } from '../modules/country.module';

@Injectable()
export class Helper {

    /**
     * remove the duplicated country name from the countries array
     */
    removeDuplicatesCountryName(array: CountryModule[]): any {
        return Array.from(new Set(array.map((a: CountryModule) => a.name)))
            .map(name => {
                return array.find((a: CountryModule) => a.name === name)
            });
    }
}