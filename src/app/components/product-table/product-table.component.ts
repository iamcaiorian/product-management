import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';

import { Product } from '../../shared/models/product';
import { FormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbHighlight,
  NgbModal,
  NgbModalRef,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateProductComponent } from '../create-product/create-product.component';
import { ConfirmDeleteProductComponent } from '../confirm-delete-product/confirm-delete-product.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    FontAwesomeModule,
    NgbDropdownModule,
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
})
export class ProductTableComponent {
  @Input() products: Product[] = [];
  @Output() updateProducts = new EventEmitter<void>();

  searchTerm: string = '';
  faGear = faGear;

  private modalEditProductRef: NgbModalRef | null = null;
  private modalDeleteProductRef: NgbModalRef | null = null;

  private modalService = inject(NgbModal);

  onSort(event: any) {
    console.log(event);
  }

  onEditClick(id: string) {
    this.modalEditProductRef = this.modalService.open(CreateProductComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.modalEditProductRef.componentInstance.productId = id;

    this.modalEditProductRef.result.then(() => this.updateProducts.emit());
  }

  onDeleteClick(id: string,  name: string) {
    this.modalDeleteProductRef = this.modalService.open(
      ConfirmDeleteProductComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
      }
    );

    this.modalDeleteProductRef.componentInstance.productId = id;
    this.modalDeleteProductRef.componentInstance.productName = name;

    this.modalDeleteProductRef.result.then(() => this.updateProducts.emit());
  }
}
