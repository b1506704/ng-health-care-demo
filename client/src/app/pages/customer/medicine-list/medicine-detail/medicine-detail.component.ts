import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Medicine } from 'src/app/shared/models/medicine';
import formatCurrency from 'src/app/utils/formatCurrency';
import { MedicineStore } from '../../../../shared/services/medicine/medicine-store.service';
import { Image } from 'src/app/shared/models/image';
import { ImageHttpService } from 'src/app/shared/services/image/image-http.service';
@Component({
  selector: 'app-medicine-detail',
  templateUrl: 'medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.scss'],
})
export class MedicineDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() medicineID!: string;
  medicineData!: Medicine;
  price!: string;
  imageData: Image = {
    sourceID: '',
    container: '',
    category: '',
    title: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    url: '../../../../../assets/imgs/favipiravir_2.jpg',
  };

  constructor(
    private medicineStore: MedicineStore,
    private imageService: ImageHttpService
  ) {}

  medicineDataListener() {
    return this.medicineStore.$medicineInstance.subscribe((data: any) => {
      this.medicineData = data;
      this.price = formatCurrency(this.medicineData.price, '$');
      this.imageService.getImageBySourceID(data._id).subscribe((data: any) => {
        if (data !== null) {
          this.imageData = data;
        }
      });
    });
  }

  getImage(id: string) {
    return;
  }

  renderSourceData() {
    this.medicineData = null;
    this.price = null;
    this.imageData = {
      sourceID: '',
      container: '',
      category: '',
      title: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
      url: '../../../../../assets/imgs/favipiravir_2.jpg',
    };
    setTimeout(() => {
      this.medicineStore.getMedicine(this.medicineID).then(() => {
        this.medicineDataListener();
      });
    }, 100);
  }

  formatCurrency() {
    return formatCurrency(this.medicineData.price, '$');
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.renderSourceData();
  }

  ngOnDestroy(): void {
    this.medicineDataListener().unsubscribe();
  }
}
