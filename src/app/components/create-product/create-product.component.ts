import {
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../shared/models/category';
import { Product } from '../../shared/models/product';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products/products.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome } from '@fortawesome/free-solid-svg-icons';
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { take, finalize } from 'rxjs';
import { ToastService } from '../../shared/utils/toast.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbDatepickerModule,
    FontAwesomeModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  @ViewChild('toastSuccessCreateProduct')
  toastSuccessCreateProduct!: TemplateRef<any>;

  @ViewChild('toastErrorCreateProduct')
  toastErrorCreateProduct!: TemplateRef<any>;

  @ViewChild('toastErrorGetProductById')
  toastErrorGetProductById!: TemplateRef<any>;

  @Input() productId?: number;

  faSpinner = faSpinner;

  closeResult = '';

  productForm!: FormGroup;
  categories: Category[] = [
    {
      description: 'Medicamentos',
      id: 149,
    },
    {
      description: 'Genéricos',
      id: 150,
      parentCategoryId: 149,
    },
    {
      description: 'Refrescante',
      id: 177,
    },
    {
      description: 'Sorvete',
      id: 179,
      parentCategoryId: 177,
    },
    {
      description: 'Mamãe e Bebê',
      id: 152,
    },
    {
      description: 'Beleza',
      id: 154,
    },
    {
      description: 'Shampoo',
      id: 168,
      parentCategoryId: 154,
    },
    {
      description: 'Condicionador',
      id: 169,
      parentCategoryId: 154,
    },
    {
      description: 'Dores e Febre',
      id: 172,
      parentCategoryId: 149,
    },
  ];

  registerProductIsLoading: boolean = false;
  modalCreateProductTitle: string = 'Cadastrar produto';

  private productService = inject(ProductsService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private ngbActiveModal = inject(NgbActiveModal);
  private modalCreateProductRef: NgbModalRef | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      promotionalPrice: [null],
      status: [true, Validators.required],
      categories: [[]],
      topImage: ['', Validators.required],
    });

    this.getInitalProduct();

    if (this.productId) {
      this.modalCreateProductTitle = 'Editar Produto';
    }
  }

  getInitalProduct(): void {
    if (!this.productId) {
      return;
    }

    this.productService
      .getProductById(this.productId)
      .pipe(take(1))
      .subscribe({
        next: (product: Product) => {
          this.productForm.patchValue({
            code: product.code,
            title: product.title,
            description: product.description,
            price: product.price,
            promotionalPrice: product.promotionalPrice,
            status: product.status,
            categories: product.categories.map((category) => category.id),
            topImage: product.topImage,
          });
        },
        error: () => {
          this.toastService.show({
            template: this.toastErrorGetProductById,
            classname: 'bg-danger text-light',
            delay: 3000,
          });
        },
      });
  }

  onCreateProductModalClose(): void {
    this.ngbActiveModal.close();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.registerProductIsLoading = true;
    }

    if (this.productId) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  private updateProduct(): void {
    if (!this.productId) {
      return;
    }

    this.productService
      .updateProduct(this.productId, this.productForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.registerProductIsLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.show({
            template: this.toastSuccessCreateProduct,
            classname: 'bg-success text-light',
            delay: 3000,
          });
          
          this.onCreateProductModalClose();
        },
        error: () => {
          this.toastService.show({
            template: this.toastErrorCreateProduct,
            classname: 'bg-danger text-light',
            delay: 3000,
          });
        },
      });
  }

  private createProduct(): void {
    this.productService
      .addProduct(this.productForm.value)
      .pipe(
        take(1),
        finalize(() => {
          this.registerProductIsLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.show({
            template: this.toastSuccessCreateProduct,
            classname: 'bg-success text-light',
            delay: 3000,
          });
          this.onCreateProductModalClose();
        },
        error: () => {
          this.toastService.show({
            template: this.toastErrorCreateProduct,
            classname: 'bg-danger text-light',
            delay: 3000,
          });
        },
      });
  }

  open(content: TemplateRef<any>) {
    this.modalCreateProductRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.modalCreateProductRef.result.then();
  }
}
