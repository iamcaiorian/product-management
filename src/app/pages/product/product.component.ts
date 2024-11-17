import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../shared/models/product';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CreateProductComponent } from '../../components/create-product/create-product.component';
import { ToastService } from '../../shared/utils/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export interface ProductFilter {
  title?: string;
  status?: 'active' | 'inactive' | 'all';
  price?: {
    min?: number;
    max?: number;
  };
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ProductTableComponent, 
    ReactiveFormsModule, 
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  @ViewChild('toastErrorCreateProduct')
  toastErrorCreateProduct!: TemplateRef<any>;

  faPlus = faPlus;
  formProductFilter!: FormGroup;
  products: Product[] = [];
  filters?: ProductFilter;

  private modalCreateProductRef: NgbModalRef | null = null;

  private modalService: NgbModal = inject(NgbModal);
  private productsService: ProductsService = inject(ProductsService);
  private toastService: ToastService = inject(ToastService);
  private fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.getProducts();
    this.formProductFilter = this.fb.group({
      title: [''],
      status: ['all'],
      price: this.fb.group({
        min: [''],
        max: [''],
      }),
      quantity: [''],
    });

    this.formProductFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filters: ProductFilter) => {
        this.filters = this.getCleanFilters(filters);
      });
  }

  private getCleanFilters(filters: any): ProductFilter {
    const cleanFilters: ProductFilter = {};

    if (filters.title?.trim()) {
      cleanFilters.title = filters.title.trim();
    }

    if (filters.status && filters.status !== 'all') {
      cleanFilters.status = filters.status;
    }

    if (filters.price?.min || filters.price?.max) {
      cleanFilters.price = {};
      if (filters.price.min) {
        cleanFilters.price.min = Number(filters.price.min);
      }
      if (filters.price.max) {
        cleanFilters.price.max = Number(filters.price.max);
      }
    }

    return cleanFilters;
  }

  onCreateProductClick() {
    this.modalCreateProductRef = this.modalService.open(
      CreateProductComponent,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
      }
    );

    this.modalCreateProductRef.result.then(() => this.getProducts());
  }

  open(content: TemplateRef<any>) {
    this.modalCreateProductRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.modalCreateProductRef.result.then();
  }

  clearFilters(): void {
    this.formProductFilter.reset({
      title: '',
      status: 'all',
      price: {
        min: '',
        max: '',
      },
    });

    this.filters = {};

    this.getProducts();
  }

  getProducts(): void {
    this.productsService
      .getProducts(this.filters || {})
      .pipe(take(1))
      .subscribe({
        next: (products) => (this.products = products),
        error: () =>
          this.toastService.show({
            template: this.toastErrorCreateProduct,
            classname: 'bg-danger text-light',
            delay: 3000,
          }),
      });
  }
}
