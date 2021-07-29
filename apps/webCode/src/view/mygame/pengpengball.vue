<template>
<div class="bodys"  @touchstart="movestart($event)" @touchmove="tomove($event)" @touchend="moveend($event)">
    <div class="ball cla" id="ball"></div>
    <div class="ball cla" id="ball1"></div>
    <div class="ball cla" id="ball2"></div>
    <div class="ball cla" id="ball3"></div>
    <div class="thewall" id="thewall">

    </div>
</div>

</template>
<script>

export default {

  data(){
      return{
          changex:0,
          changey:0,
          linewidth:0,
          thebottom:false,
          thetop:false,
          thisxy:{}
      }
  },
  filters:{

  },
  watch:{
    //   endX(newVal){
    //       if(newVal==0){
    //           this.automoveball()
    //           console.log('ga');
    //       }
    //   }
  },
props:{


	},
  mounted(){
    this.thisxy = {
              endx:document.querySelector('.bodys').clientWidth - document.querySelector("#ball").clientWidth,
              endy:Math.random()*400+100,
              startx:0,
              starty:0
          }
    this.changeangle(this.thisxy.startx,this.thisxy.starty,this.thisxy.endx,this.thisxy.endy)
    document.getElementById('ball').addEventListener("webkitAnimationIteration",()=>{
        this.changeangle(this.thisxy.startx,this.thisxy.starty,this.thisxy.endx,this.thisxy.endy)
        this.linewidth +=1 
    })
  },
  methods:{
      movestart(e){
          this.startX = e.touches[0].clientX
          this.tomove(e)
      },
      tomove(e){
        var div = document.querySelector("#thewall")
        var width = (div.clientWidth)/2
        var x = e.touches[0].clientX
        var body = document.querySelector('.bodys').clientWidth
        if(x<width){
            x=width
        }
        if(body-x <width){
            x=body-width
        }
        div.style.left = x-width +'px'
        
      },
      moveend(e){
          
      },
      changeangle(startx,starty,endx,endy){
        var linelength =Math.sqrt( (endy - starty)*(endy - starty) + (endx - startx)*(endx - startx))*2
        var time = 1000
        // if(linelength<1000){
        //     time = 1000
        // }
        console.log('time : ',time);
        var styleNode = document.createElement("style");
        styleNode.innerHTML=`
        .cla{
            animation: `+time+`ms xc linear infinite;
        }
        @keyframes xc{
            0%{
                top:`+starty+`px;
                left:`+startx+`px;
            }
            100%{
                top:`+endy+`px;
                left:`+endx+`px;
            }
        };`;
        // setTimeout(()=>{
            var tollheight = document.querySelector('.bodys').clientHeight
            var tollwidth = document.querySelector('.bodys').clientWidth

            if((2*endy-starty>= tollheight- document.querySelector("#ball").clientHeight)){
                if(this.thebottom){
                    console.log(2);
                        if(startx - endx<= 0){
                            var newendy = tollheight - this.changey
                            if(tollwidth - endx <= document.querySelector("#ball").clientHeight){
                                var newendx = 0
                            }
                            else{
                                var newendx = document.querySelector('.bodys').clientWidth - document.querySelector("#ball").clientWidth
                            }
                        }
                        else{
                            var newendy = tollheight - this.changey
                            if(endx <= document.querySelector("#ball").clientHeight){
                                var newendx = document.querySelector('.bodys').clientWidth - document.querySelector("#ball").clientWidth
                            }
                            else{
                                var newendx = 0
                            }
                        }
                        if(newendy>tollheight- document.querySelector("#ball").clientHeight){
                            newendy = starty
                            
                        } 
                        

                        
                        
                        this.thebottom =false
                }
                else{
                    if(startx - endx<= 0){
                         var newendx =(( (2*endy-starty)-tollheight)/((2*endy-starty)-tollheight + tollheight - endy) )*tollwidth
                    }
                    else{
                         var newendx =(( tollheight - endy)/((2*endy-starty)-tollheight + tollheight - endy) )*tollwidth
                    }
                    var newendy = tollheight - document.querySelector("#ball").clientHeight
                   
                    this.changey = (2*endy-starty)-tollheight
                    this.thebottom = true
                    console.log(1);
                }
            }
            else if(2*endy-starty <= 0 ){
                if(this.thetop){
                    console.log(4);
                    // (sy/ey) = (ex)/(w-ex)
                        var newendy = starty*(tollwidth - endx)/(endx)
                        if(startx - endx<= 0){
                            newendx = document.querySelector('.bodys').clientWidth - document.querySelector("#ball").clientWidth
                        }
                        else{
                            newendx = 0 
                        }
                        this.thetop =false
                }
                else{
                    console.log(5);
                        var newendy = 0
                        if(startx - endx<= 0){
                            newendx =tollwidth - (endy/(starty -endy))*tollwidth
                            
                        }
                        else{
                            newendx = (endy/(starty -endy))*tollwidth
                        }
                        this.thetop= true
                }

                        
            }
            else{
                console.log(3);
                if(starty - endy<= 0){
                         var newendy =2*endy-starty
                    }
                else{
                        if(startx - endx<= 0){
                            var newendy =endy - (starty -endy)/((tollwidth - startx)/tollwidth)
                        }
                        else{
                            var newendy =endy - (starty -endy)/(startx/tollwidth)
                        }
                        if(newendy<0){
                            // ey/(sy - ey) = x/W
                            newendy = 0
                        }  
                }
                if(endx == 0){
                    var newendx = document.querySelector('.bodys').clientWidth - document.querySelector("#ball").clientWidth
                }
                else{
                    var newendx = 0
                }
                
            }
            this.thisxy.endx = newendx
            this.thisxy.endy = newendy
            this.thisxy.startx = endx
            this.thisxy.starty = endy
            // document.querySelector("#ball").style.top= newendy
            // document.querySelector("#ball").style.left= newendx
        // },time)
        document.head.appendChild(styleNode);
        console.log(document.getElementById('ball').getAnimations.speed);
      }
  }
}
</script>

<style lang="scss" scoped>
.bodys{
    width: 100vw;
    height: 100vh;
    background-image:linear-gradient(bottom,#ab64f6,#61dbf7);
    color: #fff;
}
.ball{
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0px;
}
.thewall{
    width: 100px;
    height: 20px;
    border-radius: 10px;
    background: #fff;
    position: fixed;
    bottom: 150px;
}
</style>
