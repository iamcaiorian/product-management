import {
  Component,
  Inject,
  Input,
  ViewChild,
  TemplateRef,
  inject,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../../services/products/products.service';
import { finalize, take } from 'rxjs';
import { ToastService } from '../../shared/utils/toast.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirm-delete-product',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './confirm-delete-product.component.html',
  styleUrl: './confirm-delete-product.component.scss',
})
export class ConfirmDeleteProductComponent {
  @ViewChild('toastSuccessDeleteProduct')
  toastSuccessDeleteProduct!: TemplateRef<any>;
  @ViewChild('toastErrorDeleteProduct')
  toastErrorDeleteProduct!: TemplateRef<any>;

  @Input() productId: string = '';
  @Input() productName: string = '';

  private productsService: ProductsService = inject(ProductsService);
  private toastService = inject(ToastService);

  modal = inject(NgbActiveModal);
  faSpinner = faSpinner;
  deleteProductLoading = false;

  onDeleteClick() {
    this.deleteProductLoading = true;

    this.productsService
      ?.deleteProduct(this.productId)
      ?.pipe(
        take(1),
        finalize(() => {
          this.deleteProductLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.show({
            template: this.toastSuccessDeleteProduct,
            classname: 'bg-success text-light',
            delay: 3000,
          });
          this.modal.close('Ok click');
        },
        error: () => {
          this.toastService.show({
            template: this.toastErrorDeleteProduct,
            classname: 'bg-danger text-light',
            delay: 3000,
          });
          this.modal.dismiss('Error deleting product');
        },
      });
    this.modal.close('Ok click');
  }
}
