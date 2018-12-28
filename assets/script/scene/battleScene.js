// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        camera:cc.Node,
        mainChar:cc.Node,
        touchLayer:cc.Node,
        touchMove:cc.Node,
        moveSp:cc.Node
    },

    onLoad () {
        this.init();
    },

    start () {

    },

    init:function () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_pairBit |cc.PhysicsManager.DrawBits.e_centerOfMassBit |cc.PhysicsManager.DrawBits.e_jointBit |cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -980);

        this.rigidbody = this.mainChar.getComponent(cc.RigidBody);

        this.touchLayer.on(cc.Node.EventType.TOUCH_START, this.startFunc, this);
        this.touchLayer.on(cc.Node.EventType.TOUCH_MOVE, this.moveFunc, this);
        this.touchLayer.on(cc.Node.EventType.TOUCH_END, this.endMoveFunc, this);
        this.touchLayer.on(cc.Node.EventType.TOUCH_CANCEL, this.endMoveFunc, this);

        this.rangeLen = 200;
        this.touchMove.active = false;
        this.touchPos = cc.Vec2.ZERO;
    },

    startFunc:function(event){
        this.touchMove.position = this.touchLayer.convertToNodeSpaceAR(event.touch.getLocation());
        this.touchMove.active = true;
    },

    moveFunc:function(event){
        this.touchPos = this.touchMove.convertToNodeSpaceAR(event.touch.getLocation());
        this.touchLen = this.touchPos.mag();
        if(this.touchLen > this.rangeLen){
            this.touchPos.x = this.rangeLen / this.touchLen * this.touchPos.x;
            this.touchPos.y = this.rangeLen / this.touchLen * this.touchPos.y;
        }
        this.moveSp.position = this.touchPos;
        this.moveAngle = Math.atan(this.touchPos.y / this.touchPos.x);
    },

    endMoveFunc:function(event){
        this.rigidbody.linearVelocity = cc.v2(this.touchPos.x * 10, this.touchPos.y * 10);
        this.moveSp.position = cc.Vec2.ZERO;
        this.touchPos = cc.Vec2.ZERO;
        this.touchMove.active = false;
    },

    update (dt) {
        this.cameraPos = this.mainChar.position;
        if(this.cameraPos.x < 0){
            this.cameraPos.x = 0;
        }else if(this.cameraPos.x > 2000 - cc.winSize.width + 200){
            this.cameraPos.x = 2000 - cc.winSize.width + 200;
        }
        this.cameraPos.y = 0;
        this.camera.position = this.cameraPos;
        // if(Math.abs(this.rigidbody.linearVelocity.x) < 40 && Math.abs(this.rigidbody.linearVelocity.y) < 20){
        //     this.rigidbody.linearVelocity = cc.v2(0, 0);
        // }
    }
});
