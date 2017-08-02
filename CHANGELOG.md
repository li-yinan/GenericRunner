## 2.4.0

### 增加了node 多次输出的能力

之前的每一个node被执行只能得到一次结果，这导致了有些场景使用非常不便

例如：setInterval类似的场景，需要定时的触发器，在比如我定义一个Koa的router，每次访问都会有一个结果产生

为了解决这些问题，GenericRunner增加了ContinousOutput的功能，可以让一个node多次产生结果

### 增加Interval node 和 koa router node

依赖多次输出特性完成了Interval node和koa router node



## 2.3.0

### 增加了service 功能

2.3.0增加了service功能，可以让一个node提供一个service，这个service会自动的传递给后续node，可以让结构更简单，举个栗子，比如要用headless开一个页面，并向后传递一个chrome的引用，就可以用service来提供，后续获取dom就无需再使用一个参数传递chrome了，直接使用service

为了让这种service方便管理，一个node需要提供service的时候需要明确指出service的名称，并显式调用注册函数来注册service，使用方需要显式声明需要使用的service，这些声明都可以被静态读取，方便程序使用

详细使用可参见openpage node（注册了chrome service），dom node（使用chrome service）

## 2.2.0

### 增加了对多个输入node的支持

增加了每个node对多个输入的支持，并且以此为基础增加了merge node，可以等待到多个异步输入都完成再继续执行

支持“多个分支并行执行，在某一时刻再合并到一起”的使用方式了

## 2.1.0

### 可以使用headless chrome查询一个页面的内容了

## 2.0.0

### 搭建了基础的环境，已经可以把引擎跑起来了
