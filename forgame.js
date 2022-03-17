enchant();
/*

Core
- rootScene
-- Sprite (bear)
Coreは空間。その中でゲームが作られる
 */


window.onload = function(){


    var core = new Core(320,320)
    core.fps = 15           //フレームの切り替わりの速さ(多いほど早い

    core.preload('chara1.png')
    core.preload('kaeru.png')
    core.onload = function(){

        var createTitleScene = function(){
            var scene = new Scene()
            var label = new Label('bear<br><br>試作品')

            label.textAlign = "center";
            label.y = 60;
            label.color = 'darkbrown';
            label.font = '28px "Arial"';
            scene.addChild(label)
            scene.backgroundColor = `rgba(255,230,0,1)`
            scene.addEventListener(Event.TOUCH_START, function(e){
                core.replaceScene(createGameScene())
            })
            return scene;
        }

        var createGameScene = function (){
            var scene = new Scene();


            var bear = new Sprite(32,32)            //Spriteは画像のこと。ここでは表示する画像の大きさを設定する。ここでフレームの大きさが決まる
            bear.image=core.assets['chara1.png']
            bear.x = 0
            bear.y = 0
            bear.frame = 0
            bear.scaleX = 1      //熊(スプライト)の拡大　Xは―1で反転する
            bear.scaleY = 1     //bear.scale(x,y)といった書き方もある

            bear.addEventListener('enterframe',function() {   /*手動で動かす場合  */
                if(core.input.left) {
                    this.frame = this.x % 3
                    this.x -= 5
                    this.scaleX = -1
                } else if(core.input.right) {
                    this.frame = this.x % 3
                    this.x += 5
                    this.scaleX = 1
                } else {
                    this.frame = 0
                }


                if (core.input.up) this.y -= 5
                if (core.input.down) this.y += 5
                if (this.x > 295) this.x = -10
                if (this.x <-10) this.x = 295
                if (this.y> 290) this.y = -5
                if (this.y <-5) this.y = 290
                //intersect
                if (this.intersect(enemy)) {
                    //   label.text = 'hit!';
                }
                //within
                if (this.within(enemy, 16)) {
                    label.text = 'HIT!'

                    core.replaceScene(createGameoverScene()),1000
                    function removeScene(scene){
                        while(scene.createGameScene){
                            scene.removeChild(scene.createGameScene)
                        }
                    }


                }




            /*以下自動で動かす場合
            this.x += 5;               //1フレームでどれだけ移動するか
            this.frame = this.age % 3    //合計フレーム数ageを3で割るあまりなのでフレームは0,1,2のどれかになる。フレームを変えたい場合は＋と任意の数で変える
            if (this.x > 320) this.x = 0   //画面からはみ出したらx座標を0に戻す
            //   this.rotate(2); //2度づつ回転 rotateが回転
            //   this.scale(1.01,1.01);   //縦横1.01倍づつ拡大(scale)　*/
            })

            /*

            var enemy = new Sprite(32,32)
            enemy.image = core.assets['kaeru.png']
            enemy.y = 65
            enemy.x = 80
            enemy.scaleX = -0.7
            enemy.scaleY = 0.6

             */

            var Enemy = Class.create(Sprite, {
                initialize: function(x,y) {
                    Sprite.call(this, 32, 32)
                    this.x = x
                    this.y = y
                    this.scaleX = -0.7
                    this.scaleY = 0.6
                    this.image = core.assets['kaeru.png']
                    this.on('enterframe', function() {
                        this.x -= 5;
                        //this.y = y+40*Math.sin(this.x*0.05);
                        this.rotate(2)
                        if (this.x < -10) this.x = 310
                    })
                    scene.addChild(this)
                }
            })
            var enemy = new Enemy(120, 65)
            enemy.addEventListener('enterframe',function() {
                this.y = 65+40*Math.sin(this.x*0.05);
                this.rotate(4)
            })
            var enemies = [];
            for (var i = 0; i < 25; i++){
                enemies[i] = new Enemy(rand(320), rand(320))
            }
            /*
            enemy.addEventListener('enterframe',function() {
                this.x -= 5;
                this.y = 65+40*Math.sin(this.x*0.05);
                this.rotate(2)
                if (this.x < 0) this.x = 320   //画面からはみ出したらx座標を0に戻す
            })
            */
            var label = new Label();
            label.x = 280;
            label.y = 5;
            label.color = 'darkred';
            label.font = '14px "Arial"';

            var fivsec = new Label();
            fivsec.x = 240;
            fivsec.y = 20;
            fivsec.color = 'red';
            fivsec.font = '14px "Arial"';
            scene.addChild(fivsec);   //要素(子、Child)に関してはすべてaddChild必要
            scene.addChild(label);
            scene.addChild(bear);
            //scene.addChild(enemy);
            scene.backgroundColor = 'rgba(40, 30, 100, 0.5)';

            setTimeout(function(){fivsec.text='5秒経過'},5000);   //指定するミリ秒後に関数を発動。一度きり　ややこしい
            return scene;
        }

        var createGameoverScene = function(){
            var scene = new Scene()
            var label = new Label(`Game Over<br>Please click to try again`)
            label.x = 40
            label.y = 20
            label.color = 'white'
            scene.backgroundColor = 'rgba(0,0,0,0.7)'
            scene.addChild(label)
            scene.addEventListener(Event.TOUCH_START, function(e){

                core.replaceScene(createTitleScene())
            })
            return scene
        }
        // ゲームの_rootSceneをタイトルシーンに置き換えます
        core.replaceScene(createTitleScene());
        // このようにcreateTitleScene() と書くと、シーンが関数内で作成されて
        // createTitleScene()と書かれた場所に代入されます

        /* 時間の表示
        label.text = '0';
        label.on('enterframe', function(){
            label.text = Math.floor(core.frame / core.fps);    //コアフレームがカウントされてるのでそれを参照し可視化する.
                                                    // fpsはフレームを秒で割ったものなので、コアのfpsでフレーム数を割ると秒数で表せる
                                                    // Math.floorは切り捨ての関数

        })        */


        /*
        bear.on('touchstart', function(){
            core.rootScene.removeChild(this)        //スマホでも可能　押したら消える
        })
        core.rootScene.on('touchstart', function(e){   //functionにeを設定すると押したところにxyを設定できる
            bear.x = e.x-16;
            bear.y = e.y-16;
        })                                */

    }
    core.start()
}
function rand(n) {
    return Math.floor(Math.random() * (n+1))
}
