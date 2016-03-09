#一个简单的SkyRTC示例
---
##简介
这是一个使用SkyRTC和SkyRTC-client搭建浏览器中音频、视频、文字聊天室的Demo

##安装和使用
1. 安装Node.js及npm环境
2. 下载源码到本地，并解压缩
3. 移动到解压后的目录下
4. 使用命令`npm install`安装所需要的库
5. 运行命令`node server.js`，建议配合`forever`
6. 访问`localhost:3000#roomName`查看效果，其中`roomName`为进入的房间名，不同房间的用户无法互相通信

##功能说明
支持划分房间的在线音频、视频、文字聊天，提供房间内文件共享功能

<<<<<<< HEAD
##SkyRTC项目链接
[SkyRTC项目](https://github.com/LingyuCoder/SkyRTC)

[SkyRTC-client项目](https://github.com/LingyuCoder/SkyRTC-client)
=======
Features:(general)
- Object-script engine
- 支持对所有物体附带脚本，支持用游戏脚本实现菜单和系统切换
- Object base and parent system
- 支持设置物体的父亲，设置位置继承模式，设置自动删除
- Multiplayer support
- 支持多人联机
- Replay
- 支持回放录像，支持分关卡回放路线，支持单机播放多人录像，支持联机观看录像
- Change canvas organization in game
- 支持用脚本调整画面布局
- Change render procedure in game
- 支持用脚本调整渲染流程
- 2D 3D canvas mixed rendering
- 支持同一个渲染器用2D和3D模式渲染canvas
- Shaders
- 支持可编程shaders
- Gamepads
- 支持手柄，支持手柄记忆
- Pause
- 支持暂停

Features:(dedicated)
- Bullet functions
- 子弹相关的函数
- Game state machine
- 游戏相关状态
- Player state machine
- 玩家状态的托管
- Circle hitbox check
- 判定（目前只有点对点的判定）
- Player movement
- 玩家移动
- Non-scipted effects
- 属性化的特效，如自动旋转，方向绑定，自动淡出等

Features:(sample)
- A fast layered sprite-shader with both 2d and webgl support
- 内置了一个默认的快速sprite渲染器，可以渲染2D或3D的canvas
- A misc shader for text/sector rendering 
- 内置了一个快捷渲染器，可以渲染文字、矩形至2D目标
- A Webgl DMA object for the sprite-shader
- A menu script
- A multiplayer connection scripts
- A pause script
- A test stage script
- A multiplayer server script
- A http server script
>>>>>>> origin/master
