import { Injectable, computed, signal, effect } from '@angular/core';
import { ApiService, IProduct } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItems = signal<IProduct[]>([]);
  public subTotal = computed(() => this.cartItems().reduce((prev: any, curr: IProduct) => {
    return prev + curr.price;
  }, 0));
  public totalItems = computed(() => this.cartItems().length);

  constructor(private api: ApiService) {
    this.setupCartEffects();
  }

  private setupCartEffects() {
    effect(() => {
      const currentCartItems = this.cartItems();
      const products = this.api.products();

      if (products) {
        products.forEach(product => {
          const cartCount = currentCartItems.filter(item => item.id === product.id).length;
          product.rating.count = product.rating.count - cartCount;
        });
      }
    });
  }

  addProductSignal(product: IProduct) {
    this.cartItems.update((val) => [...val, product]);
  }

  removeProductSignal(id: number) {
    this.cartItems.update(val => {
      const newCartItems = [...val];
      newCartItems.splice(id, 1);
      return newCartItems;
    });
  }
}