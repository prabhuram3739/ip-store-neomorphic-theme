import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

import { HighchartsService } from '../highcharts.service';

import * as Highcharts from 'highcharts';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('charts') public chartEl: ElementRef;
  filterText;
  filteredData = [];
  loader = true;
  platformDrp;
  releaseDrp;
  initialData = [];
  releasesDetails = [];
  releaseNames = [];
  ipReleaseNames = [];
  releaseDetail = [];
  releaseNamesUnfiltered = [];
  allReleases = [];
  platformName;
  ipName;
  countOfReleses;
  latestRelease;
  latestBuildTime;
  navbarOpen = false;
  isChecked;
  isCheckedName;
  showDetails = false;
  selectedCount = 0;
  chartData = [];
  chartDataContents = [];
  platformCount = 0;
  platformArray = [];
  ipCount = 0;
  ipArray = [];
  type;
  isDisabled: boolean;
  selectedIndex;
  selectedVersionIndex;
  workweek;
  modelDescShort;

modelTypes: any[] = [
  {name: 'platform', title: 'Platforms', total: 0, selected: false, isDisabled: false},
  {name: 'ip', title: 'IP Blocks', total: 0, selected: false, isDisabled: false},
  {name: 'Extension', title: 'Extension', total: 0, selected: false, isDisabled: false},
  {name: 'DetailedModels', title: 'Detailed Models', total: 0, selected: false, isDisabled: false},
  {name: 'Interface', title: 'Interface', total: 0, selected: false, isDisabled: false}
];
simicsVersions: any[] = [
  { name: 'simics-5', value: 'simics-5', selected: false },
  { name: 'simics-6', value: 'simics-6', selected: false }
];
selectedModel: string[] = [];
selectedVersion: string[] = [];

  constructor(private api: ApiService, private router: Router, private hcs: HighchartsService) { }

  ngOnInit(): void {
    this.platformDrp = 'All';
    this.releaseDrp = 'All';
    this.platformName = '';
    this.countOfReleses = '';
    this.latestRelease = '';
    this.latestBuildTime = '';
    this.selectedIndex = '';
    this.selectedVersionIndex = '';
    this.workweek = '';
    this.modelDescShort = '';
    this.api.getAllData()
      .subscribe(data => {
        this.filteredData = [...data.body].sort();
        this.initialData = [...data.body].sort();
        this.platformArray = this.initialData.filter((a) => {
          return a.type === 'platform';
        });
        this.ipArray = this.initialData.filter((a) => {
          this.ipCount++;
          return a.type === 'ip';
        });
        this.modelTypes[0].total = this.platformArray.length;
        this.modelTypes[1].total = this.ipArray.length;
        this.modelTypes.map((a) => {
          if (a.total === 0) {
            a.isDisabled = true;
            this.isDisabled = true;
          } else {
            a.isDisabled = false;
            this.isDisabled = false;
          }
        });
        const platform = 'platform';
        const ip = 'ip';
        /*  Platform Array Manipulation */
        for (let i = 0; i < this.platformArray.length; i++) {
          for (let j = 0; j < this.platformArray[i].releases.length; j++) {
            this.platformArray[i].releases[j][platform] = this.platformArray[i].platform.toLowerCase();
            this.releaseNames.push(this.platformArray[i].releases[j]);
          }
        }
        this.releasesDetails = this.releaseNames.sort((a, b) => {
          const dateA = new Date(this.api.formatDate(a.workweek.split('.').reverse().join('-'), 'yyyy/mm/dd'));
          const dateB = new Date(this.api.formatDate(b.workweek.split('.').reverse().join('-'), 'yyyy/mm/dd'));
          return (dateB.getTime() - dateA.getTime());
        }).reverse();
        /*  Platform Array Manipulation End */

        /* IP Blocks Manipulation */
        for (let i = 0; i < this.ipArray.length; i++) {
          for (let j = 0; j < this.ipArray[i].releases.length; j++) {
            this.ipArray[i].releases[j][ip] = this.ipArray[i].class_name.toLowerCase();
            this.ipReleaseNames.push(this.ipArray[i].releases[j]);
          }
        }
        /*  IP Blocks Manipulation End */
        this.releaseNamesUnfiltered = this.releaseNames;
        this.allReleases.length = 0;
        this.loader = false;
        for (let i = 0; i < this.modelTypes.length; i++) {
          this.chartData[i] = [this.modelTypes[i].title, this.modelTypes[i].total];
        }
        this.createChart(this.chartData);
      }, (error) => (this.loader === true)); // hide the spinner in case of error);
        /* if (this.api.subsVar === undefined) {
          this.api.subsVar = this.api.invokeFirstComponentFunction.subscribe(() => {
            this.firstFunction();
          });
        } */
  }

  public createChart(chartData) {
    this.hcs.createChart(this.chartEl.nativeElement, chartData);
  }

  /* Change the version and the model */
  public onVersionChange(version: string) {
    const index = this.selectedVersion.indexOf(version);
    this.selectedIndex = '';
    this.showDetails = false;
    this.initialData = this.filteredData;

    this.modelTypes = this.modelTypes.filter(g => {
      g.selected = false;
      return true;
    });
    this.selectedModel.length = 0;
    if (index === -1) {
      this.selectedVersion.push(version);
      this.selectedCount = this.selectedVersion.length;
      /* Call appropriate function based on the checkbox value */
      if (this.selectedVersion.includes(version)) {
        if (this.selectedVersion.length !== 0) {
          this.initialData = this.initialData.filter((a) => {
            // return a.sim_version === version;
            return this.selectedVersion.includes(a.sim_version) && a.type === 'platform';
          });
          this.modelTypes[0].total = this.initialData.length;
        } else {
          this.initialData = this.platformArray;
          this.modelTypes[0].total = this.initialData.length;
        }
        this.loader = false;
        return this.initialData;
      }
     } else {
      this.selectedCount--;
      this.selectedVersion.splice(index, 1);
      if (this.selectedVersion.length !== 0) {
        this.initialData = this.initialData.filter((a) => {
          return this.selectedVersion.includes(a.sim_version) && a.type === 'platform';
        });
      } else {
        this.initialData = this.initialData.filter((a) => {
          return a.type === 'platform';
        });
      }

      this.modelTypes[0].total = this.initialData.length;
      if (this.selectedVersion.length === 0) {
        this.initialData = this.filteredData;
      }
      return this.initialData;
    }
  }

  public onChange(model: string) {
    const index = this.selectedModel.indexOf(model);
    this.selectedIndex = '';
    this.showDetails = false;
    this.initialData = this.filteredData;
    this.simicsVersions = this.simicsVersions.filter(h => {
      h.selected = false;
      return true;
    });
    this.selectedVersion.length = 0;
    if (index === -1) {
      this.selectedModel.push(model);
      this.selectedCount = this.selectedModel.length;
      /* Call appropriate function based on the checkbox value */
      if (this.selectedModel.includes('platform')) {
        this.modelTypes[0].total = this.platformArray.length;
        if (this.selectedModel.length !== 1) {
          this.initialData.push(this.initialData.filter((a) => {
            return a.type === 'platform';
          }));
        } else {
          this.initialData = this.platformArray;
        }
        this.loader = false;
        return this.initialData;
      } else if (this.selectedModel.includes('ip')) {
        if (this.selectedModel.length !== 1) {
        this.initialData.push(this.initialData.filter((a) => {
          return a.type === 'ip';
        }));
      } else {
        this.initialData = this.ipArray;
      }
        this.loader = false;
        return this.initialData;
      }
     } else {
        this.selectedCount--;
        this.selectedModel.splice(index, 1);
        this.initialData = this.initialData.filter((a) => {
          return a.type !== model;
        });
        if (!this.selectedModel.includes('platform')) {
          this.simicsVersions = this.simicsVersions.filter(h => {
            h.selected = false;
            return true;
          });
        }
        if (this.selectedModel.length === 0) {
          this.initialData = this.filteredData;
        }
        return this.initialData;
      }
  }

  /* Clear all the seclection in the Model Types */
  public clearSelection() {
    this.modelTypes = this.modelTypes.filter(g => {
      g.selected = false;
      return true;
    });
    this.simicsVersions = this.simicsVersions.filter(h => {
      h.selected = false;
      return true;
    });
    this.selectedModel.length = 0;
    this.selectedVersion.length = 0;
    this.initialData = this.filteredData;
    this.modelTypes[0].total = this.platformArray.length;
    this.selectedCount = 0;
  }

  public isSelected(model){
    return this.selectedModel.indexOf(model) >= 0;
  }

  public isSelectedVersion(version) {
    return this.selectedVersion.indexOf(version) >= 0;
  }

  // Get all the platform details
  public getAllPlatforms(filterText) {
    if (filterText === '') {
      this.releaseNames = this.releasesDetails;
      this.api.getAllData()
      .subscribe(data => {
        this.initialData = data.body;
        this.releaseNames = this.initialData.filter(o =>
          // tslint:disable-next-line:max-line-length
          Object.keys(o).some(k => typeof o[k] === 'string' ? o[k].toLowerCase().includes(filterText.toLowerCase()) : '')
        );
        this.loader = false;
      });
      return this.releaseNames;
    } else {
      // Call the API to read the data from the JSON and filter the results based on the search text
      this.api.getAllData()
      .subscribe(data => {
        this.releaseNames = this.releasesDetails.filter(
          (platforms) => (platforms.platform.toLowerCase().includes(filterText.toLowerCase()))
        );
        this.initialData = this.initialData.filter(o =>
          // tslint:disable-next-line:max-line-length
          Object.keys(o).some(k => typeof o[k] === 'string' ? o[k].toLowerCase().includes(filterText.toLowerCase()) : '')
        );
        this.releaseNamesUnfiltered = this.releaseNames;
        this.loader = false;
      });
      return this.releaseNames;
    }
  }

  // Dropdown filter with the platforms
  /* public getDrpDownValue() {
    if (this.platformDrp === 'All') {
      this.getAllPlatforms(this.platformDrp);
    } else {
      this.getAllPlatforms(this.platformDrp.platform);
    }
  } */

  // Define recursive function to print nested values inside the JSON
  /* public printValues(obj, arr) {
    for (const k in obj) {
        if (obj[k] instanceof Object) {
          arr.push(k.toUpperCase());
          this.printValues(obj[k], arr);
        } else {
           arr.push(k.toUpperCase() + ':' + obj[k] );
        }
    }
    return arr;
} */

  // Pass the platform name to the overview panel
  public passName($event: any, type: any, i: number, id) {
    this.type = type;
    this.selectedIndex = i;
    const el = document.getElementById(id);
    el.scrollIntoView({behavior: 'smooth'});
    window.scrollTo(0, 0);
    // Call the API to read the data from the JSON and filter the results based on the search text
    this.api.getAllData()
    .subscribe(data => {
      if (type === 'platform') {
        this.allReleases = this.platformArray.filter(
          (releases) => (releases.platform.includes($event.platform))
        );
        this.platformName = this.allReleases[0].platform;
        this.countOfReleses = this.allReleases[0].releases.length;
        this.allReleases[0].releases = this.allReleases[0].releases.sort((a, b) => {
          const dateA = new Date(this.api.formatDate(a.workweek.split('.').reverse().join('-'), 'yyyy/mm/dd'));
          const dateB = new Date(this.api.formatDate(b.workweek.split('.').reverse().join('-'), 'yyyy/mm/dd'));
          return (dateB.getTime() - dateA.getTime());
        }).reverse();
        this.latestRelease = this.allReleases[0].releases[0].releaseName;
        this.workweek = this.api.formatDate(this.allReleases[0].releases[0].workweek, 'dd/mm/yyyy');
      } else if (type === 'ip') {
        this.allReleases = this.ipArray.filter(
          (releases) => (releases.class_name.includes($event.class_name))
        );
        this.ipName = this.allReleases[0].class_name;
        this.countOfReleses = this.allReleases[0].releases.length;
        this.allReleases[0].releases = this.allReleases[0].releases;
        this.latestRelease = this.allReleases[0].releases[0].build_id;
        this.latestBuildTime = this.allReleases[0].releases[0].build_time;
        this.modelDescShort = this.allReleases[0].releases[0].model_desc_short;
      }
      this.showDetails = true;
      this.loader = false;
    });
    return this.allReleases;
  }

// Platform Details on click on each platform
public getDetail($event: any, i: number, id) {
    const platformName = $event;
    const el = document.getElementById(id);
    el.scrollIntoView({behavior: 'smooth'});
    window.scrollTo(0, 0);
    this.selectedIndex = i;
    this.api.getPlatformDetails(platformName)
      .subscribe(data => {
        this.releaseDetail = this.releaseNames.filter(
          (platforms) => (platforms.releaseName.includes(platformName))
        );
        this.loader = false;
        return this.releaseDetail;
      }, (error) => (this.loader === true));
  }

  // Get the Release information based on the Platfrom dropdown value
  /* public getReleaseDrpDownValue($event: any) {
    if ($event === 'All') {
      this.releaseNamesUnfiltered = this.allReleases;
      return this.releaseNamesUnfiltered;
    }
    if (this.releaseDrp === 'All') {
      this.releaseNames = this.releasesDetails.filter(
        (releases) => (releases.platform.toLowerCase().includes($event.platform))
      );
      this.releaseNamesUnfiltered = this.releaseNames;
      return this.releaseNamesUnfiltered;
    } else {
      // Call the API to read the data from the JSON and filter the results based on the search text
      this.api.getAllData()
      .subscribe(data => {
        this.releaseNames = this.releasesDetails.filter(
          (releases) => (releases.platform.toLowerCase().includes($event.platform))
        );
        this.releaseNamesUnfiltered = this.releaseNames;
        this.releaseNames = this.releaseNames.filter(
          (releases) => (releases.releaseName.includes(this.releaseDrp))
        );
        this.loader = false;
      });
      return this.releaseNamesUnfiltered;
    }
  } */

  // Close or show the navbar in the mobile view
  /* public toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  } */

  // Route to the platform
  public onSelect(param1: any, param2: any, param3: any, type: any) {
    if (type === 'platform') {
      this.router.navigate(['/platform', param1, param2]);
    } else if (type === 'ip') {
      this.router.navigate(['/ip', param1, param2, param3]);
    }

  }

  /* public firstFunction() {
    //alert( 'Hello ' + name + '\nWelcome to C# Corner \nFunction in First Component');
  } */
}
