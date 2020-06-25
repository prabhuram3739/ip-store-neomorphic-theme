import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from '../api.service';
import { ThemeService } from '../theme/theme.service';
import { Router } from '@angular/router';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Component({
  selector: 'app-ip',
  templateUrl: './ip.component.html',
  styleUrls: ['./ip.component.css']
})

export class IpComponent implements OnInit {

  ipName;
  loader = true;
  initialData = [];
  releasesDetails = [];
  releaseNames = [];
  releaseNamesUnfiltered = [];
  url;
  selected: any;
  showIcon = true;
  showBackgroundColor = false;
  selectedRelease: string[] = [];
  tableColor = false;
  sharableReleaseVersionLink;
  packageColumnHeadElements = ['package_number', 'package_version', 'package_name', 'package_url'];
  softwareLoadsColumnHeadElements = ['software', 'status'];
  platformContentsColumnHeadElements = ['Model', 'Version'];
  textMessage: any;
  msgHideAndShow = false;
  ipArray = [];
  modelDescShort;

  constructor(private route: ActivatedRoute, private api: ApiService, private themeService: ThemeService, private router: Router) {

  }

  ngOnInit(): void {
    this.url = window.location.href;
    this.showIcon = true;
    this.showBackgroundColor = false;
    this.tableColor = !this.tableColor;
    this.sharableReleaseVersionLink = window.location.href;
    const buildTimeFromURL = this.route.snapshot.paramMap.get('buildTime');
    const ipname = this.route.snapshot.paramMap.get('ipName') ? this.route.snapshot.paramMap.get('ipName') : '';
    const modelShortDescName = this.route.snapshot.paramMap.get('modelDescShort') ? this.route.snapshot.paramMap.get('modelDescShort') : '';
    this.ipName = ipname;
    this.modelDescShort = modelShortDescName;
    this.api.getAllData()
    .subscribe(data => {
      this.initialData = data.body;
      const ip = 'ip';
      this.ipArray = this.initialData.filter((a) => {
        return a.type === 'ip' && a.class_name === this.ipName;
      });
      for (let i = 0; i < this.ipArray.length; i++) {
        for (let j = 0; j < this.ipArray[i].releases.length; j++) {
          this.ipArray[i].releases[j][ip] = this.ipArray[i].class_name;
          this.releaseNames.push(this.ipArray[i].releases[j]);
        }
      }
      this.releasesDetails = this.releaseNames.sort((a, b) => {
        const dateA = new Date(this.api.formatDate(a.date.reverse().join('-'), 'yyyy/mm/dd'));
        const dateB = new Date(this.api.formatDate(b.date.reverse().join('-'), 'yyyy/mm/dd'));
        return (dateB.getTime() - dateA.getTime());
      });
      // Call the API to read the data from the JSON and filter the results based on the search text
      this.releaseNames = this.releasesDetails.filter(
        (releases) => (releases.ip.toLowerCase().includes(this.ipName.toLowerCase()))
      ).reverse();
      this.selected = buildTimeFromURL;
      this.releaseNamesUnfiltered = this.releaseNames.filter(
        (releases) => (releases.build_time.includes(this.selected))
      );
      this.loader = false;
    }, (error) => (this.loader === true)); // hide the spinner in case of error);
  }

  // Get the Release Detail based on the release name
  public getIPDetail($event: any) {
      // Call the API to read the data from the JSON and filter the results based on the search text
      this.api.getAllData()
      .subscribe(data => {
        this.releaseNamesUnfiltered = this.releaseNames.filter(
          (releases) => (releases.build_time.includes($event.build_time))
        );
        this.selected = $event.build_time;
        this.onChange(this.ipName, $event.build_time);
        this.showBackgroundColor = !this.showBackgroundColor;
        this.loader = false;
      });
      return this.releaseNamesUnfiltered;
  }

  // Display the Minus icon on clicking the plus icon for the Release Vrsions
  public dispMinus(el: HTMLElement) {
    this.showIcon = !this.showIcon;
    el.scrollIntoView({behavior: 'smooth'});
  }

  public isActive(item) {
    return this.selected === item.build_time;
  }

  public onChange(ipName: string, buildTime: string) {
    const index = this.selectedRelease.indexOf(buildTime);
    this.sharableReleaseVersionLink = '';
    if (index === -1) {
      this.selectedRelease.length = 0;
      this.selectedRelease.push(buildTime);
    } else {
      this.selectedRelease.splice(index, 1);
    }
    this.router.navigate(['/ip', ipName, buildTime]);
    this.sharableReleaseVersionLink = window.location.protocol + '//' + window.location.host
    + '/ip/' + ipName + '/' + buildTime;
  }

  public isSelected(buildTime: string) {
    return this.selectedRelease.indexOf(buildTime) >= 0;
  }

  /* firstComponentFunction() {
    this.api.onFirstComponentButtonClick();
  } */

/* To copy Text from Textbox */
public copyInputMessage(inputElement) {
  inputElement.select();
  document.execCommand('copy');
  inputElement.setSelectionRange(0, 0);
  this.textMessageFunc('Text');
}

  /* Copy to Clipboard */
  public textMessageFunc(msgText) {
    this.textMessage = msgText + ' Copied to Clipboard';
    this.msgHideAndShow = true;
    setTimeout(() => {
      this.textMessage = '';
      this.msgHideAndShow = false;
    }, 1000);
  }
}
