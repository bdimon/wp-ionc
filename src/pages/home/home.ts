import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';
import { DetailPage } from '../detail/detail';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public items: any = [];
  private per_page: number= 5;
  private page: number=1;
  private showLoadMore:boolean = false;
  private isLoading:boolean = false;
  private category_id:number=0;
  private sort:string='0';

  constructor(public navCtrl: NavController,
     public api: ApiProvider,
     public navPar: NavParams) {
  if(this.navPar.get('cat_id')!=null && this.navPar.get('cat_id')!=undefined) {
    this.category_id=this.navPar.get('cat_id');
  }
  
  this.getPosts();

  }

  getPosts(infiniteScroll=null) {
    if(!(this.isLoading)) {
      this.isLoading=true;
      if(infiniteScroll!=null && infiniteScroll.ionRefresh) {
        this.page=1;
      }
      let url:string='posts?_embed&per_page='+this.per_page+'&page='+this.page;
      url+=this.category_id!=0? '&categories='+this.category_id: '';
      url+=this.sort=='1'? '&order-asc':this.sort=='2' ? '&orderby=title&order=asc':this.sort=='3' ? '&orderby=title&order=desc': '';
    this.api.get(url)
    .subscribe((data:any) => {
      this.isLoading=false;
      this.items = infiniteScroll!=null && infiniteScroll.ionRefresh ? data: this.items.concat(data);
      if(data.length===this.per_page){
        this.page++;
        // this.showLoadMore=true;
      }
      // }else{
      //   this.showLoadMore=false;
      // }
      if(infiniteScroll!=null){
        infiniteScroll.complete();
      }
    }, (error) => {
      this.isLoading=false;
      if(infiniteScroll!=null){
        infiniteScroll.complete();
      // if(error.error.code==='rest_post_invalid_page_number') {
      //   this.showLoadMore=false;
      }
      
      console.log(error);
    });
  }
  }
  changeSort() {
    console.log(this.sort);
    this.items=[];
    this.page=1;
    this.showLoadMore=false;
    this.getPosts();
  }

  openDetail(item) {
    this.navCtrl.push(DetailPage, {post:item})
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
  

  
}
