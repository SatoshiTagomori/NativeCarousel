class BasicFuncs{
    //基本的な要素を取得する
    //一番外側のdiv要素をcarousel
    //ul要素はそのままul
    //複数あるli要素はlisと定義する
    constructor(element,args){
        let this_obj = this
        this.carousel = element;
        this.ul = this.carousel.querySelectorAll('ul')[0];
        this.lis = this.ul.querySelectorAll('li');
        this.lis_even = this.ul.querySelectorAll('li:nth-child(2n)');
        this.lis_odd = this.ul.querySelectorAll('li:nth-child(2n+1)');

        //クリックやタッチに関する基礎的な動作
        //スライドするかどうか
        this.slide=true;
        //現在の左位置
        this.leftNow=0;
        //マウスをクリックした状態かどうか
        this.mouseOn=false;
        //開始位置
        this.startX=0;
        this.cursorX=0;
        this.carousel.addEventListener('click',function(e){
            this_obj.moveStart(e,this_obj);
        },false);
        this.carousel.addEventListener('touchstart',this.moveStart,false);
        this.carousel.addEventListener('mousemove',function(e){
            this_obj.onMove(e,this_obj);
        },false);
        this.carousel.addEventListener('touchmove',this.onMove,false);
        this.carousel.addEventListener('mouseup',function(e){
            this_obj.mouseEnd(e);
        },false);
        this.carousel.addEventListener('touchend',this.mouseEnd,false);
    }

    ulMove(){
        if(this.slide === true){
            this.ul.style.left = this.leftNow - (this.startX-this.cursorX)+'px';
        }    
    }

    mouseEnd(e){
        e.preventDefault();
        this.mouseOn=false;
    }

    onMove(e,this_obj){
        e.preventDefault();
        if(e.type==='mousemove' && this_obj.mouseOn===true){
            this_obj.cursorX=e.clientX;
        }else if(e.type==='touchmove'){
            this_obj.cursorX=e.touches[0].clientX;
        }
        console.log(this_obj);
    }


    moveStart(e,this_obj){
        e.preventDefault();
        this_obj.mouseOn = true;
        if(e.type==='touchstart'){
            this_obj.startX=e.touches[0].clientX;
        }else if(e.type==='click'){
            this_obj.startX=e.clientX;
        }
        

    }


    moveEnd(e){
        e.preventDefault();
        this.mouseOn=false;
    }

    //初期パラメーターを上書きするメソッド
    setParams(args){
        let this_obj = this
        Object.keys(args).forEach(function(key){
            if(isNaN(args[key])===true){
                eval('this_obj.'+key+'=\''+args[key]+'\'');
            }else{
                eval('this_obj.'+key+'='+args[key])
            }
        })
    }
    //要素にスタイルをセットする
    setElementStyle(element,hash={}){
        if(NodeList.prototype.isPrototypeOf(element)===true){
            element.forEach(function(el){
                Object.assign(el.style,hash);
            });
        }else{
            Object.assign(element.style,hash);
        }
    }
    //一番外側の要素にスタイルを適用する
    setCarouselStyle(params){
        this.setElementStyle(this.carousel,params);
    }
    //ul要素にスタイルを適用する
    setUlStyle(params){
        this.setElementStyle(this.ul,params);
    }
    //li要素にスタイルを適用する
    setLiStyle(params){
        this.setElementStyle(this.lis,params);
    }
    setLiOddStyle(params){
        this.setElementStyle(this.lis_odd,params);
    }
    setLiEvenStyle(params){
        this.setElementStyle(this.lis_even,params);
    }
    

    //カルーセルの初期スタイルをセット
    setDefaultCarouselStyle(){
        //カルーセル全体のスタイル定義
        this.setCarouselStyle({
            width: this.width,
            overflow: 'hidden',
            margin:'0 auto',
            height: this.height,
            position:'relative'
        });
        //ulのスタイル定義
        this.setUlStyle({
            padding:'0',
            width: this.carousel.clientWidth * this.lis.length + 'px',
            position:'relative',
            left: -(this.page * this.carousel.clientWidth) + 'px',
            margin:'0'   
        });
        //liのスタイル定義
        this.setLiStyle({
            listStyle:'none',
            width: this.carousel.clientWidth + 'px',
            float: 'left',
            height: this.height,
            backgroundRepeat:'no-repeat',
            backgroundSize: this.backgroundSize,
            backgroundPosition: this.backgroundPosition,
        });  
    }

}

//カルーセルのスタイルを定義するクラス
class CarouselStyle extends BasicFuncs{
    constructor(element,args){
        super(element,args);
        this.setDefaultParams(args);
        this.setStyle();
    }
    //スタイルを設定する
    setStyle(){
        //カルーセルの初期スタイル
        this.setDefaultCarouselStyle();
    }
    setDefaultParams(args){
        this.width = '100%';
        this.height = '300px';
        this.backgroundSize='cover';
        this.backgroundPosition='center';
        this.page=0;
        this.setParams(args);
    }
}

class MangaStyle extends BasicFuncs{
    constructor(element,args){
        super(element,args);
        this.setDefaultParams(args);
        this.setStyle();
    }
    //スタイルを設定する
    setStyle(){
        //漫画のスタイル
        this.setWideMangaStyle();
        if(this.carousel.clientWidth<this.threshold){
            //カルーセルの初期スタイル
            this.setDefaultCarouselStyle();
            this.setCarouselStyle({
                height: this.carousel.clientWidth*this.aspectRatio+'px'
            })
            this.setLiStyle({
                height: this.carousel.clientWidth*this.aspectRatio+'px'
            })
        }
    }
    setWideMangaStyle(){
        this.setCarouselStyle({
            height:'auto',
            width: this.width,
            margin: '0 auto'
        })
        this.setUlStyle({
            width: '100%',
            margin: '0',
            padding: '0',
            boxSizing:'border-box',
            overflow:'hidden'
        })
        this.setLiStyle({
            width: this.carousel.clientWidth/2.1 + 'px',
            height: this.carousel.clientWidth/2.1*this.aspectRatio + 'px',
            marginBottom:'30px',
            listStyle:'none',
            backgroundRepeat:'no-repeat',
            backgroundSize:this.backgroundSize,
            backgroundPosition:this.backgroundPosition
        })
        this.setLiOddStyle({
            float:'left',
            clear:'both'
        })
        this.setLiEvenStyle({
            float:'right'
        })
    }

    setDefaultParams(args){
        this.width = '100%';
        this.height = '300px';
        this.backgroundSize='cover';
        this.backgroundPosition='center';
        this.page=0;
        //レスポンシブルにする際の横幅の閾値をピクセルで指定
        this.threshold=756;
        //幅に対する高さの比率
        this.aspectRatio=0.53716690042;
        this.setParams(args);
    }
}


//移動に関するクラス
class CarouselMove extends CarouselStyle{
    constructor(element,args){
        super(element,args);
        
    }

}
class MangaMove extends MangaStyle{
    constructor(element,args){
        super(element,args);
    }
}


//カルーセル用クラス
class NativeCarousel{
    constructor(selector,args=[]){
        document.querySelectorAll(selector).forEach(function(element){
            let carousel_obj = new CarouselMove(element,args);
            window.addEventListener('resize',function(){
                carousel_obj.setStyle();
            })
        })
    }
}

class NativeManga{
    constructor(selector,args=[]){
        document.querySelectorAll(selector).forEach(function(element){
            let carousel_obj = new MangaMove(element,args);
            window.addEventListener('resize',function(){
                carousel_obj.setStyle();
            })
        })
    } 
}