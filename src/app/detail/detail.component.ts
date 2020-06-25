import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from '../api.service';
import { ThemeService } from '../theme/theme.service';
import { Router } from '@angular/router';

// we can now access environment.apiUrl
const API_URL = environment.apiUrl;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  public platformName;
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
  packageColumnHeadElements = ['package_number', 'package_version', 'package_name', 'download_link'];
  softwareLoadsColumnHeadElements = ['software', 'status'];
  platformContentsColumnHeadElements = ['Model', 'Version'];
  textMessage: any;
  msgHideAndShow = false;
  platformCount = 0;
  platformArray = [];

  constructor(private route: ActivatedRoute, private api: ApiService, private themeService: ThemeService, private router: Router) {
    const name = this.route.snapshot.paramMap.get('platformName') ? this.route.snapshot.paramMap.get('platformName') : '';
    this.platformName = name;
  }

  ngOnInit(): void {
    this.url = window.location.href;
    this.showIcon = true;
    this.showBackgroundColor = false;
    this.tableColor = !this.tableColor;
    this.sharableReleaseVersionLink = window.location.href;
    const releaseNameFromURL = this.route.snapshot.paramMap.get('releaseName');
    this.api.getAllData()
    .subscribe(data => {
      this.initialData = data.body;
      const platform = 'platform';
      this.platformArray = this.initialData.filter((a) => {
        return a.type === 'platform' && a.platform === this.platformName;
      });
      for (let i = 0; i < this.platformArray.length; i++) {
        for (let j = 0; j < this.platformArray[i].releases.length; j++) {
          this.platformArray[i].releases[j][platform] = this.platformArray[i].platform;
          this.releaseNames.push(this.platformArray[i].releases[j]);
        }
      }
      this.releasesDetails = this.releaseNames.sort((a, b) => {
        const dateA = new Date(this.api.formatDate(a.workweek.split('.').reverse().join('-'), 'yyyy/mm/dd'));
        const dateB = new Date(this.api.formatDate(b.workweek.split('.').reverse().join('-'), 'yyyy/mm/dd'));
        return (dateB.getTime() - dateA.getTime());
      });
      // Call the API to read the data from the JSON and filter the results based on the search text
      this.releaseNames = this.releasesDetails.filter(
        (releases) => (releases.platform.toLowerCase().includes(this.platformName.toLowerCase()))
      ).reverse();
      this.selected = releaseNameFromURL;
      this.releaseNamesUnfiltered = this.releaseNames.filter(
        (releases) => (releases.releaseName.includes(this.selected))
      );
      this.loader = false;
    }, (error) => (this.loader === true)); // hide the spinner in case of error);
  }

  // Get the Release Detail based on the release name
  public getPlatformDetail($event: any) {
      // Call the API to read the data from the JSON and filter the results based on the search text
      this.api.getAllData()
      .subscribe(data => {
        this.releaseNamesUnfiltered = this.releaseNames.filter(
          (releases) => (releases.releaseName.includes($event.releaseName))
        );
        this.selected = $event.releaseName;
        this.onChange(this.platformName, $event.releaseName);
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
    return this.selected === item.releaseName;
  }

  public onChange(platformName: string, releaseName: string) {
    const index = this.selectedRelease.indexOf(releaseName);
    this.sharableReleaseVersionLink = '';
    if (index === -1) {
      this.selectedRelease.length = 0;
      this.selectedRelease.push(releaseName);
    } else {
      this.selectedRelease.splice(index, 1);
    }
    this.router.navigate(['/platform', platformName, releaseName]);
    this.sharableReleaseVersionLink = window.location.protocol + '//' + window.location.host
    + '/platform/' + platformName + '/' + releaseName;
    return this.sharableReleaseVersionLink;
  }

  public isSelected(releaseName: string) {
    return this.selectedRelease.indexOf(releaseName) >= 0;
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
