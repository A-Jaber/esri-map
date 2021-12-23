/**
 * Home Component
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, FormGroup } from '@angular/forms';
import WebMap from "@arcgis/core/WebMap";
import * as projection from "@arcgis/core/geometry/projection";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { CountryModule } from '../../modules/country.module';

import { Constants } from '../../common/constants';
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import { Helper } from 'src/app/common/helper.common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  map!: Map;
  view!: MapView;
  countryFilterText: any = "";
  countryFilteredResult: CountryModule[] = [];
  loadingData: boolean = false;

  constructor(private helper: Helper) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  /**
   * load map
   */
  initMap() {
    this.map = new Map({
      basemap: "topo-vector"
    });

    this.view = new MapView({
      map: this.map,
      container: "viewDiv",
      center: [36.1, 33.8],
      zoom: 10
    });
  }

  /**
   * search for counties
   */
  filterByCountry() {
    this.loadingData = true;
    this.countryFilteredResult.length = 0;//reset the filtered countries result 
    let queryUrl = Constants.COUNTRIES_API;

    // query 
    let queryObject = new Query();
    queryObject.where = "COUNTRY LIKE '%" + this.countryFilterText + "%'";//condition
    queryObject.outFields = ["FID", "COUNTRY", "ISO_CC"];//to be selected; ["*"] in case of all fields to be selected
    queryObject.returnGeometry = true; //get the coordinates to be used in goTo
    queryObject.returnDistinctValues = true;
    queryObject.orderByFields = ["COUNTRY ASC"];

    let response;

    query.executeQueryJSON(queryUrl, queryObject).then((results: FeatureSet) => {
      response = results.features;
      for (let i = 0; i < response.length; i++) {
        this.countryFilteredResult.push(new CountryModule(
          response[i].attributes.FID,
          response[i].attributes.COUNTRY,
          response[i].attributes.ISO_CC,
          response[i].geometry,
        ));
      }

      this.loadingData = false;

      //remove duplicates results
      this.countryFilteredResult = this.helper.removeDuplicatesCountryName(this.countryFilteredResult);
    });
  }

  /**
  * redirect to a country
  */
  navigateToCountry(index: number) {
    // const result = inventory.find( ({ name }) => name === 'cherries' );
    this.view.goTo(this.countryFilteredResult[index].geometry
      , {
        duration: 3000 // Duration of animation will be 5 seconds
      }
    );
  }
}
