import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'logicApp';
  private URL = '../assets/req.json';
  convertedData: ExceptionList[] | undefined;
  constructor(private client: HttpClient) {
  }

  ngOnInit(): void {

    this.client.get(this.URL).subscribe((res: any) => {
      if(res){
        this.processRequest(res);
      }
    });
  }
  private processRequest(res: any) {
    let resultData = [];
    const data : ReqData = JSON.parse(JSON.stringify(res));

    this.convertedData = data.data.clin_xcpt.map(item => {
      return {
        status: this.getStatus(item),
        customerName: item.customerName,
        policyId: item.policyId,
        lob: item.lineOfBusinessRefId,
        fundingArrangement: item.fundingArrangementRefId,
        exceptionCategory: item.exceptioncategoryRefId,
        trackingNumber: item.trackingNumber,
        edit: 'edit',
        expandableSection: this.expandleSelection(item)
      };
    });
    console.log(this.convertedData);
  }

  private expandleSelection(item: ClinXcpt) {
    return [{
      exceptionText: item.clin_xcpt_txt,
      startDate: item.strt_dt,
      endDate: item.end_dt
    }];
  }

  private getStatus(item: ClinXcpt) {
        const from = item.strt_dt.split("-");
        const end = item.end_dt.split("-");
        var dfrom = new Date(parseInt(from[0]), parseInt(from[1])-1, parseInt(from[2]));  // -1 because months are from 0 to 11
        var dto   = new Date(parseInt(end[0]), parseInt(end[1])-1, parseInt(end[2]));
        var check = new Date();
        return (check > dfrom && check < dto) ? 'Active':'InActive';
  }
}



export interface ExceptionList {
  status:             string;
  customerName:       string;
  policyId:           string;
  lob:                any;
  fundingArrangement: any;
  exceptionCategory:  any;
  trackingNumber:     any;
  edit:               string;
  expandableSection:  ExpandableSection[];
}

export interface ExpandableSection {
  exceptionText: string;
  startDate:     string;
  endDate:       string;
}


export interface ReqData {
  data: Data;
}

export interface Data {
  clin_xcpt: ClinXcpt[];
}

export interface ClinXcpt {
  clin_xcpt_id:            string;
  policyId:                string;
  customerName:            string;
  trackingNumber:          number;
  lineOfBusinessRefId:     number;
  fundingArrangementRefId: number;
  exceptioncategoryRefId:  number;
  clin_xcpt_txt:           string;
  strt_dt:                 string;
  end_dt:                  string;
}
