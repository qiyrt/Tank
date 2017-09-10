//定义两个颜色数组，用来区分敌机和自己的战机
var myselfColor=new Array("#BA9658","#FEF26E");
var enmeyColor=new Array("#00A2B5","#00FEFE");


//定义炸弹的声音
var sound = require( "sound" );
var snd;
//定义一个炸弹类
function Bomb(x,y){
	this.x=x;
	this.y=y;
	this.isLive=true; //炸弹是否活的，默认true;
	//炸弹有一个生命值
	this.blood=9;
	//减生命值
	this.bloodDown=function(){
		if(this.blood>0){
			this.blood--;
		}else{
			//说明炸弹死亡
			this.isLive=false;
		}
	}
}


//子弹类
//type表示：这颗子弹是敌人的，还是自己的
//tank表示对象，说明这颗子弹，属于哪个坦克.
function Bullet(x,y,direct,speed,type,tank){
	this.x=x;
	this.y=y;
	this.direct=direct;
	this.speed=speed;
	this.timer=null;
	this.isLive=true;
	this.type=type;
	this.tank=tank;
	this.run=function run(){
		
			//子弹不前进的条件1.碰到边界，2. 碰到敌人坦克.
			if(this.x<=0||this.x>=400||this.y<=0||this.y>=300||this.isLive==false){
				//子弹要停止.
				window.clearInterval(this.timer);
				//子弹死亡
				this.isLive=false;

				if(this.type=="enemy"){
						this.tank.bulletIsLive=false;
				}
			}else{
				switch(this.direct){
					case 0:
							this.y-=this.speed;
							break;
					case 1:
							this.x+=this.speed;
							break;
					case 2:
							this.y+=this.speed;
							break;
					case 3:
							this.x-=this.speed;
							break;
				}
			}

			document.getElementById("data").innerText="子弹x="+this.x+" 子弹y="+this.y;
	}
}

//这是一个Tank类
function Tank(x,y,direct,color){
	
		this.x=x;
		this.y=y;
		this.speed=1;
		this.isLive=true;
		this.direct=direct;
		//一个坦克，需要两个颜色.
		this.color=color;
		//上移
		this.moveUp=function(){
			this.y-=this.speed;
			this.direct=0;
		}
		//向右
		this.moveRight=function(){
			this.x+=this.speed;
			this.direct=1;
		}

		//下移
		this.moveDown=function(){
			this.y+=this.speed;
			this.direct=2;
		}
		//左
		this.moveLeft=function(){
			this.x-=this.speed;
			this.direct=3;
		}
}

//定义一个myself类
	function myself(x,y,direct,color){
	//通过对象冒充，达到继承的效果
		this.tank=Tank;
		this.tank(x,y,direct,color);
		this.life=3;
		//增加一个函数，射击敌人坦克.
		this.shotEnemy=function(){			
			//创建子弹, 子弹的位置应该和myself有关系，并且和myself的方向有关
			switch(this.direct){
				case 0:
				myselfBullet=new Bullet(this.x+9,this.y,this.direct,1,"myself",this);
				break;
				case 1:
				myselfBullet=new Bullet(this.x+30,this.y+9,this.direct,1,"myself",this);
				break;
				case 2:
				myselfBullet=new Bullet(this.x+9,this.y+30,this.direct,1,"myself",this);
				break;
				case 3: //右
				myselfBullet=new Bullet(this.x,this.y+9,this.direct,1,"myself",this);
				break;
			}

			//把这个子弹对象放入到数组中	 -> push函数
			myselfBullets.push(myselfBullet);
			var timer=window.setInterval("myselfBullets["+(myselfBullets.length-1)+"].run()",50);
			myselfBullets[myselfBullets.length-1].timer=timer;

		}



	}

	//定义一个EnemyTank类
	function EnemyTank (x,y,direct,color){
		
		//也通过对象冒充，来继承Tank
		this.tank=Tank;
		this.count=0;
		this.bulletIsLive=true;
		
		this.tank(x,y,direct,color);

		this.run=function run(){
			
			//判断敌人的坦克当前方向
			switch(this.direct){
				
				case 0:
					if(this.y>0){
						this.y-=this.speed;
					}	
					break;
				case 1:
					if(this.x+30<400){
						this.x+=this.speed;
					}
					break;
				case 2:
					if(this.y+30<300){
						this.y+=this.speed;
					}
					break;
				case 3:
					if(this.x>0){
						this.x-=this.speed;
					}
					break;
			}
			//走40次，再改变方向
			if(this.count>40){
				this.direct=Math.round(Math.random()*3);//随机生成 0,1,2,3
				this.count=0;
			}
			this.count++;

			//判断子弹是否已经死亡，如果死亡，则增加新的一颗子弹
			if(this.bulletIsLive==false){
				//增加子弹,这是需要考虑当前这个敌人坦克的方向，在增加子弹
					switch(this.direct){
						case 0:
						etBullet=new Bullet(this.x+9,this.y,this.direct,1,"enemy",this);
						break;
						case 1:
						etBullet=new Bullet(this.x+30,this.y+9,this.direct,1,"enemy",this);
						break;
						case 2:
						etBullet=new Bullet(this.x+9,this.y+30,this.direct,1,"enemy",this);
						break;
						case 3: //右
						etBullet=new Bullet(this.x,this.y+9,this.direct,1,"enemy",this);
						break;
				}

				//把子弹添加到敌人子弹数组中
				enemyBullets.push(etBullet);
				//启动新子弹run
				var mytimer=window.setInterval("enemyBullets["+(enemyBullets.length-1)+"].run()",50);
				enemyBullets[enemyBullets.length-1].timer=mytimer;

				this.bulletIsLive=true;
			}

		}
	}

		//画出自己的子弹
		function drawmyselfBullet(){

				//现在要画出所有子弹
				for( var i=0;i<myselfBullets.length;i++){
					var myselfBullet=myselfBullets[i];
					if(myselfBullet!=null&&myselfBullet.isLive){
						cxt.fillStyle="#FEF26E";
						cxt.fillRect(myselfBullet.x,myselfBullet.y,2,2);
					}
				}

		}

		//用于画出敌人的子弹
		function drawEnemyBullet(){
			
			//现在要画出所有子弹
				for( var i=0;i<enemyBullets.length;i++){
					var etBullet=enemyBullets[i];
					if(etBullet.isLive){
						cxt.fillStyle="#00FEFE";
						cxt.fillRect(etBullet.x,etBullet.y,2,2);
					}
				}
		}
	
	//绘制坦克(敌人坦克和自己的坦克)
	function drawTank(tank){
	
		//说明所有的坦克都要isLive这个属性
		if(tank.isLive){
			switch(tank.direct){

			case 0: //上
			case 2:// 下
				cxt.fillStyle=tank.color[0];
				cxt.fillRect(tank.x,tank.y,5,30);
				cxt.fillRect(tank.x+15,tank.y,5,30);
				cxt.fillRect(tank.x+6,tank.y+5,8,20);
				cxt.fillStyle=tank.color[1];
				cxt.arc(tank.x+10,tank.y+15,4,0,Math.PI*2,true);
				cxt.fill();
				cxt.strokeStyle=tank.color[1];
				cxt.lineWidth=1.5;
				cxt.beginPath();
				cxt.moveTo(tank.x+10,tank.y+15);
				
				if(tank.direct==0){
				cxt.lineTo(tank.x+10,tank.y);
				}else if(tank.direct==2){
				cxt.lineTo(tank.x+10,tank.y+30);
				}

				cxt.closePath();
				cxt.stroke();
				break;
			case 1: //右和左
			case 3:
				cxt.fillStyle=tank.color[0];
				cxt.fillRect(tank.x,tank.y,30,5);
				cxt.fillRect(tank.x,tank.y+15,30,5);
				cxt.fillRect(tank.x+5,tank.y+6,20,8);
				cxt.fillStyle=tank.color[1];
				cxt.arc(tank.x+15,tank.y+10,4,0,Math.PI*2,true);
				cxt.fill();
				cxt.strokeStyle=tank.color[1];
				cxt.lineWidth=1.5;
				cxt.beginPath();
				cxt.moveTo(tank.x+15,tank.y+10);
				//向右
				if(tank.direct==1){
				cxt.lineTo(tank.x+30,tank.y+10);
				}else if(tank.direct==3){ //向左
				cxt.lineTo(tank.x,tank.y+10);
				}

				cxt.closePath();
				cxt.stroke();
				break;

			}
		}
	}

//用于判断我的子弹，是否击中了某个敌人坦克
function isHitEnemyTank(){
	
		//取出每颗子弹
		for(var i=0;i<myselfBullets.length;i++){
			
				//取出一颗子弹
				var myselfBullet=myselfBullets[i];
				if(myselfBullet.isLive){ //子弹是活的，才去判断
				//让这颗子弹去和遍历每个敌人坦克判断
				for(var j=0;j<enemyTanks.length;j++){
					
							var enemyTank=enemyTanks[j];
						
							if(enemyTank.isLive){
							//根据当时敌人坦克的方向来决定         同方向射击问题 ，子弹的速度大于坦克的速度，可以追上
							switch(enemyTank.direct){
								case 0: //敌人坦克向上
								case 2://敌人坦克向下
									if(myselfBullet.x>=enemyTank.x&&myselfBullet.x<=enemyTank.x+20
										&&myselfBullet.y>=enemyTank.y&&myselfBullet.y<=enemyTank.y+30){
										//把坦克isLive 设为false ,表示死亡
										enemyTank.isLive=false;
										//该子弹也死亡
										myselfBullet.isLive=false;
										
//										snd=sound.create( "sound/throw" );
										//创建一颗炸弹
										var bomb=new Bomb(enemyTank.x,enemyTank.y);
										//然后把该炸弹放入到bombs数组中
										bombs.push(bomb);
									}
								break;
								case 1: //敌人坦克向右
								case 3://敌人坦克向左
									if(myselfBullet.x>=enemyTank.x&&myselfBullet.x<=enemyTank.x+30
										&&myselfBullet.y>=enemyTank.y&&myselfBullet.y<=enemyTank.y+20){
										//把坦克isLive 设为false ,表示死亡
										enemyTank.isLive=false;
										myselfBullet.isLive=false;
										//创建一颗炸弹
										var bomb=new Bomb(enemyTank.x,enemyTank.y);
										//然后把该炸弹放入到bombs数组中
										bombs.push(bomb);
									}
								break;

							}

						}


				}
			}
		}
}



//画出坦克死亡的场景
function drawtankBomb(){
	
	for(var i=0;i<bombs.length;i++){
	
		//取出一颗炸弹
		var bomb=bombs[i];
		if(bomb.isLive){

			//更据当前这个炸弹的生命值，来画出不同的炸弹图片
			if(bomb.blood>6){  //显示最大炸弹图
				var img1=new Image();
				img1.src="img/bomb_1.gif";
				var x=bomb.x;
				var y=bomb.y;
				img1.onload=function(){
					cxt.drawImage(img1,x,y,30,30);
				}
			}else if(bomb.blood>3){
				var img2=new Image();
				img2.src="img/bomb_2.gif";
				var x=bomb.x;
				var y=bomb.y;
				img2.onload=function(){
					cxt.drawImage(img2,x,y,30,30);
				}
			}else {
				var img3=new Image();
				img3.src="img/bomb_3.gif";
				var x=bomb.x;
				var y=bomb.y;
				img3.onload=function(){
					cxt.drawImage(img3,x,y,30,30);
				}
			}

			bomb.bloodDown();
			if(bomb.blood<=0){
				bombs.splice(i,1);

			}
		}
	}
}


//自己的坦克被击中
function  isHitmyselfTank(){         
       for(var i=0;i<enemyBullets.length;i++)
       {
          var enemyBullet=enemyBullets[i];
          if(enemyBullet.isLive)
          { 
              if(myself.isLive)
              {
//					敌人子弹射击到我方坦克的条件:根据坦克的方向判断
//                 for(var j=0;j<enemyBullets.length;j++){
                    switch(myself.direct)
                    {
                       case 0:   //上
                       case 2:   //下
                            if(enemyBullet.x>=myself.x&&enemyBullet.x<=myself.x+20
										&&enemyBullet.y>=myself.y&&enemyBullet.y<=myself.y+30){
										//把坦克isLive 设为false ,表示死亡
										myself.isLive=false;
										//该子弹也死亡
										enemyBullet.isLive=false;
										//创建一颗炸弹
										var bomb=new Bomb(myself.x,myself.y);
										//然后把该炸弹放入到bombs数组中
										bombs.push(bomb);
										//给坦克复活的机会
										myself.life--;
										if(myself.life>0){
											myself.isLive=true;
											drawTank(myself);
										}
//										alert("GAME OVER");
									}
						    break;
					   case 1: //向右
					   case 3://向左
									if(enemyBullet.x>=myself.x&&enemyBullet.x<=myself.x+30
										&&enemyBullet.y>=myself.y&&enemyBullet.y<=myself.y+20){
										//把坦克isLive 设为false ,表示死亡
										myself.isLive=false;
										enemyBullet.isLive=false;

										//创建一颗炸弹
										var bomb=new Bomb(myself.x,myself.y);
										//然后把该炸弹放入到bombs数组中
										bombs.push(bomb);
										//给坦克复活的机会
										myself.life--;
										if(myself.life>0){
											myself.isLive=true;
											drawTank(myself);
										}
//										alert("GAME OVER");
										
									}
								break;  
                    }
//                  }
              }

          }
       }
}

//问题二    如何解决坦克的坐标重合的问题，即将坦克们都安置在不同坐标下

