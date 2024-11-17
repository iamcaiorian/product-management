import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../../shared/models/product';
import { ProductFilter } from '../../pages/product/product.component';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:3000/products';

  http = inject(HttpClient);

  /**
   * Fetch all products
   */
  getProducts(filters: ProductFilter): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products) => {
        products = products.filter(
          (product) => product.id && product.id !== ''
        );
        
        if (filters.title) {
          products = products.filter((product) =>
            product.title
              .toLowerCase()
              .includes(filters?.title?.toLowerCase() || '')
          );
        }

        if (filters?.status) {
          products = products.filter(
            (product) => product.status.toString() === filters?.status
          );
        }

        if (filters?.price?.min) {
          products = products.filter(
            (product) =>
              filters.price &&
              filters.price.min !== undefined &&
              product.price >= filters.price.min
          );
        }

        if (filters?.price?.max) {
          products = products.filter(
            (product) =>
              filters.price &&
              filters.price.max !== undefined &&
              product.price <= filters.price.max
          );
        }
        return products;
      })
    );
  }

  /**
   * Fetch a single product by ID
   * @param id Product ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add a new product
   * @param product Product data
   */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param product Updated product data
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Delete a product by ID
   * @param id Product ID
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
